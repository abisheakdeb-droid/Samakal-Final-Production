"use server";

import { sql } from "@/lib/db";
import { revalidatePath, unstable_cache } from "next/cache";
import { cache } from "react";
import { auth } from "@/auth";

export interface SiteSettings {
  id: number;
  facebook_live_url?: string;
  facebook_is_live: boolean;
  youtube_playlist_id?: string;
  youtube_api_key?: string;
  breaking_news_ticker?: string;
  breaking_news_is_active: boolean;
  
  // Molecular Control: Site Identity
  site_name: string;
  site_tagline?: string;
  site_logo?: string;
  site_favicon?: string;
  
  // Molecular Control: SEO & Analytics
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  google_analytics_id?: string;
  footer_copyright?: string;
  
  // Molecular Control: Navigation
  navigation_menu?: unknown[]; // JSON array of links
  
  updated_at: Date;
}

export const fetchSettings = cache(
  unstable_cache(
    async (): Promise<SiteSettings> => {
      try {
        const data = await sql`
          SELECT * FROM site_settings WHERE id = 1
        `;
        
        if (data.rows.length === 0) {
          return {
            id: 1,
            facebook_is_live: false,
            breaking_news_ticker: 'সমকাল - অসংকোচ প্রকাশের দুরন্ত সাহস',
            breaking_news_is_active: true,
            site_name: 'সমকাল',
            site_tagline: 'অসংকোচ প্রকাশের দুরন্ত সাহস',
            site_logo: '/samakal-logo.png',
            site_favicon: '/favicon.ico',
            updated_at: new Date()
          };
        }

        return data.rows[0] as SiteSettings;
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        return {
            id: 1,
            facebook_is_live: false,
            breaking_news_ticker: 'Default Ticker',
            breaking_news_is_active: true,
            site_name: 'সমকাল',
            updated_at: new Date()
        };
      }
    },
    ['site-settings'],
    { revalidate: 3600, tags: ['settings'] }
  )
);

export async function updateSettings(settings: Partial<SiteSettings>) {
  const session = await auth();
  if (!session || !session.user) {
      throw new Error("Unauthorized");
  }

  try {
    await sql`
      UPDATE site_settings
      SET 
        facebook_live_url = ${settings.facebook_live_url || null},
        facebook_is_live = ${settings.facebook_is_live},
        youtube_playlist_id = ${settings.youtube_playlist_id || null},
        youtube_api_key = ${settings.youtube_api_key || null},
        breaking_news_ticker = ${settings.breaking_news_ticker || null},
        breaking_news_is_active = ${settings.breaking_news_is_active},
        site_name = ${settings.site_name || 'সমকাল'},
        site_tagline = ${settings.site_tagline || null},
        site_logo = ${settings.site_logo || '/samakal-logo.png'},
        site_favicon = ${settings.site_favicon || '/favicon.ico'},
        seo_title = ${settings.seo_title || null},
        seo_description = ${settings.seo_description || null},
        seo_keywords = ${settings.seo_keywords || null},
        google_analytics_id = ${settings.google_analytics_id || null},
        footer_copyright = ${settings.footer_copyright || null},
        navigation_menu = ${settings.navigation_menu ? JSON.stringify(settings.navigation_menu) : null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    revalidatePath('/'); // Revalidate homepage so widgets update
    revalidatePath('/admin/dashboard/settings');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
