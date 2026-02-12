"use server";

import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { ArticleRow, ArticleImageRow, ArticleContributorRow } from "@/types/database";
import { getBengaliCategory } from "@/utils/category";
import { normalizeCategory } from "@/utils/normalize-category";
import { mapArticleToNewsItem } from "@/lib/actions-article-helpers";

export const fetchArticles = cache(
  unstable_cache(
    async (query?: string) => {
      try {
        const data = await sql`
          SELECT 
            articles.id,
            articles.title,
            articles.slug,
            articles.status,
            articles.category,
            articles.views,
            articles.image,
            articles.created_at,
            articles.scheduled_at,
            users.name as author
          FROM articles
          LEFT JOIN users ON articles.author_id = users.id
          WHERE 
            articles.title ILIKE ${`%${query || ''}%`} OR
            articles.category ILIKE ${`%${query || ''}%`}
          ORDER BY articles.created_at DESC
          LIMIT 10
        `;

        return data.rows.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          status: article.status,
          category: article.category,
          image: article.image,
          created_at: article.created_at,
          scheduled_at: article.scheduled_at,
          author: article.author,
          views: article.views || 0,
          date: new Date(article.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        }));
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch articles.');
      }
    },
    ['articles-list'],
    { revalidate: 60, tags: ['articles'] }
  )
);

