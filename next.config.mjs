/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'samakal.com',
            },
            {
                protocol: 'https',
                hostname: 'www.samakal.com',
            },
            {
                protocol: 'https',
                hostname: '*.samakal.com',
            },
            {
                protocol: 'https',
                hostname: 'wsrv.nl',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            },
        ],
    },

    // Security Headers
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://connect.facebook.net https://www.googletagmanager.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: https: http:",
                            "font-src 'self' https://fonts.gstatic.com",
                            "frame-src 'self' https://www.youtube.com https://www.facebook.com",
                            "connect-src 'self' https://www.youtube.com https://www.facebook.com https://wsrv.nl https://samakal.com https://*.samakal.com",
                            "media-src 'self' https:",
                        ].join("; "),
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                    {
                        key: "Cross-Origin-Resource-Policy",
                        value: "cross-origin",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
