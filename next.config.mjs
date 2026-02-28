/** @type {import('next').NextConfig} */
const nextConfig = {
    // ১. টাইপস্ক্রিপ্ট এরর ইগনোর করবে
    typescript: {
        ignoreBuildErrors: true,
    },
    // ৩. ইমেজ কনফিগারেশন (যা আগেই ছিল)
    images: {
        unoptimized: true,
        remotePatterns: [
            { protocol: 'https', hostname: 'samakal.com' },
            { protocol: 'https', hostname: 'www.samakal.com' },
            { protocol: 'https', hostname: '*.samakal.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'unsplash.com' },
            { protocol: 'https', hostname: 'img.youtube.com' },
            { protocol: 'https', hostname: 'wsrv.nl' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'randomuser.me' },],
    },
    // ৪. টার্বোপ্যাক এরর ফিক্স (নেটিভ মডিউল এর জন্য)
    serverExternalPackages: ['pg'],
};

export default nextConfig;
