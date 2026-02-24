import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate a strong secret locally or store it in .env
// For demo purposes, we define a fallback constant
const SYNC_SECRET = process.env.SYNC_SECRET || "samakal-sync-secret-2026-xYz";

export async function POST(request: Request) {
    try {
        // 1. Authorization Check
        const authHeader = request.headers.get("authorization");
        if (!authHeader || authHeader !== `Bearer ${SYNC_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Incoming Data
        const body = await request.json();

        // Validate we have an array of articles
        if (!body || !Array.isArray(body.articles)) {
            return NextResponse.json({ error: "Invalid payload format. Expected { articles: [...] }" }, { status: 400 });
        }

        const { articles } = body;
        let syncedCount = 0;
        const errors = [];

        // 3. Upsert Articles
        for (const article of articles) {
            if (!article.legacy_id || !article.title || !article.slug) {
                errors.push({ id: article.legacy_id, error: "Missing required fields" });
                continue;
            }

            try {
                await prisma.news.upsert({
                    where: {
                        // We use public_id exactly as the unique legacy_id indicator
                        public_id: parseInt(article.legacy_id)
                    },
                    update: {
                        title: article.title,
                        slug: article.slug,
                        content: article.content,
                        category: article.category,
                        parent_category: article.parent_category,
                        image: article.image_url,
                        sub_headline: article.sub_headline,
                        status: article.status || "published",
                        legacy_url: article.url,
                        publishedAt: article.published_at ? new Date(article.published_at) : new Date()
                    },
                    create: {
                        public_id: parseInt(article.legacy_id),
                        title: article.title,
                        slug: article.slug,
                        content: article.content,
                        category: article.category,
                        parent_category: article.parent_category,
                        image: article.image_url,
                        sub_headline: article.sub_headline,
                        status: article.status || "published",
                        legacy_url: article.url,
                        publishedAt: article.published_at ? new Date(article.published_at) : new Date()
                    }
                });
                syncedCount++;
            } catch (err) {
                console.error(`Error syncing article ${article.legacy_id}:`, err);
                errors.push({ id: article.legacy_id, error: String(err) });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully synced ${syncedCount} articles.`,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error("Sync API error:", error);
        return NextResponse.json({ error: "Internal server error during sync" }, { status: 500 });
    }
}
