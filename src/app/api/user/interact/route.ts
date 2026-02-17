import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { action, newsId, type } = await req.json();

        if (!newsId) {
            return new NextResponse("Missing newsId", { status: 400 });
        }

        // Toggle Bookmark
        if (action === "bookmark") {
            const existing = await prisma.bookmark.findUnique({
                where: {
                    userId_newsId: {
                        userId: session.user.id,
                        newsId: newsId,
                    },
                },
            });

            if (existing) {
                await prisma.bookmark.delete({
                    where: { id: existing.id },
                });
                return NextResponse.json({ bookmarked: false });
            } else {
                // Create a placeholder news entry if it doesn't exist to satisfy foreign key
                await prisma.news.upsert({
                    where: { id: newsId },
                    update: {},
                    create: { id: newsId, title: "Redirecting...", slug: newsId }
                });

                await prisma.bookmark.create({
                    data: {
                        userId: session.user.id,
                        newsId: newsId,
                    },
                });
                return NextResponse.json({ bookmarked: true });
            }
        }

        // Toggle Reaction
        if (action === "reaction") {
            const existing = await prisma.reaction.findUnique({
                where: {
                    userId_newsId: {
                        userId: session.user.id,
                        newsId: newsId,
                    },
                },
            });

            if (existing && existing.type === type) {
                await prisma.reaction.delete({
                    where: { id: existing.id },
                });
                return NextResponse.json({ reacted: false });
            } else {
                await prisma.news.upsert({
                    where: { id: newsId },
                    update: {},
                    create: { id: newsId, title: "Redirecting...", slug: newsId }
                });

                await prisma.reaction.upsert({
                    where: {
                        userId_newsId: {
                            userId: session.user.id,
                            newsId: newsId,
                        },
                    },
                    update: { type },
                    create: {
                        userId: session.user.id,
                        newsId: newsId,
                        type,
                    },
                });
                return NextResponse.json({ reacted: true, type });
            }
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error) {
        console.error("[INTERACT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
