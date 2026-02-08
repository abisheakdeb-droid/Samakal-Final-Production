"use server";

import { sql } from "@/lib/db";
import { revalidatePath, unstable_cache } from "next/cache";
import { cache } from "react";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ArticleRow, ArticleImageRow, ArticleContributorRow, ArticleSEOData } from "@/types/database";
import { getBengaliCategory } from "@/utils/category";
import { normalizeCategory } from "@/utils/normalize-category";
import { mapArticleToNewsItem } from "@/lib/actions-article-helpers";
const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  status: z.enum(["draft", "published", "archived", "scheduled"]),
  category: z.string().optional(),
  image: z.string().optional(),
  author_id: z.string().optional(),
  views: z.number().optional(),
  date: z.string().optional(), // For UI display purposes
  published_at: z.string().optional(),
  scheduled_at: z.string().optional(),
  // Phase 1: Core Metadata
  sub_headline: z.string().optional(),
  news_type: z.enum(["breaking", "regular", "feature", "opinion", "photo_story"]).optional(),
  location: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  event_id: z.string().optional(),
  // Phase 2: Media Enhancement
  video_url: z.string().optional(),
  video_thumbnail: z.string().optional(),
  // Phase 3: Attribution & SEO
  source: z.string().optional(),
  source_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  canonical_url: z.string().optional(),
});

const CreateArticle = ArticleSchema.omit({ id: true, date: true, views: true, author_id: true });

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
        // Check if the input is a valid UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let dataWithAuthor;

        if (isUUID) {
             dataWithAuthor = await sql`
              SELECT 
                articles.id,
                articles.title,
                articles.slug,
                articles.status,
                articles.category,
                articles.views,
                articles.image,
                articles.created_at,
                articles.content,
                articles.sub_headline,
                articles.news_type,
                articles.location,
                articles.video_url,
                articles.video_thumbnail,
                articles.source,
                articles.source_url,
                users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE articles.id = ${id}
            `;
        } else if (/^\d+$/.test(id)) {
             // Numeric ID check
             dataWithAuthor = await sql`
              SELECT 
                articles.id,
                articles.title,
                articles.slug,
                articles.status,
                articles.category,
                articles.views,
                articles.image,
                articles.created_at,
                articles.content,
                articles.sub_headline,
                articles.news_type,
                articles.location,
                articles.video_url,
                articles.video_thumbnail,
                articles.source,
                articles.source_url,
                users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE articles.public_id = ${parseInt(id)}
            `;
        } else {
             dataWithAuthor = await sql`
              SELECT 
                articles.id,
                articles.title,
                articles.slug,
                articles.status,
                articles.category,
                articles.views,
                articles.image,
                articles.created_at,
                articles.content,
                articles.sub_headline,
                articles.news_type,
                articles.location,
                articles.video_url,
                articles.video_thumbnail,
                articles.source,
                articles.source_url,
                users.name as author
              FROM articles
              LEFT JOIN users ON articles.author_id = users.id
              WHERE articles.slug = ${id}
            `;
        }
        
        if (dataWithAuthor.rows.length === 0) return null;

        const articleData = dataWithAuthor.rows[0];
        const articleId = articleData.id;

        // Paralell Fetch for Related Data
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
        // logError('fetchArticleById', error);
        throw new Error('Failed to fetch article.');
    }
}


// PUBLIC FETCH FUNCTIONS

