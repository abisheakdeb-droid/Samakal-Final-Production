/**
 * Strategic Ad Placement Guide for Samakal
 * 
 * This document outlines optimal ad positions based on:
 * - User experience research
 * - Industry best practices (Google, IAB standards)
 * - Samakal's content strategy
 */

export const AD_PLACEMENTS = {
  homepage: {
    // Above-the-fold
    leaderboard_top: {
      position: 'Below header, above hero section',
      format: 'Leaderboard (728x90 or 970x90)',
      visibility: 'High',
      ctr_expected: '1.5-2%',
    },
    
    // In-feed ads (every 4-6 articles)
    native_feed_1: {
      position: 'After 4th article in grid',
      format: 'Native ad (blends with articles)',
      visibility: 'Medium-High',
      ctr_expected: '0.8-1.2%',
    },
    
    native_feed_2: {
      position: 'After 10th article',
      format: 'Native ad',
      visibility: 'Medium',
      ctr_expected: '0.6-0.9%',
    },
    
    // Sidebar (sticky)
    sidebar_rectangle: {
      position: 'Top of sidebar (sticky)',
      format: 'Rectangle (300x250)',
      visibility: 'High (sticky behavior)',
      ctr_expected: '1.2-1.8%',
    },
    
    sidebar_native: {
      position: 'Middle of sidebar',
      format: 'Native ad compact',
      visibility: 'Medium',
      ctr_expected: '0.5-0.8%',
    },
  },

  article: {
    // Article page specific
    rectangle_top: {
      position: 'Below breadcrumb, before title',
      format: 'Rectangle (300x250)',
      visibility: 'High',
      ctr_expected: '1.5-2.2%',
    },
    
    in_article_native: {
      position: 'After 2nd paragraph',
      format: 'Native ad (text + small image)',
      visibility: 'Very High (in-content)',
      ctr_expected: '2-3%',
    },
    
    rectangle_mid: {
      position: 'Middle of article (after 50% content)',
      format: 'Rectangle (300x250)',
      visibility: 'Medium',
      ctr_expected: '0.8-1.2%',
    },
    
    related_content_native: {
      position: 'In "Related Articles" section',
      format: 'Native ad (looks like article card)',
      visibility: 'Medium-High',
      ctr_expected: '1-1.5%',
    },
  },

  category: {
    leaderboard_top: {
      position: 'Below category header',
      format: 'Leaderboard',
      visibility: 'High',
      ctr_expected: '1.2-1.8%',
    },
    
    grid_native: {
      position: 'Every 6 articles in grid',
      format: 'Native card ad',
      visibility: 'Medium',
      ctr_expected: '0.7-1%',
    },
  },
};

/**
 * Ad density guidelines
 * Following IAB better ads standards
 */
export const AD_DENSITY_RULES = {
  max_ads_per_page: 8, // Don't overwhelm users
  min_content_between_ads: '2 article cards or 300px',
  max_sticky_ads: 1, // Only one sticky ad at a time
  mobile_ad_spacing: 'Minimum 600px between ads',
};

/**
 * Ad formats priority
 * Based on revenue and user acceptance
 */
export const AD_FORMAT_PRIORITY = {
  highest: ['Native in-feed', 'In-article native'],
  high: ['Rectangle (300x250)', 'Sticky sidebar'],
  medium: ['Leaderboard (728x90)', 'Mobile banner'],
  avoid: ['Pop-ups', 'Interstitials', 'Auto-play video ads'],
};
