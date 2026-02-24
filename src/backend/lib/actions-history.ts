"use server";

import { sql } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { mapArticleToNewsItem } from "@/lib/mappers";
import { ArticleRow, ArticleImageRow, ArticleContributorRow } from "@/types/database";

// Record a view for an article
export async function recordView(articleId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { success: false, message: "Not authenticated" };
    }

    const userId = session.user.id;

    try {
        await sql`
            INSERT INTO reading_history (user_id, article_id, viewed_at)
            VALUES (${userId}, ${articleId}, NOW())
            ON CONFLICT (user_id, article_id) 
            DO UPDATE SET viewed_at = NOW();
        `;
        return { success: true };
    } catch (error) {
        console.error("Failed to record view:", error);
        return { success: false, error: "Database error" };
    }
}

// Fetch reading history for the current user
export async function fetchReadingHistory() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return [];
    }

    const userId = session.user.id;

    try {
        const data = await sql`
            SELECT 
                articles.id,
                articles.title,
                articles.slug,
                articles.status,
                articles.category,
                articles.image,
                articles.created_at,
                articles.news_type,
                users.name as author,
                reading_history.viewed_at
            FROM reading_history
            JOIN articles ON reading_history.article_id = articles.id
            LEFT JOIN users ON articles.author_id = users.id
            WHERE reading_history.user_id = ${userId}
            ORDER BY reading_history.viewed_at DESC
            LIMIT 50
        `;

        if (data.rows.length === 0) return [];

         // Helper to fetch images/contributors if we wanted full detail, 
         // but for history list, basic info is usually enough.
         // We'll stick to basic ArticleRow mapping.

        return data.rows.map(row => {
            const newsItem = mapArticleToNewsItem(row as ArticleRow);
            // Append viewedAt specific to history if needed, or just return NewsItem
            return {
                ...newsItem,
                viewedAt: row.viewed_at // Add this if UI displays "Viewed 2 mins ago"
            };
        });

    } catch (error) {
        console.error("Failed to fetch reading history:", error);
        return [];
    }
}
