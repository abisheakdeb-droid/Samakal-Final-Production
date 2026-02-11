"use server";

import { sql } from "@/lib/db";
import { auth } from "@/auth";
import { mapArticleToNewsItem } from "@/lib/mappers";
import { ArticleRow } from "@/types/database";

export async function fetchRecommendedArticles(limit: number = 6) {
  const session = await auth();
  
  // If not logged in, we can't recommend based on history.
  // We could return trending, but let's return empty to let the UI decide (or hiding).
  if (!session || !session.user || !session.user.id) {
    return [];
  }

  const userId = session.user.id;
  
  // Check if userId is a valid UUID format
  // UUIDs are in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(userId)) {
    // Invalid UUID (e.g., "demo-user"), return empty recommendations
    console.warn(`Invalid UUID format for user ID: ${userId}, skipping recommendations`);
    return [];
  }

  try {
    // 1. Get user's top categories from history
    // We look at the last 50 viewed articles to build a preference profile
    const historyData = await sql`
      SELECT articles.category
      FROM reading_history
      JOIN articles ON reading_history.article_id = articles.id
      WHERE reading_history.user_id = ${userId}
      ORDER BY reading_history.viewed_at DESC
      LIMIT 50
    `;

    if (historyData.rows.length === 0) {
      return []; // No history = no tailored recommendations
    }

    // counts = { "Sports": 5, "Politics": 2 }
    const categoryCounts: Record<string, number> = {};
    historyData.rows.forEach(row => {
        const cat = row.category;
        if (cat) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
    });

    // Sort categories by frequency
    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3) // Top 3 categories
        .map(entry => entry[0]);

    if (topCategories.length === 0) return [];

    // 2. Query articles from these categories
    // EXCLUDE articles the user has already seen
    
    // Postgres array for ANY() needs careful formatting or multiple ORs.
    // For simplicity with `sql` tag, we can loop or use a WHERE logic.
    // Using simple IN clause logic if possible, but the template tag handles arrays differently.
    // Let's iterate or finding a better query.
    // Actually, `category = ANY(${topCategories})` works in postgres if passed as string array.
    
    // Build separate queries based on category count to avoid sql.unsafe
    let articlesData;
    
    if (topCategories.length === 1) {
      articlesData = await sql`
        SELECT 
          articles.id, articles.title, articles.slug, articles.status, articles.category,
          articles.views, articles.image, articles.created_at, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
          articles.status = 'published'
          AND articles.category = ${topCategories[0]}
          AND articles.id NOT IN (
              SELECT article_id FROM reading_history WHERE user_id = ${userId}
          )
        ORDER BY articles.created_at DESC
        LIMIT ${limit}
      `;
    } else if (topCategories.length === 2) {
      articlesData = await sql`
        SELECT 
          articles.id, articles.title, articles.slug, articles.status, articles.category,
          articles.views, articles.image, articles.created_at, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
          articles.status = 'published'
          AND (articles.category = ${topCategories[0]} OR articles.category = ${topCategories[1]})
          AND articles.id NOT IN (
              SELECT article_id FROM reading_history WHERE user_id = ${userId}
          )
        ORDER BY articles.created_at DESC
        LIMIT ${limit}
      `;
    } else {
      articlesData = await sql`
        SELECT 
          articles.id, articles.title, articles.slug, articles.status, articles.category,
          articles.views, articles.image, articles.created_at, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
          articles.status = 'published'
          AND (articles.category = ${topCategories[0]} OR articles.category = ${topCategories[1]} OR articles.category = ${topCategories[2]})
          AND articles.id NOT IN (
              SELECT article_id FROM reading_history WHERE user_id = ${userId}
          )
        ORDER BY articles.created_at DESC
        LIMIT ${limit}
      `;
    }

    return articlesData.rows.map((row) => mapArticleToNewsItem(row as ArticleRow));

  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
}
