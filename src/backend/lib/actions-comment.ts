"use server";

import { sql } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function fetchComments(articleId: string) {
  try {
    const data = await sql`
      SELECT 
        comments.id,
        comments.content,
        comments.created_at,
        users.name as author_name,
        users.avatar as author_avatar
      FROM comments
      LEFT JOIN users ON comments.user_id = users.id
      WHERE 
        comments.article_id = ${articleId} AND
        comments.status = 'approved'
      ORDER BY comments.created_at DESC
    `;
    
    return data.rows.map(row => ({
        id: row.id,
        content: row.content,
        author: row.author_name || 'Anonymous',
        avatar: row.author_avatar || null,
        created_at: row.created_at,
        timeAgo: getTimeAgo(new Date(row.created_at))
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function postComment(articleId: string, content: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { success: false, message: "আপনাকে অবশ্যই লগইন করতে হবে।" };
    }

    if (!content || content.trim().length === 0) {
        return { success: false, message: "কমেন্ট খালি হতে পারে না।" };
    }

    try {
        await sql`
            INSERT INTO comments (article_id, user_id, content, status)
            VALUES (${articleId}, ${session.user.id}, ${content}, 'approved')
        `;
        revalidatePath(`/article/${articleId}`);
        return { success: true, message: "মন্তব্য প্রকাশ করা হয়েছে।" };
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, message: "মন্তব্য সেভ করা যায়নি। আবার চেষ্টা করুন।" };
    }
}

function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " বছর আগে";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " মাস আগে";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " দিন আগে";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " ঘণ্টা আগে";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " মিনিট আগে";
    
    return "এইমাত্র";
}
