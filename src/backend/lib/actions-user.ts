"use server";

import { sql } from "@/lib/db";
import { auth } from "@/auth";

export async function fetchAuthorProfile(id: string) {
    try {
        const users = await sql`
            SELECT id, name, email, role, avatar, created_at
            FROM users 
            WHERE id = ${id}
        `;
        return users.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}

export async function getUserStats() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return null;
    }
    const userId = session.user.id;

    try {
        // Get bookmark count
        const bookmarks = await sql`
            SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ${userId}
        `;

        // Get reading history count
        const history = await sql`
            SELECT COUNT(*) as count FROM reading_history WHERE user_id = ${userId}
        `;

        // Get user articles count (if they are an author)
        const articles = await sql`
            SELECT COUNT(*) as count FROM articles WHERE author_id = ${userId}
        `;

        return {
            bookmarksCount: Number(bookmarks.rows[0]?.count || 0),
            historyCount: Number(history.rows[0]?.count || 0),
            articlesCount: Number(articles.rows[0]?.count || 0)
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return null;
    }
}
