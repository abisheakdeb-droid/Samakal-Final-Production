"use server";

import { sql } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { mapArticleToNewsItem } from "@/lib/mappers"; // Updated import
import { ArticleRow } from "@/types/database";

export async function toggleBookmark(articleId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { success: false, message: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    // Check if exists
    const existing = await sql`
      SELECT id FROM bookmarks 
      WHERE user_id = ${userId} AND article_id = ${articleId}
    `;

    if (existing.rows.length > 0) {
      // Remove
      await sql`
        DELETE FROM bookmarks 
        WHERE user_id = ${userId} AND article_id = ${articleId}
      `;
      revalidatePath(`/article/${articleId}`);
      revalidatePath('/user/bookmarks');
      return { success: true, isBookmarked: false, message: "Bookmark removed" };
    } else {
      // Add
      await sql`
        INSERT INTO bookmarks (user_id, article_id)
        VALUES (${userId}, ${articleId})
      `;
      revalidatePath(`/article/${articleId}`);
      revalidatePath('/user/bookmarks');
      return { success: true, isBookmarked: true, message: "Article saved" };
    }
  } catch (error) {
    console.error("Bookmark Error:", error);
    return { success: false, message: "Failed to toggle bookmark" };
  }
}

export async function checkIsBookmarked(articleId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return false;
  }
  const userId = session.user.id;

  try {
    const existing = await sql`
      SELECT id FROM bookmarks 
      WHERE user_id = ${userId} AND article_id = ${articleId}
    `;
    return existing.rows.length > 0;
  } catch (error) {
    return false;
  }
}

export async function fetchBookmarkedArticles() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return [];
  }
  const userId = session.user.id;

  try {
    // Join bookmarks with articles
    const data = await sql`
      SELECT 
        articles.id,
        articles.title,
        articles.slug,
        articles.status,
        articles.category,
        articles.views,
        articles.image,
        articles.created_at,
        articles.content,
        users.name as author
      FROM bookmarks
      JOIN articles ON bookmarks.article_id = articles.id
      LEFT JOIN users ON articles.author_id = users.id
      WHERE bookmarks.user_id = ${userId}
      ORDER BY bookmarks.created_at DESC
    `;

    // Re-use usage of mapArticleToNewsItem, assuming it's exported from actions-article
    // If NOT exported, we need to export it in next step. For now I assume I made it exported or will do so.
    // WARNING: Previous view showed it was NOT exported. I must export it.
    
    // I will duplicate map logic slightly here if mapArticleToNewsItem is not available, 
    // OR I will verify actions-article.ts again.
    // In step 31 view, it was NOT exported "function mapArticleToNewsItem".
    // I plan to export it in this or next step.
    
    // To be safe, I'll return data mapping manually for now or use 'any' if necessary to fix later.
    // Ideally I export it.
    
    return data.rows.map(row => ({
       id: row.id,
       title: row.title,
       slug: row.slug,
       category: row.category,
       image: row.image || '/placeholder.svg',
       author: row.author || 'Desk',
       date: new Date(row.created_at).toLocaleDateString('bn-BD'),
       time: 'Saved', // Placeholder
       summary: ''
    }));
  } catch (error) {
    console.error("Fetch Bookmarks Error:", error);
    return [];
  }
}
