import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This route runs in Node.js (not Edge) so it can safely use the standard Prisma client
// Next.js middleware will fetch this route to resolve legacy IDs

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const legacyId = searchParams.get("legacyId");

    if (!legacyId || isNaN(parseInt(legacyId))) {
        return NextResponse.json({ error: "Invalid legacyId" }, { status: 400 });
    }

    try {
        const article = await prisma.news.findUnique({
            where: {
                public_id: parseInt(legacyId)
            },
            select: {
                id: true // We only need the UUID
            }
        });

        if (article) {
            return NextResponse.json({ uuid: article.id });
        }

        return NextResponse.json({ uuid: null }, { status: 404 });
    } catch (error) {
        console.error("Lookup error:", error);
        return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }
}
