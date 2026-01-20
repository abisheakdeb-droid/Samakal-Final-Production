'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useRouteChange(callback: () => void) {
  const pathname = usePathname();
  // Note: Removed useSearchParams to avoid SSR issues
  // If you need searchParams, wrap the component using this hook in <Suspense>
  
  useEffect(() => {
    callback();
  }, [pathname, callback]);
}