export const fetchLatestArticles = cache(
  unstable_cache(
    async (limit: number = 10) => {
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
            articles.content,
            articles.sub_headline,
            articles.news_type,
            articles.location,
            articles.video_url,
            users.name as author
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
    async (
      category: string, 
      limit: number = 10,
      isParentCategory: boolean = false
    ) => {
      try {
        const normalizedCategory = normalizeCategory(category);
        
        let data;
        
        if (isParentCategory) {
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
              articles.status = 'published' AND
              articles.published_at <= NOW() AND
              (articles.parent_category = ${normalizedCategory} OR articles.category = ${normalizedCategory})
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
              articles.status = 'published' AND
              articles.published_at <= NOW() AND
              articles.category ILIKE ${normalizedCategory}
            ORDER BY articles.published_at DESC
            LIMIT ${limit}
          `;
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
            articles.id,
            articles.title,
            articles.slug,
            articles.status,
            articles.category,
            articles.views,
            articles.image,
            articles.created_at,
            articles.content,
            articles.sub_headline,
            articles.news_type,
            articles.location,
            articles.video_url,
            articles.is_featured,
            articles.is_prime,
            users.name as author
          FROM articles
          LEFT JOIN users ON articles.author_id = users.id
          WHERE 
              articles.status = 'published' AND
              articles.published_at <= NOW() AND
              articles.is_featured = true
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

export async function fetchArticlesWithPagination(
  offset: number = 0,
  limit: number = 20
) {
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
      LIMIT ${limit}
      OFFSET ${offset}
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
            articles.id,
            articles.title,
            articles.slug,
            articles.status,
            articles.category,
            articles.views,
            articles.image,
            articles.created_at,
            users.name as author
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
          articles.id,
          articles.title,
          articles.slug,
          articles.status,
          articles.category,
          articles.views,
          articles.image,
          articles.created_at,
          articles.content,
          articles.sub_headline,
          articles.news_type,
          articles.location,
          articles.video_url,
          users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
            articles.status = 'published' AND
            (
                articles.title ILIKE ${`%${query}%`} OR 
                articles.content ILIKE ${`%${query}%`} OR
                (articles.public_id::text = ${query})
            )
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
        SELECT 
          articles.id,
          articles.title,
          articles.slug,
          articles.category,
          articles.image,
          articles.created_at,
          users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
            articles.status = 'published' AND
            (articles.title ILIKE ${`%${query}%`} OR articles.slug ILIKE ${`%${query}%`})
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

// Advanced Search Action
export async function fetchArticlesBySearch({
    query,
    category,
    dateRange, // 'today', 'week', 'month', 'all'
    sort = 'newest', // 'relevance' | 'newest'
    limit = 20,
    offset = 0
}: {
    query: string;
    category?: string;
    dateRange?: string;
    sort?: string;
    limit?: number;
    offset?: number;
}) {
    try {
        const decodedQuery = decodeURIComponent(query);
        const searchPattern = `%${decodedQuery}%`;
        
        // Date Filter Logic
        let dateFilter = sql`AND 1=1`; // Default neutral
        
        if (dateRange === 'today') {
            dateFilter = sql`AND articles.created_at >= NOW() - INTERVAL '24 HOURS'`;
        } else if (dateRange === 'week') {
            dateFilter = sql`AND articles.created_at >= NOW() - INTERVAL '7 DAYS'`;
        } else if (dateRange === 'month') {
            dateFilter = sql`AND articles.created_at >= NOW() - INTERVAL '30 DAYS'`;
        }

        // Category Filter Logic
        let categoryFilter = sql`AND 1=1`;
        if (category && category !== 'all') {
             // Check if it's a parent category to include children
             // We can optimize this later, for now exact match or parent match
             categoryFilter = sql`AND (articles.category = ${category} OR articles.parent_category = ${category})`;
        }

    const orderBy = offset === 0 && sort === 'relevance' 
        ? sql`ORDER BY ts_rank(to_tsvector('english', articles.title || ' ' || articles.content), plainto_tsquery('english', ${decodedQuery})) DESC, articles.created_at DESC`
        : sql`ORDER BY articles.created_at DESC`;

    const data = await sql`
        SELECT 
            articles.id, articles.title, articles.slug, articles.category, articles.parent_category,
            articles.views, articles.image, articles.created_at, articles.content, 
            articles.sub_headline, users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
            articles.status = 'published'
            AND (
                articles.title ILIKE ${searchPattern} OR 
                articles.sub_headline ILIKE ${searchPattern} OR
                articles.content ILIKE ${searchPattern}
            )
            ${dateFilter}
            ${categoryFilter}
        ${orderBy}
        LIMIT ${limit}
        OFFSET ${offset}
    `;

        return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
        console.error('Search Error:', error);
        return [];
    }
}

export async function fetchArticlesByEvent(eventId: string, limit: number = 6) {
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
          users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
            articles.status = 'published' AND
            articles.event_id = ${eventId}
        ORDER BY articles.created_at DESC
        LIMIT ${limit}
      `;
  
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

export async function fetchArticlesByDate(date: string) {
    try {
      // date expected format: YYYY-MM-DD
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
          articles.content,
          articles.sub_headline,
          users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
            articles.status = 'published' AND
            articles.created_at::date = ${date}::date
        ORDER BY articles.created_at DESC
      `;
  
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}




// Added Missing Helper 
export async function fetchArticleTags(articleId: string): Promise<string[]> {
    try {
      const data = await sql`
        SELECT tag 
        FROM article_tags 
        WHERE article_id = ${articleId}
      `;
      return data.rows.map(row => row.tag);
    } catch (error) {
      console.error('Database Error:', error);
      return [];
    }
}

import { auth } from "@/auth";

export async function createArticle(formData: FormData) {
    // Check Authentication
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { message: 'Unauthorized: You must be logged in to create articles.' };
    }
    const authorId = session.user.id; // Real User ID

    // Parse tags and keywords from JSON strings
    const tagsRaw = formData.get('tags');
    const keywordsRaw = formData.get('keywords');
    
    const tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];
    const keywords = keywordsRaw ? JSON.parse(keywordsRaw as string) : [];

    // Validate form fields using Zod
    const validatedFields = CreateArticle.safeParse({
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        status: formData.get('status'),
        category: formData.get('category'),
        image: formData.get('image'), // Base64 or URL
        // Phase 1 metadata
        sub_headline: formData.get('sub_headline'),
        news_type: formData.get('news_type') || 'regular',
        location: formData.get('location'),
        keywords: keywords,
        tags: tags,
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Article.',
        };
    }

    const { 
        title, slug, content, status, category, image, 
        sub_headline, news_type, location, keywords: validatedKeywords, tags: validatedTags 
    } = validatedFields.data;

    try {
        // Insert article with Phase 1 metadata
        // Convert keywords array to PostgreSQL array format
        const keywordsArray = validatedKeywords && validatedKeywords.length > 0 
            ? `{${validatedKeywords.map(k => `"${k}"`).join(',')}}` 
            : null;

        // **FIX: Determine parent_category from category**
        const { getParentCategory } = await import('@/config/sub-categories');
        const parentCategory = getParentCategory(category || '') || 'null';

        const result = await sql`
        INSERT INTO articles (
            title, slug, content, status, category, parent_category, image, author_id,
            sub_headline, news_type, location, keywords, event_id
        )
        VALUES (
            ${title}, 
            ${slug}, 
            ${content || ''}, 
            ${status}, 
            ${category || 'Uncategorized'}, 
            ${parentCategory},
            ${image || ''}, 
            ${authorId},
            ${sub_headline || null},
            ${news_type || 'regular'},
            ${location || null},
            ${keywordsArray},
            ${validatedFields.data.event_id || null}
        )
        RETURNING id
        `;

        const articleId = result.rows[0].id;

        // Insert tags if provided
        if (validatedTags && validatedTags.length > 0) {
            for (const tag of validatedTags) {
                await sql`
                    INSERT INTO article_tags (article_id, tag)
                    VALUES (${articleId}, ${tag})
                `;
            }
        }

    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Create Article.',
        };
    }

    revalidatePath('/admin/dashboard/articles');
    redirect('/admin/dashboard/articles');
}

export async function updateArticle(formData: FormData) {
    // Check Authentication
    const session = await auth();
    if (!session || !session.user) {
        return { message: 'Unauthorized: You must be logged in to update articles.' };
    }

    const id = formData.get('id') as string;
    if (!id) return { message: 'Missing Article ID' };

    // Parse tags and keywords from JSON strings
    const tagsRaw = formData.get('tags');
    const keywordsRaw = formData.get('keywords');
    
    const tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];
    const keywords = keywordsRaw ? JSON.parse(keywordsRaw as string) : [];

    // Validate form fields using Zod (reuse CreateArticle schema for now)
    const validatedFields = CreateArticle.safeParse({
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        status: formData.get('status'),
        category: formData.get('category'),
        image: formData.get('image'), // Base64 or URL
        // Phase 1 metadata
        sub_headline: formData.get('sub_headline'),
        news_type: formData.get('news_type') || 'regular',
        location: formData.get('location'),
        keywords: keywords,
        tags: tags,
    });

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Article.',
        };
    }

    const { 
        title, slug, content, status, category, image, 
        sub_headline, news_type, location, keywords: validatedKeywords, tags: validatedTags 
    } = validatedFields.data;

    try {
        const keywordsArray = validatedKeywords && validatedKeywords.length > 0 
            ? `{${validatedKeywords.map(k => `"${k}"`).join(',')}}` 
            : null;

        // **FIX: Update parent_category based on category**
        const { getParentCategory } = await import('@/config/sub-categories');
        const parentCategory = getParentCategory(category || '') || null;

        await sql`
        UPDATE articles SET
            title = ${title},
            slug = ${slug},
            content = ${content || ''},
            status = ${status},
            category = ${category || 'Uncategorized'},
            parent_category = ${parentCategory},
            image = ${image || ''},
            sub_headline = ${sub_headline || null},
            news_type = ${news_type || 'regular'},
            location = ${location || null},
            keywords = ${keywordsArray},
            event_id = ${validatedFields.data.event_id || null},
            updated_at = NOW()
        WHERE id = ${id}
        `;

        // Update tags
        // First delete existing
        await sql`DELETE FROM article_tags WHERE article_id = ${id}`;
        
        // Insert new tags
        if (validatedTags && validatedTags.length > 0) {
            for (const tag of validatedTags) {
                await sql`
                    INSERT INTO article_tags (article_id, tag)
                    VALUES (${id}, ${tag})
                `;
            }
        }

    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Update Article.',
        };
    }

    revalidatePath('/admin/dashboard/articles');
    revalidatePath(`/admin/dashboard/articles/${id}`);
    redirect('/admin/dashboard/articles');
}

export async function deleteArticle(id: string) {
    const session = await auth();
    if (!session?.user) return { message: 'Unauthorized' };

    try {
        await sql`DELETE FROM articles WHERE id = ${id}`;
        revalidatePath('/admin/dashboard/articles');
    } catch {
        return { message: 'Database Error: Failed to Delete Article.' };
    }
}

// Phase 1: Helper functions for autocomplete

export async function fetchAllTags(): Promise<string[]> {
  try {
    const data = await sql`
      SELECT DISTINCT tag 
      FROM article_tags 
      ORDER BY tag ASC
      LIMIT 100
    `;
    return data.rows.map(row => row.tag);
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchAllLocations(): Promise<string[]> {
  try {
    const data = await sql`
      SELECT DISTINCT location 
      FROM articles 
      WHERE location IS NOT NULL
      ORDER BY location ASC
      LIMIT 50
    `;
    return data.rows.map(row => row.location);
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function updateArticleTags(articleId: string, tags: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  
  try {
    // Delete existing tags
    await sql`DELETE FROM article_tags WHERE article_id = ${articleId}`;
    
    // Insert new tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await sql`
          INSERT INTO article_tags (article_id, tag)
          VALUES (${articleId}, ${tag})
        `;
      }
    }
    
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update article tags.');
  }
}

// Phase 2: Media Management Functions

export async function addArticleImage(
  articleId: string,
  imageUrl: string,
  imageType: 'featured' | 'thumbnail' | 'gallery',
  caption?: string,
  photographer?: string,
  displayOrder: number = 0
) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    await sql`
      INSERT INTO article_images (article_id, image_url, image_type, caption, photographer, display_order)
      VALUES (${articleId}, ${imageUrl}, ${imageType}, ${caption || null}, ${photographer || null}, ${displayOrder})
    `;
    
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to add article image.');
  }
}

export async function fetchArticleImages(articleId: string) {
  try {
    const data = await sql`
      SELECT * FROM article_images
      WHERE article_id = ${articleId}
      ORDER BY display_order ASC, created_at ASC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function deleteArticleImage(imageId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    await sql`DELETE FROM article_images WHERE id = ${imageId}`;
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete article image.');
  }
}

export async function reorderGalleryImages(articleId: string, imageIds: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    for (let i = 0; i < imageIds.length; i++) {
      await sql`
        UPDATE article_images
        SET display_order = ${i}
        WHERE id = ${imageIds[i]} AND article_id = ${articleId}
      `;
    }
    
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to reorder gallery images.');
  }
}

export async function updateArticleVideo(articleId: string, videoUrl: string, videoThumbnail?: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    await sql`
      UPDATE articles
      SET video_url = ${videoUrl}, video_thumbnail = ${videoThumbnail || null}
      WHERE id = ${articleId}
    `;
    
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update article video.');
  }
}

// Phase 3: Attribution & SEO Functions

export async function addArticleContributor(
  articleId: string,
  contributorId?: string,
  customName?: string,
  role: string = 'reporter',
  displayOrder: number = 0
) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    await sql`
      INSERT INTO article_contributors (article_id, contributor_id, custom_name, role, display_order)
      VALUES (${articleId}, ${contributorId || null}, ${customName || null}, ${role}, ${displayOrder})
    `;
    
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to add article contributor.');
  }
}

export async function fetchArticleContributors(articleId: string) {
  try {
    const data = await sql`
      SELECT 
        ac.id,
        ac.article_id,
        ac.contributor_id,
        ac.role,
        ac.custom_name,
        COALESCE(ac.custom_name, u.name) as display_name,
        ac.display_order
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

export async function deleteArticleContributor(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    await sql`DELETE FROM article_contributors WHERE id = ${id}`;
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete contributor.');
  }
}

export async function updateArticleSEO(articleId: string, seoData: ArticleSEOData) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  try {
    await sql`
      UPDATE articles
      SET 
        source = ${seoData.source || null},
        source_url = ${seoData.source_url || null},
        seo_title = ${seoData.seo_title || null},
        seo_description = ${seoData.seo_description || null},
        canonical_url = ${seoData.canonical_url || null}
      WHERE id = ${articleId}
    `;
    
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update article SEO.');
  }
}


export async function incrementArticleView(articleId: string) {
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(articleId);

    if (isUUID) {
       await sql`
        UPDATE articles
        SET views = COALESCE(views, 0) + 1
        WHERE id = ${articleId}
       `;
    } else {
        // Handle slug if necessary, but ID is safer
        await sql`
        UPDATE articles
        SET views = COALESCE(views, 0) + 1
        WHERE slug = ${articleId}
       `;
    }
  } catch (error) {
    console.error('Database Error:', error);
    // Silent fail for view increments to not block UI
  }
}

export async function getLastModifiedTimestamp() {
    try {
      const data = await sql`
        SELECT created_at FROM articles 
        WHERE status = 'published' 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      return data.rows.length > 0 ? new Date(data.rows[0].created_at).getTime() : 0;
  } catch {
      // Return 0 on error effectively making the client think "no update" 
      return 0;
  }
}

export async function fetchArticlesByAuthor(authorId: string) {
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
          articles.content,
          users.name as author
        FROM articles
        LEFT JOIN users ON articles.author_id = users.id
        WHERE 
            articles.status = 'published' AND
            articles.author_id = ${authorId}
        ORDER BY articles.created_at DESC
      `;
  
      return data.rows.map(row => mapArticleToNewsItem(row as ArticleRow));
  } catch (error) {
      console.error('Database Error:', error);
      return [];
  }
}
