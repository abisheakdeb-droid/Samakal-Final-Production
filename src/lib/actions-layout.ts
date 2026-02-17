"use server";

import { sql } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { ArticleRow } from "@/types/database";
import { mapArticleToNewsItem } from "@/lib/actions-article-helpers";

export interface NewsSlot {
  slot_id: number; // 1 to 12
  current_news: ReturnType<typeof mapArticleToNewsItem> & {
    is_pinned: boolean;
    home_position: number | null;
  } | null;
}

/**
 * Fetches the layout data for the Visual Editor.
 * Returns an array of 12 slots, filled with pinned or auto-fallback items.
 */
export async function fetchHomeLayoutData(): Promise<NewsSlot[]> {
  try {
    // 1. Fetch Pinned Items
    const pinnedData = await sql`
      SELECT 
        articles.*, users.name as author
      FROM articles
      LEFT JOIN users ON articles.author_id = users.id
      WHERE 
        articles.status = 'published' AND 
        articles.published_at <= NOW() AND
        articles.is_pinned_home = true AND
        articles.home_position IS NOT NULL
      ORDER BY articles.home_position ASC
    `;

    const pinnedArticles = pinnedData.rows.map(row => ({
      ...mapArticleToNewsItem(row as ArticleRow),
      home_position: row.home_position,
      is_pinned: true
    }));

    const pinnedIds = pinnedArticles.map(a => a.id);

    // 2. Fetch Backfill Items (Latest)
    let backfillQuery;
    if (pinnedIds.length > 0) {
      backfillQuery = await sql`
        SELECT 
          articles.*, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
          articles.status = 'published' AND 
          articles.published_at <= NOW() AND
          articles.id <> ALL(${pinnedIds})
        ORDER BY articles.published_at DESC
        LIMIT 20
      `;
    } else {
      backfillQuery = await sql`
        SELECT 
          articles.*, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
          articles.status = 'published' AND 
          articles.published_at <= NOW()
        ORDER BY articles.published_at DESC
        LIMIT 20
      `;
    }

    const backfillArticles = backfillQuery.rows.map(row => ({
      ...mapArticleToNewsItem(row as ArticleRow),
      home_position: null,
      is_pinned: false
    }));

    // 3. Merge into 12 Slots
    const slots: NewsSlot[] = Array.from({ length: 12 }, (_, i) => ({
      slot_id: i + 1,
      current_news: null
    }));

    // Place pinned items
    pinnedArticles.forEach(article => {
      if (article.home_position && article.home_position >= 1 && article.home_position <= 12) {
        slots[article.home_position - 1].current_news = article as any;
      }
    });

    // Fill gaps with backfill
    let backfillIndex = 0;
    for (let i = 0; i < 12; i++) {
      if (slots[i].current_news === null) {
        if (backfillIndex < backfillArticles.length) {
          slots[i].current_news = backfillArticles[backfillIndex] as any;
          backfillIndex++;
        }
      }
    }

    return slots;
  } catch (error) {
    console.error('Fetch Home Layout Error:', error);
    return Array.from({ length: 12 }, (_, i) => ({ slot_id: i + 1, current_news: null }));
  }
}

/**
 * Searches and filters news for the sidebar feed.
 */
export async function fetchEditorFeed(options: {
  query?: string,
  category?: string,
  limit?: number,
  excludeIds?: string[]
} = {}) {
  const { query = '', category = '', limit = 20, excludeIds = [] } = options;

  try {
    const data = await sql`
      SELECT 
        articles.*, users.name as author
      FROM articles
      LEFT JOIN users ON articles.author_id = users.id
      WHERE 
        articles.status = 'published' AND 
        articles.published_at <= NOW() AND
        (articles.title ILIKE ${`%${query}%`} OR articles.content ILIKE ${`%${query}%`})
        AND (${category} = '' OR articles.category = ${category})
        AND (cardinality(${excludeIds}::text[]) = 0 OR articles.id <> ALL(${excludeIds}))
      ORDER BY articles.published_at DESC
      LIMIT ${limit}
    `;

    return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
  } catch (error) {
    console.error('Fetch Editor Feed Error:', error);
    return [];
  }
}

/**
 * Persists the layout changes to the database.
 * @param updates Array of { news_id: string, position: number | null }
 */
export async function saveHomeLayout(updates: { news_id: string, position: number | null }[]) {
  try {
    // 1. Clear current positions for the items involved (to prevent unique constraint issues if we add them later, 
    // though here we don't have a unique constraint on home_position yet, just good practice)

    // Actually, let's just do a batch update.
    // For each update:
    // If position is null: set home_position = NULL, is_pinned_home = false
    // If position is number: set home_position = position, is_pinned_home = true

    // We should also potentially unpin anything currently in those positions that isn't in the update list.
    // But usually, the UI will send the full state of the 12 slots.

    // 2. Perform updates
    for (const update of updates) {
      if (update.position === null) {
        await sql`
          UPDATE articles 
          SET home_position = NULL, is_pinned_home = false 
          WHERE id = ${update.news_id}
        `;
      } else {
        await sql`
          UPDATE articles 
          SET home_position = ${update.position}, is_pinned_home = true 
          WHERE id = ${update.news_id}
        `;
      }
    }

    // 3. Unpin anything that was pinned but not in the final 12 slots if the UI didn't include it.
    // (This depends on if the UI sends the full list of 12 slots or just changes).
    // Assuming UI sends all 12 slots:
    const updatedIds = updates.filter(u => u.position !== null).map(u => u.news_id);
    if (updatedIds.length > 0) {
      await sql`
          UPDATE articles 
          SET home_position = NULL, is_pinned_home = false 
          WHERE is_pinned_home = true AND id <> ALL(${updatedIds})
        `;
    } else {
      // If all unpinned
      await sql`UPDATE articles SET home_position = NULL, is_pinned_home = false WHERE is_pinned_home = true`;
    }

    // @ts-expect-error Next.js 16 signature mismatch
    revalidateTag('homepage-hero');
    // @ts-expect-error Next.js 16 signature mismatch
    revalidateTag('articles');

    return { success: true };
  } catch (error) {
    console.error('Save Home Layout Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