export async function fetchArticleById(id: string) {
    try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let dataWithAuthor;

        if (isUUID) {
             dataWithAuthor = await sql`
              SELECT 
                articles.id, articles.title, articles.slug, articles.status, articles.category,
                articles.views, articles.image, articles.created_at, articles.content,
                articles.sub_headline, articles.news_type, articles.location,
                articles.video_url, articles.video_thumbnail, articles.source, articles.source_url,
                users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE articles.id = ${id}
            `;
        } else if (/^\d+$/.test(id)) {
             dataWithAuthor = await sql`
              SELECT 
                articles.id, articles.title, articles.slug, articles.status, articles.category,
                articles.views, articles.image, articles.created_at, articles.content,
                articles.sub_headline, articles.news_type, articles.location,
                articles.video_url, articles.video_thumbnail, articles.source, articles.source_url,
                users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE articles.public_id = ${parseInt(id)}
            `;
        } else {
             dataWithAuthor = await sql`
              SELECT 
                articles.id, articles.title, articles.slug, articles.status, articles.category,
                articles.views, articles.image, articles.created_at, articles.content,
                articles.sub_headline, articles.news_type, articles.location,
                articles.video_url, articles.video_thumbnail, articles.source, articles.source_url,
                users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE articles.slug = ${id}
            `;
        }
        
        if (dataWithAuthor.rows.length === 0) return null;

        const articleData = dataWithAuthor.rows[0];
        const articleId = articleData.id;

        const [images, contributors, tags] = await Promise.all([
            fetchArticleImages(articleId),
            fetchArticleContributors(articleId),
            fetchArticleTags(articleId)
        ]);

        return mapArticleToNewsItem(articleData as ArticleRow, { 
            images: images as ArticleImageRow[], 
            contributors: contributors as ArticleContributorRow[], 
            tags 
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch article.');
    }
}

export const fetchLatestArticles = cache(
  unstable_cache(
    async (limit: number = 10) => {
      try {
        const data = await sql`
          SELECT 
            articles.id, articles.title, articles.slug, articles.status, articles.category,
            articles.views, articles.image, articles.created_at, articles.content,
            articles.sub_headline, articles.news_type, articles.location,
            articles.video_url, users.name as author
          FROM articles
          LEFT JOIN users ON articles.author_id = users.id
          WHERE articles.status = 'published' AND articles.published_at <= NOW()
          ORDER BY articles.published_at DESC
          LIMIT ${limit}
        `;
        return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
      } catch (error) {
        console.error('Database Error:', error);
        return [];
      }
    },
    ['latest-articles'],
    { revalidate: 60, tags: ['articles', 'latest'] }
  )
);

export const fetchArticlesByCategory = cache(
  unstable_cache(
    async (category: string, limit: number = 10, isParentCategory: boolean = false, parentCategory?: string) => {
      try {
        const normalizedCategory = normalizeCategory(category);
        console.log('fetchArticlesByCategory:', { category, normalizedCategory, isParentCategory, parentCategory });
        let data;
        
        if (isParentCategory) {
          const isSaradesh = normalizedCategory === 'সারাদেশ';
          
          if (isSaradesh) {
            data = await sql`
              SELECT 
                articles.id, articles.title, articles.slug, articles.status,
                articles.category, articles.parent_category, articles.views,
                articles.image, articles.created_at, articles.content,
                articles.sub_headline, articles.news_type, articles.location,
                articles.video_url, users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE 
                articles.status = 'published' AND articles.published_at <= NOW() AND
                (
                  articles.parent_category = 'সারাদেশ' OR 
                  articles.category = 'সারাদেশ' OR
                  articles.parent_category IN ('ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ')
                )
              ORDER BY articles.published_at DESC
              LIMIT ${limit}
            `;
          } else {
            data = await sql`
              SELECT 
                articles.id, articles.title, articles.slug, articles.status,
                articles.category, articles.parent_category, articles.views,
                articles.image, articles.created_at, articles.content,
                articles.sub_headline, articles.news_type, articles.location,
                articles.video_url, users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE 
                articles.status = 'published' AND articles.published_at <= NOW() AND
                (articles.parent_category = ${normalizedCategory} OR articles.category = ${normalizedCategory})
              ORDER BY articles.published_at DESC
              LIMIT ${limit}
            `;
          }
        } else {
        if (parentCategory) {
          data = await sql`
            SELECT 
              articles.id, articles.title, articles.slug, articles.status,
              articles.category, articles.parent_category, articles.views,
              articles.image, articles.created_at, articles.content,
              articles.sub_headline, articles.news_type, articles.location,
              articles.video_url, users.name as author
            FROM articles
            LEFT JOIN users ON articles.author_id = users.id
            WHERE 
              articles.status = 'published' AND articles.published_at <= NOW() AND
              articles.category ILIKE ${normalizedCategory} AND
              articles.parent_category = ${parentCategory}
            ORDER BY articles.published_at DESC
            LIMIT ${limit}
          `;
        } else {
          data = await sql`
            SELECT 
              articles.id, articles.title, articles.slug, articles.status,
              articles.category, articles.parent_category, articles.views,
              articles.image, articles.created_at, articles.content,
              articles.sub_headline, articles.news_type, articles.location,
              articles.video_url, users.name as author
            FROM articles
            LEFT JOIN users ON articles.author_id = users.id
            WHERE 
              articles.status = 'published' AND articles.published_at <= NOW() AND
              articles.category ILIKE ${normalizedCategory}
            ORDER BY articles.published_at DESC
            LIMIT ${limit}
          `;
        }
        }
    
        return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
      } catch (error) {
        console.error('Database Error:', error);
        return [];
      }
    },
    ['articles-by-category'],
    { revalidate: 60, tags: ['articles'] }
  )
);

export const fetchFeaturedArticles = cache(
  unstable_cache(
    async (limit: number = 6) => {
      try {
        const data = await sql`
          SELECT 
            articles.id, articles.title, articles.slug, articles.status, articles.category,
            articles.views, articles.image, articles.created_at, articles.content,
            articles.sub_headline, articles.news_type, articles.location,
            articles.video_url, articles.is_featured, articles.is_prime,
            users.name as author
          FROM articles
          LEFT JOIN users ON articles.author_id = users.id
          WHERE articles.status = 'published' AND articles.published_at <= NOW() AND articles.is_featured = true
          ORDER BY articles.published_at DESC
          LIMIT ${limit}
        `;
        return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
      } catch (error) {
        console.error('Database Error:', error);
        return [];
      }
    },
    ['featured-articles'],
    { revalidate: 60, tags: ['articles', 'featured'] }
  )
);

export async function fetchArticlesWithPagination(offset: number = 0, limit: number = 20) {
  try {
    const data = await sql`
      SELECT 
        articles.id, articles.title, articles.slug, articles.category,
        articles.parent_category, articles.views, articles.image, 
        articles.created_at, articles.content, articles.sub_headline,
        users.name as author
      FROM articles
      LEFT JOIN users ON articles.author_id = users.id
      WHERE articles.status = 'published'
      ORDER BY articles.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export const fetchMostReadArticles = cache(
  unstable_cache(
    async (limit: number = 6) => {
      try {
        const data = await sql`
          SELECT 
            articles.id, articles.title, articles.slug, articles.status, articles.category,
            articles.views, articles.image, articles.created_at, users.name as author
          FROM articles
          LEFT JOIN users ON articles.author_id = users.id
          WHERE articles.status = 'published'
          ORDER BY COALESCE(articles.views, 0) DESC, articles.created_at DESC
          LIMIT ${limit}
        `;
        return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
      } catch (error) {
        console.error('Database Error:', error);
        return [];
      }
    },
    ['most-read-articles'],
    { revalidate: 300, tags: ['articles', 'most-read'] }
  )
);

export async function searchArticles(query: string) {
    try {
      const data = await sql`
        SELECT 
          articles.id, articles.title, articles.slug, articles.status, articles.category,
          articles.views, articles.image, articles.created_at, articles.content,
          articles.sub_headline, articles.news_type, articles.location,
          articles.video_url, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE articles.status = 'published' AND (articles.title ILIKE ${`%${query}%`} OR articles.content ILIKE ${`%${query}%`} OR (articles.public_id::text = ${query}))
        ORDER BY articles.created_at DESC
        LIMIT 20
      `;
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

export async function suggestArticles(query: string) {
    try {
      if (!query || query.length < 2) return [];
      const data = await sql`
        SELECT articles.id, articles.title, articles.slug, articles.category, articles.image, articles.created_at, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE articles.status = 'published' AND (articles.title ILIKE ${`%${query}%`} OR articles.slug ILIKE ${`%${query}%`})
        ORDER BY articles.created_at DESC
        LIMIT 6
      `;
      return data.rows.map(row => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          category: getBengaliCategory(row.category),
          author: row.author || 'Desk',
          date: new Date(row.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
          image: row.image || '/placeholder.svg'
      }));
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

export async function fetchArticlesBySearch({ query, category, dateRange, limit = 20, offset = 0 }: {
    query: string; category?: string; dateRange?: string; sort?: string; limit?: number; offset?: number;
}) {
    try {
        const decodedQuery = decodeURIComponent(query);
        const searchPattern = `%${decodedQuery}%`;
        let data;
        
        if (!dateRange || dateRange === 'all') {
            if (!category || category === 'all') {
                data = await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                `;
            } else {
                data = await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND (articles.category = ${category} OR articles.parent_category = ${category})
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                `;
            }
        } else {
            const hasCategory = category && category !== 'all';
            if (dateRange === 'today') {
                data = hasCategory ? await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND articles.created_at >= NOW() - INTERVAL '24 HOURS'
                        AND (articles.category = ${category} OR articles.parent_category = ${category})
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                ` : await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND articles.created_at >= NOW() - INTERVAL '24 HOURS'
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                `;
            } else if (dateRange === 'week') {
                data = hasCategory ? await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND articles.created_at >= NOW() - INTERVAL '7 DAYS'
                        AND (articles.category = ${category} OR articles.parent_category = ${category})
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                ` : await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND articles.created_at >= NOW() - INTERVAL '7 DAYS'
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                `;
            } else { // month
                data = hasCategory ? await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND articles.created_at >= NOW() - INTERVAL '30 DAYS'
                        AND (articles.category = ${category} OR articles.parent_category = ${category})
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                ` : await sql`
                    SELECT articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
                        articles.views, articles.image, articles.created_at, articles.content, 
                        articles.sub_headline, users.name as author
                    FROM articles
                    LEFT JOIN users ON articles.author_id = users.id
                    WHERE articles.status = 'published' AND articles.created_at >= NOW() - INTERVAL '30 DAYS'
                        AND (articles.title ILIKE ${searchPattern} OR articles.sub_headline ILIKE ${searchPattern} OR articles.content ILIKE ${searchPattern})
                    ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
                `;
            }
        }
        return data.rows.map((row) => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
        console.error('Search Error:', error);
        return [];
    }
}

