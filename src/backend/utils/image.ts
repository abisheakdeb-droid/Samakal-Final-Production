/**
 * Generate a tiny blur placeholder for images
 * This creates a base64-encoded SVG blur placeholder
 */
export function generateBlurPlaceholder(width: number = 10, height: number = 6): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1"/>
      </filter>
      <rect width="${width}" height="${height}" fill="#f3f4f6" filter="url(#b)"/>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a shimmer blur placeholder for loading states
 */
export function generateShimmerPlaceholder(width: number = 700, height: number = 475): string {
  const shimmer = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer">
          <stop offset="0%" stop-color="#f3f4f6"/>
          <stop offset="50%" stop-color="#e5e7eb"/>
          <stop offset="100%" stop-color="#f3f4f6"/>
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="-1 0"
            to="1 0"
            dur="1.5s"
            repeatCount="indefinite"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#shimmer)"/>
    </svg>
  `;

  const base64 = Buffer.from(shimmer).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Optimized image loader for Unsplash
 * Adds format negotiation and quality params
 */
export function unsplashLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If already a full Unsplash URL, modify params
  if (src.startsWith('https://images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    url.searchParams.set('fm', 'webp'); // Request WebP format
    url.searchParams.set('auto', 'format'); // Let Unsplash choose best format
    return url.toString();
  }

  return src;
}

/**
 * Global Image Proxy Utility (wsrv.nl)
 * Handles HTTPS/HTTP mismatches, blocking, and performance optimization.
 */
export function getProxiedImageUrl(src: string, width?: number, quality: number = 80): string {
  if (!src) return '';

  // Don't proxy base64 or local images
  if (src.startsWith('data:') || src.startsWith('/') || src.startsWith('blob:')) {
    return src;
  }

  // If already proxied, return as is
  if (src.includes('wsrv.nl')) {
    return src;
  }

  // Don't proxy samakal.com images to avoid 403 Forbidden from wsrv.nl
  if (src.includes('samakal.com')) {
    return src;
  }

  const encodedUrl = encodeURIComponent(src);
  let proxyUrl = `https://wsrv.nl/?url=${encodedUrl}&q=${quality}&output=webp`;

  if (width) {
    proxyUrl += `&w=${width}`;
  }

  return proxyUrl;
}
