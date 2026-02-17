import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    try {
        const [bookmarks, history, comments] = await Promise.all([
            prisma.bookmark.findMany({
                where: { userId },
                include: { news: true },
                orderBy: { createdAt: "desc" },
            }),
            prisma.readingHistory.findMany({
                where: { userId },
                include: { news: true },
                orderBy: { viewedAt: "desc" },
                take: 50,
            }),
            prisma.comment.findMany({
                where: { userId },
                include: { news: true },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            bookmarks,
            history,
            comments,
        });
    } catch (error) {
        console.error("[PROFILE_GET_ERROR] Deep Error Log:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : null,
            userId,
        });
        return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : "Unknown"}`, { status: 500 });
    }
}