export async function fetchArticlesByEvent(eventId: string, limit: number = 6) {
    try {
      const data = await sql`
        SELECT articles.id, articles.title, articles.slug, articles.status, articles.category, articles.views, articles.image, articles.created_at, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE articles.status = 'published' AND articles.event_id = ${eventId}
        ORDER BY articles.created_at DESC LIMIT ${limit}
      `;
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

export async function fetchArticlesByDate(date: string) {
    try {
      const data = await sql`
        SELECT articles.id, articles.title, articles.slug, articles.status, articles.category, articles.views, articles.image, articles.created_at, articles.content, articles.sub_headline, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE articles.status = 'published' AND articles.created_at::date = ${date}::date
        ORDER BY articles.created_at DESC
      `;
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

export async function fetchArchiveArticles({ startDate, endDate, category, limit = 20, offset = 0 }: {
    startDate?: string; endDate?: string; category?: string; limit?: number; offset?: number;
}) {
    try {
        const normalizedCategory = category && category !== 'all' ? normalizeCategory(category) : null;
        const data = await sql`
            SELECT articles.id, articles.title, articles.slug, articles.status, articles.category, articles.parent_category, articles.views, articles.image, articles.created_at, articles.content, articles.sub_headline, users.name as author
            FROM articles
            LEFT JOIN users ON articles.author_id = users.id
            WHERE articles.status = 'published' AND (${startDate || null}::text IS NULL OR articles.created_at >= ${startDate}::date) AND (${endDate || null}::text IS NULL OR articles.created_at <= (${endDate}::date + INTERVAL '1 day' - INTERVAL '1 second')) AND (${normalizedCategory}::text IS NULL OR (articles.category = ${normalizedCategory} OR articles.parent_category = ${normalizedCategory}))
            ORDER BY articles.created_at DESC LIMIT ${limit} OFFSET ${offset}
        `;
        return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
        console.error('Archive Fetch Error:', error);
        return [];
    }
}

export async function fetchArticleTags(articleId: string): Promise<string[]> {
    try {
      const data = await sql`SELECT tag FROM article_tags WHERE article_id = ${articleId}`;
      return data.rows.map(row => row.tag);
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

export async function fetchAllTags(): Promise<string[]> {
  try {
    const data = await sql`SELECT DISTINCT tag FROM article_tags ORDER BY tag ASC LIMIT 100`;
    return data.rows.map(row => row.tag);
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchAllLocations(): Promise<string[]> {
  try {
    const data = await sql`SELECT DISTINCT location FROM articles WHERE location IS NOT NULL ORDER BY location ASC LIMIT 50`;
    return data.rows.map(row => row.location);
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchArticleImages(articleId: string) {
  try {
    const data = await sql`SELECT * FROM article_images WHERE article_id = ${articleId} ORDER BY display_order ASC, created_at ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchArticleContributors(articleId: string) {
  try {
    const data = await sql`
      SELECT ac.id, ac.article_id, ac.contributor_id, ac.role, ac.custom_name, COALESCE(ac.custom_name, u.name) as display_name, ac.display_order
      FROM article_contributors ac
      LEFT JOIN users u ON ac.contributor_id = u.id
      WHERE ac.article_id = ${articleId}
      ORDER BY ac.display_order ASC, ac.created_at ASC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function getLastModifiedTimestamp() {
    try {
      const data = await sql`SELECT created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT 1`;
      return data.rows.length > 0 ? new Date(data.rows[0].created_at).getTime() : 0;
  } catch {
      return 0;
  }
}

export async function fetchArticlesByAuthor(authorId: string) {
  try {
      const data = await sql`
        SELECT articles.id, articles.title, articles.slug, articles.status, articles.category, articles.views, articles.image, articles.created_at, articles.content, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE articles.status = 'published' AND articles.author_id = ${authorId}
        ORDER BY articles.created_at DESC
      `;
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
  } catch (error) {
      console.error('Database Error:', error);
      return [];
  }
}
