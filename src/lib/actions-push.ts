"use server";

import webpush from "web-push";
import { sql } from "@/lib/db";
import { auth } from "@/auth";

// Configure web-push with VAPID keys
// We use the keys from env, assuming they are set
const apiKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@example.com'
};

webpush.setVapidDetails(
    apiKeys.subject,
    apiKeys.publicKey,
    apiKeys.privateKey
);

export async function subscribeUser(sub: PushSubscriptionJSON) {
  const session = await auth();
  const userId = session?.user?.id || null;

  try {
    // sub.endpoint is main key
    // sub.keys.p256dh 
    // sub.keys.auth

    if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
        return { success: false, message: "Invalid subscription object" };
    }

    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (${userId}, ${sub.endpoint}, ${sub.keys.p256dh}, ${sub.keys.auth})
      ON CONFLICT (endpoint) DO UPDATE 
      SET user_id = ${userId}, created_at = NOW()
    `;

    return { success: true, message: "Subscribed successfully" };
  } catch (error) {
    console.error("Subscription Error:", error);
    return { success: false, message: "Failed to store subscription" };
  }
}

export async function unsubscribeUser(endpoint: string) {
    try {
        await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function sendNotificationToAll(message: string, url: string = "/") {
    // Only admins should basically do this, checking session helper
    const session = await auth();
    // Simplified check - real app should check role
    if (!session || !session.user) { 
        return { success: false, message: "Unauthorized" };
    }

    try {
        const subs = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions`;
        
        const payload = JSON.stringify({
            title: "সমকাল ব্রেকিং নিউজ",
            body: message,
            icon: "/samakal-logo.png",
            url: url
        });

        const promises = subs.rows.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: { auth: sub.auth, p256dh: sub.p256dh }
            };
            return webpush.sendNotification(pushConfig, payload).catch(err => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription expired, delete it
                    return sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`; 
                }
                console.error("Push Error", err);
            });
        });

        await Promise.all(promises);
        return { success: true, count: subs.rows.length };

    } catch (error) {
        console.error("Broadcast Error:", error);
        return { success: false, message: "Failed to broadcast" };
    }
}

// Required for client to get key
export async function getVapidPublicKey() {
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
}
