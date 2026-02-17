import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { newsId } = await req.json();

        if (!newsId) {
            return new NextResponse("Missing newsId", { status: 400 });
        }

        // Upsert news skeleton
        await prisma.news.upsert({
            where: { id: newsId },
            update: {},
            create: {
                id: newsId,
                title: "News Item",
                slug: newsId
            }
        });

        // Log reading history
        await prisma.readingHistory.create({
            data: {
                userId: session.user.id,
                newsId: newsId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[HISTORY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prisma.readingHistory.deleteMany({
            where: {
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[HISTORY_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
