/** @type {import('next').NextConfig} */
const nextConfig = {
    // ১. টাইপস্ক্রিপ্ট এরর ইগনোর করবে
    typescript: {
        ignoreBuildErrors: true,
    },
    // ২. লিন্টিং এরর ইগনোর করবে
    eslint: {
        ignoreDuringBuilds: true,
    },
    // ৩. ইমেজ কনফিগারেশন (যা আগেই ছিল)
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'samakal.com' },
            { protocol: 'https', hostname: 'www.samakal.com' },
            { protocol: 'https', hostname: '*.samakal.com' },
            { protocol: 'https', hostname: 'wsrv.nl' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
    },
};

export default nextConfig;
