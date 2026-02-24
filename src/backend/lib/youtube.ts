"use server";

/**
 * Utilidad para obtener los últimos videos del canal de YouTube de Samakal.
 * Usa el feed RSS público de YouTube (sin API key necesaria).
 */

const SAMAKAL_CHANNEL_ID = "UCnetEdV8EwzGn36f3pq50ZA";
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${SAMAKAL_CHANNEL_ID}`;

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    link: string;
}

/**
 * Obtener los últimos videos del canal de Samakal vía RSS.
 * YouTube devuelve los 15 más recientes por defecto.
 */
export async function fetchYouTubeVideos(limit: number = 15): Promise<YouTubeVideo[]> {
    try {
        const response = await fetch(YOUTUBE_RSS_URL, {
            next: { revalidate: 300 }, // Cache por 5 minutos
        });

        if (!response.ok) {
            console.error("YouTube RSS fetch failed:", response.status);
            return [];
        }

        const xml = await response.text();
        return parseYouTubeFeed(xml).slice(0, limit);
    } catch (error) {
        console.error("Failed to fetch YouTube videos:", error);
        return [];
    }
}

/**
 * Parsear el feed XML de YouTube y extraer los datos de cada video.
 * Usa regex simple en lugar de un parser XML pesado.
 */
function parseYouTubeFeed(xml: string): YouTubeVideo[] {
    const videos: YouTubeVideo[] = [];

    // Encontrar todas las entradas <entry>...</entry>
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null) {
        const entry = match[1];

        // Extraer video ID
        const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        // Extraer título
        const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
        // Extraer fecha de publicación
        const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

        if (videoIdMatch && titleMatch) {
            const videoId = videoIdMatch[1];
            videos.push({
                id: videoId,
                title: titleMatch[1],
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                publishedAt: publishedMatch?.[1] || "",
                link: `https://www.youtube.com/watch?v=${videoId}`,
            });
        }
    }

    return videos;
}
