"use server";

import { sql } from "@/lib/db";
import { headers } from "next/headers";
import crypto from 'crypto';

/**
 * Logs a visitor to the database.
 * Uses IP hash + User Agent to create a semi-unique identifier without storing PII.
 */
export async function logVisitor(articleId?: string, path: string = '/') {
  try {
     const headersList = await headers();
     const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
     const userAgent = headersList.get('user-agent') || 'Unknown';
     
     // Create a hash of IP to avoid storing raw IP addresses (privacy)
     const ipHash = crypto.createHash('sha256').update(ip + userAgent).digest('hex');

     await sql`
       INSERT INTO visitor_logs (article_id, ip_hash, user_agent, path)
       VALUES (${articleId || null}, ${ipHash}, ${userAgent}, ${path})
     `;
  } catch (error) {
    console.error('Failed to log visitor:', error);
    // Fail silently to not impact user experience
  }
}

/**
 * Fetches visiting traffic for the last 60 minutes, grouped by 5-minute intervals.
 * Used for the Live Pulse graph.
 */
export async function fetchRealTimeTraffic() {
    try {
        // Fetch counts for last hour, grouped by minute buckets
        const data = await sql`
            SELECT 
                to_char(date_trunc('minute', visited_at), 'HH24:MI') as time_bucket,
                COUNT(*) as visitor_count
            FROM visitor_logs
            WHERE visited_at > NOW() - INTERVAL '1 hour'
            GROUP BY 1
            ORDER BY 1 ASC
        `;

        // We need to fill in gaps for a smooth graph if database has holes
        const result = data.rows.map(row => ({
            time: row.time_bucket,
            visitors: parseInt(row.visitor_count)
        }));

        return result;
    } catch (error) {
        console.error('Failed to fetch real-time traffic:', error);
        return [];
    }
}

/**
 * Gets the total number of unique visitors (approx) in the last 30 minutes.
 */
export async function fetchCurrentActiveUsers() {
    try {
        const data = await sql`
            SELECT COUNT(DISTINCT ip_hash) as active_users
            FROM visitor_logs
            WHERE visited_at > NOW() - INTERVAL '30 minutes'
        `;
        return parseInt(data.rows[0].active_users) || 0;
    } catch {
        return 0;
    }
}
