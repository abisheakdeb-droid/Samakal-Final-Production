

import { prisma } from "@/lib/prisma";

// Re-export existing barrels to maintain compatibility
export * from "./actions-article-read";
export * from "./actions-article-write";

export async function getArticles({
  query,
  category,
  page = 1,
  limit = 20,
}: {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  try {
    const articles = await prisma.news.findMany({
      where: {
        AND: [
          // 1. Only show published articles
          { status: 'published' },

          // 2. Filter by Category string (Match actual schema)
          category ? { category: category } : {},

          // 3. Search Query (if exists)
          query ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ]
          } : {}
        ]
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
      skip: skip,
    });

    // Map fields for frontend compatibility if necessary (e.g. sub_headline -> summary)
    return articles.map(article => ({
      ...article,
      summary: article.sub_headline,
      thumbnail: article.image
    }));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}
