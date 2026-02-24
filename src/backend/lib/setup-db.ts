"use server";

import { sql } from "@/lib/db";

export async function createCommentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'approved',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    return { success: true, message: "Comments table created successfully." };
  } catch (error) {
    console.error("Setup Error:", error);
    return { success: false, message: `Failed to create table: ${error}` };
  }
}

export async function createBookmarksTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, article_id)
      );
    `;
    return { success: true, message: "Bookmarks table created successfully." };
  } catch (error) {
    console.error("Setup Error:", error);
    return { success: false, message: `Failed to create table: ${error}` };
  }
}

export async function createReadingHistoryTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reading_history (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        viewed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, article_id)
      );
    `;
    return { success: true, message: "Reading History table created successfully." };
  } catch (error) {
    console.error("Setup Error:", error);
    return { success: false, message: `Failed to create table: ${error}` };
  }
}

export async function createPushSubscriptionsTable() {
  try {
    // endpoint is often long URL, p256dh and auth are strings from PushSubscriptionJSON
    await sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for anon subs
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    return { success: true, message: "Push Subscriptions table created successfully." };
  } catch (error) {
    console.error("Setup Error:", error);
    return { success: false, message: `Failed to create table: ${error}` };
  }
}
