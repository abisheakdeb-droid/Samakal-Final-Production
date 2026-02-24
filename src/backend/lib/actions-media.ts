"use server";

import { sql } from "@/lib/db";
import { NewsItem } from "@/types/news";
import { mapArticleToNewsItem } from "@/lib/actions-article-helpers";
import { ArticleRow } from "@/types/database";

/**
 * Fetches articles that have a video_url.
 */
export async function fetchVideoArticles(limit: number = 20): Promise<NewsItem[]> {
  try {
    const result = await sql<ArticleRow>`
      SELECT 
        id, 
        title, 
        slug, 
        content, 
        image, 
        category, 
        created_at, 
        published_at,
        video_url, 
        video_thumbnail,
        author_id,
        news_type,
        status,
        sub_headline,
        location,
        is_featured,
        is_prime
      FROM articles
      WHERE video_url IS NOT NULL AND status = 'published'
      ORDER BY published_at DESC
      LIMIT ${limit}
    `;
    return result.rows.map(row => mapArticleToNewsItem(row));
  } catch (error) {
    console.error("Failed to fetch video articles:", error);
    return [];
  }
}

/**
 * Fetches photo albums (articles in 'photo' category) and their associated images.
 */
export interface PhotoAlbum {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  cover_image: string;
  category: string;
  published_at: Date;
  author_name: string;
  images: {
    image_url: string;
    caption?: string;
    photographer?: string;
  }[];
}

export async function fetchPhotoAlbums(limit: number = 12): Promise<PhotoAlbum[]> {
  try {
    const albumsResult = await sql<ArticleRow>`
      SELECT 
        a.id, 
        a.title, 
        a.slug, 
        a.content, 
        a.image, 
        a.category, 
        a.created_at,
        a.published_at,
        u.name as author,
        a.status,
        a.sub_headline,
        a.news_type,
        a.location,
        a.is_featured,
        a.is_prime
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.category = 'ছবি' AND a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT ${limit}
    `;

    const albums = (await Promise.all(
      albumsResult.rows.map(async (row) => {
        const item = mapArticleToNewsItem(row);
        const imagesResult = await sql`
          SELECT image_url, caption, photographer
          FROM article_images
          WHERE article_id = ${row.id}
          ORDER BY display_order ASC
        `;
        return {
          id: item.id,
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          cover_image: item.image,
          category: item.category,
          published_at: new Date(item.published_at),
          author_name: item.author,
          images: imagesResult.rows,
        };
      })
    )) as PhotoAlbum[];

    return albums;
  } catch (error) {
    console.error("Failed to fetch photo albums:", error);
    return [];
  }
}

/**
 * Fetches the media library for the CMS (Vercel Blob storage).
 */
import { list } from '@vercel/blob';

export async function getMediaLibrary() {
  try {
    const { blobs } = await list({ limit: 50 });
    return blobs.map(blob => ({
      id: blob.url,
      url: blob.url,
      name: blob.pathname,
      type: "IMAGE",
      size: (blob.size / 1024 / 1024).toFixed(2) + " MB"
    }));
  } catch (error) {
    console.error("Failed to fetch media library:", error);
    return [];
  }
}
