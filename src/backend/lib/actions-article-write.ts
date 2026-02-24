"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CreateArticle } from "@/lib/actions-article-helpers";
import type { ArticleSEOData } from "@/types/database";

export async function createArticle(formData: FormData) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { message: 'Unauthorized: You must be logged in to create articles.' };
    }
    const authorId = session.user.id;

    const tagsRaw = formData.get('tags');
    const keywordsRaw = formData.get('keywords');
    const tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];
    const keywords = keywordsRaw ? JSON.parse(keywordsRaw as string) : [];

    const validatedFields = CreateArticle.safeParse({
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        status: formData.get('status'),
        category: formData.get('category'),
        image: formData.get('image'),
        sub_headline: formData.get('sub_headline'),
        news_type: formData.get('news_type') || 'regular',
        location: formData.get('location'),
        keywords: keywords,
        tags: tags,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Article.',
        };
    }

    const { 
        title, slug, content, status, category, image, 
        sub_headline, news_type, location, keywords: validatedKeywords, tags: validatedTags,
        published_at, scheduled_at 
    } = validatedFields.data;

    try {
        const keywordsArray = validatedKeywords && validatedKeywords.length > 0 
            ? `{${validatedKeywords.map(k => `"${k}"`).join(',')}}` 
            : null;

        const { getParentCategory } = await import('@/config/sub-categories');
        const parentCategory = getParentCategory(category || '') || 'null';

        const result = await sql`
            INSERT INTO articles (
                title, slug, content, status, category, parent_category, image, author_id,
                sub_headline, news_type, location, keywords, event_id,
                published_at, scheduled_at
            )
            VALUES (
                ${title}, ${slug}, ${content || ''}, ${status}, ${category || 'Uncategorized'}, ${parentCategory},
                ${image || ''}, ${authorId}, ${sub_headline || null}, ${news_type || 'regular'},
                ${location || null}, ${keywordsArray}, ${validatedFields.data.event_id || null},
                ${published_at || (status === 'published' ? 'NOW()' : null)},
                ${scheduled_at || (status === 'scheduled' ? published_at : null)}
            )
            RETURNING id
        `;

        const articleId = result.rows[0].id;

        if (validatedTags && validatedTags.length > 0) {
            for (const tag of validatedTags) {
                await sql`INSERT INTO article_tags (article_id, tag) VALUES (${articleId}, ${tag})`;
            }
        }
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Create Article.' };
    }

    revalidatePath('/admin/dashboard/articles');
    redirect('/admin/dashboard/articles');
}

export async function updateArticle(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        return { message: 'Unauthorized: You must be logged in to update articles.' };
    }

    const id = formData.get('id') as string;
    if (!id) return { message: 'Missing Article ID' };

    const tagsRaw = formData.get('tags');
    const keywordsRaw = formData.get('keywords');
    const tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];
    const keywords = keywordsRaw ? JSON.parse(keywordsRaw as string) : [];

    const validatedFields = CreateArticle.safeParse({
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        status: formData.get('status'),
        category: formData.get('category'),
        image: formData.get('image'),
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
        sub_headline, news_type, location, keywords: validatedKeywords, tags: validatedTags,
        published_at, scheduled_at
    } = validatedFields.data;

    try {
        const keywordsArray = validatedKeywords && validatedKeywords.length > 0 
            ? `{${validatedKeywords.map(k => `"${k}"`).join(',')}}` 
            : null;

        const { getParentCategory } = await import('@/config/sub-categories');
        const parentCategory = getParentCategory(category || '') || null;

        await sql`
            UPDATE articles SET
                title = ${title}, slug = ${slug}, content = ${content || ''}, status = ${status},
                category = ${category || 'Uncategorized'}, parent_category = ${parentCategory},
                image = ${image || ''}, sub_headline = ${sub_headline || null},
                news_type = ${news_type || 'regular'}, location = ${location || null},
                keywords = ${keywordsArray}, event_id = ${validatedFields.data.event_id || null},
                published_at = ${published_at || null}, scheduled_at = ${scheduled_at || null},
                updated_at = NOW()
            WHERE id = ${id}
        `;

        await sql`DELETE FROM article_tags WHERE article_id = ${id}`;
        if (validatedTags && validatedTags.length > 0) {
            for (const tag of validatedTags) {
                await sql`INSERT INTO article_tags (article_id, tag) VALUES (${id}, ${tag})`;
            }
        }
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Update Article.' };
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

export async function updateArticleTags(articleId: string, tags: string[]) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  try {
    await sql`DELETE FROM article_tags WHERE article_id = ${articleId}`;
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await sql`INSERT INTO article_tags (article_id, tag) VALUES (${articleId}, ${tag})`;
      }
    }
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update article tags.');
  }
}

export async function addArticleImage(
  articleId: string, imageUrl: string, imageType: 'featured' | 'thumbnail' | 'gallery',
  caption?: string, photographer?: string, displayOrder: number = 0
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
      await sql`UPDATE article_images SET display_order = ${i} WHERE id = ${imageIds[i]} AND article_id = ${articleId}`;
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
    await sql`UPDATE articles SET video_url = ${videoUrl}, video_thumbnail = ${videoThumbnail || null} WHERE id = ${articleId}`;
    revalidatePath('/admin/dashboard/articles');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update article video.');
  }
}

export async function addArticleContributor(
  articleId: string, contributorId?: string, customName?: string, role: string = 'reporter', displayOrder: number = 0
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
      UPDATE articles SET 
        source = ${seoData.source || null}, source_url = ${seoData.source_url || null},
        seo_title = ${seoData.seo_title || null}, seo_description = ${seoData.seo_description || null},
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
       await sql`UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE id = ${articleId}`;
    } else {
        await sql`UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE slug = ${articleId}`;
    }
  } catch (error) {
    console.error('Database Error:', error);
  }
}
