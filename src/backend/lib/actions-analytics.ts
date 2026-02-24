"use server";

import { sql } from "@/lib/db";

export async function fetchAnalyticsOverview() {
  try {
    // 1. Total Articles
    const countResult = await sql`SELECT COUNT(*) FROM articles`;
    const totalArticles = parseInt(countResult.rows[0].count);

    // 2. Total Views (Sum of views column)
    const viewsResult = await sql`SELECT SUM(views) as total_views FROM articles`;
    const totalViews = parseInt(viewsResult.rows[0].total_views) || 0;

    // 3. Avg Views per Article
    const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

    // 4. Drafts Count
    const draftResult = await sql`
        SELECT COUNT(*) FROM articles WHERE status = 'draft'
    `;
    const totalDrafts = parseInt(draftResult.rows[0].count);

    // 5. Active Readers (24h) - Unique users who viewed articles
    const activeUsersResult = await sql`
        SELECT COUNT(DISTINCT user_id) 
        FROM reading_history 
        WHERE viewed_at > NOW() - INTERVAL '24 hours'
    `;
    const activeUsers24h = parseInt(activeUsersResult.rows[0].count);

    // 6. Total History Records (Total reads tracked)
    const historyCountResult = await sql`SELECT COUNT(*) FROM reading_history`;
    const totalHistoryRecords = parseInt(historyCountResult.rows[0].count);

    return {
      totalArticles,
      totalViews,
      avgViews,
      totalDrafts,
      activeUsers24h,
      totalHistoryRecords
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      totalArticles: 0,
      totalViews: 0,
      avgViews: 0,
      totalDrafts: 0,
      activeUsers24h: 0,
      totalHistoryRecords: 0
    };
  }
}

export async function fetchTopArticles(limit: number = 5) {
    try {
        const data = await sql`
            SELECT id, title, views, category
            FROM articles
            ORDER BY views DESC NULLS LAST
            LIMIT ${limit}
        `;
        return data.rows.map(row => ({
            id: row.id,
            title: row.title,
            views: row.views || 0,
            category: row.category
        }));
    } catch {
        return [];
    }
}

export async function fetchCategoryStats() {
    try {
        const data = await sql`
            SELECT 
                category, 
                COUNT(*) as article_count, 
                SUM(views) as total_views,
                AVG(views) as avg_views
            FROM articles
            WHERE category IS NOT NULL
            GROUP BY category
            ORDER BY total_views DESC
            LIMIT 5
        `;
        
        return data.rows.map(row => ({
            category: row.category,
            articles: parseInt(row.article_count),
            totalViews: parseInt(row.total_views) || 0,
            avgViews: Math.round(row.avg_views) || 0
        }));
    } catch {
        return [];
    }
}
