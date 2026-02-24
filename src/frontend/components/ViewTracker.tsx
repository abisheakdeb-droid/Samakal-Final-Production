'use client';

import { useEffect } from 'react';
import { incrementArticleView } from '@/lib/actions-article';

interface ViewTrackerProps {
  articleId: string;
}

export default function ViewTracker({ articleId }: ViewTrackerProps) {
  useEffect(() => {
    // Increment views when component mounts (page loads)
    incrementArticleView(articleId);
  }, [articleId]);

  return null; // This component doesn't render anything
}
