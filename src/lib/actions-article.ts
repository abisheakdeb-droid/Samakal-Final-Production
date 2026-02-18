import { prisma } from "@/lib/prisma";
import { getCategoryTree } from "@/config/sub-categories";
import { CATEGORY_MAP } from "@/config/categories";

// Re-export reading functions
export {
  fetchArticlesByEvent,
  fetchMostReadArticles,
  fetchFeaturedArticles,
  getHomepageData,
  fetchArticleById,
  fetchLatestArticles,
  fetchArchiveArticles,
  fetchArticlesWithPagination,
  fetchArticlesBySearch,
  suggestArticles,
  fetchArticlesByDate,
  fetchArticlesByCategory,
} from './actions-article-read';

// Re-export writing functions
export * from './actions-article-write';

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

  // 1. Get all subcategories (slugs)
  const categorySlugs = category ? getCategoryTree(category) : [];

  // 2. Map slugs to Bengali Names (what's actually in DB)
  // Ensure we filter out undefined if a slug isn't in map (though seed script uses map or slug)
  const categoriesForQuery = categorySlugs.map(slug => CATEGORY_MAP[slug] || slug);

  try {
    const articles = await prisma.news.findMany({
      where: {
        AND: [
          // 1. Only show published articles
          { status: 'published' },

          // 2. Filter by Category Tree
          category
            ? {
              OR: [
                { category: { in: categoriesForQuery } },
                { parent_category: { in: categoriesForQuery } } // Optional: also check parent_category field if used
              ]
            }
            : {},

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
