import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Category Mapping (Strictly using Bengali names used by the frontend)
const categories = [
    'রাজনীতি',
    'বাংলাদেশ',
    'সারাদেশ',
    'রাজধানী',
    'বিশ্ব',
    'অর্থনীতি',
    'খেলা',
    'বিনোদন',
    'প্রযুক্তি',
    'শিক্ষা',
    'লাইফস্টাইল',
    'চাকরি',
    'মতামত',
];

const banglaTitles = [
    "জাতীয় নির্বাচনের রোডম্যাপ ঘোষণা করলেন প্রধান উপদেষ্টা",
    "দ্রব্যমূল্যের ঊর্ধ্বগতি: সাধারণ মানুষের নাভিশ্বাস",
    "বিশ্বকাপ ক্রিকেটে বাংলাদেশের ঐতিহাসিক জয়",
    "ঢাকায় মেট্রোরেলের নতুন সময়সূচি ঘোষণা",
    "প্রযুক্তি খাতে নতুন বিপ্লব: আসছে দেশি স্টার্টআপ",
    "হলিউড ও বলিউডের যৌথ প্রযোজনায় নতুন সিনেমা",
    "জলবায়ু পরিবর্তন: উপকূলীয় এলাকায় সতর্কতা জারি",
    "শেয়ারবাজারে বড় পতন, বিনিয়োগকারীদের হতাশা",
    "শিক্ষা ব্যবস্থা সংস্কারে নতুন কমিশন গঠন",
    "পদ্মা সেতু দিয়ে দিনে পার হলো ৩০ হাজার গাড়ি"
];

const sampleImages = [
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
    "https://images.unsplash.com/photo-1529101091760-61df6be24296?w=800&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
];

async function main() {
    console.log('🌱 Starting Database Seeding...');

    // A. Clean Database
    console.log('Cleaning existing data...');
    await prisma.comment.deleteMany();
    await prisma.readingHistory.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.reaction.deleteMany();
    await prisma.news.deleteMany(); // model News maps to articles table

    // B. Ensure a Reporter/User exists
    let reporter = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!reporter) {
        reporter = await prisma.user.create({
            data: {
                name: "সমকাল রিপোর্টার",
                email: "reporter@samakal.com",
                role: "admin",
                image: "https://randomuser.me/api/portraits/men/1.jpg"
            }
        });
    }

    // C. Generate Articles (100+)
    console.log('Generating 110 Articles...');

    for (let i = 0; i < 110; i++) {
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        const randomTitle = banglaTitles[Math.floor(Math.random() * banglaTitles.length)];

        // Logic for Homepage Distribution
        // First 5 articles -> Featured (Hero Section)
        const isFeatured = i < 5;

        // Articles 10-20 -> High Views (For "Most Popular" Sidebar)
        const views = (i >= 10 && i <= 20) ? Math.floor(Math.random() * 50000) + 1000 : Math.floor(Math.random() * 500);

        // Date Logic: Spread dates
        const date = new Date();
        date.setHours(date.getHours() - i);

        await prisma.news.create({
            data: {
                title: `${randomTitle} - ${110 - i}`,
                slug: `news-article-${i}-${Date.now()}`,
                content: `
          <p>এটি একটি ডামি নিউজ কন্টেন্ট। সমকাল রিডিজাইন প্রজেক্টের জন্য এটি তৈরি করা হয়েছে। <strong>বিস্তারিত আসছে...</strong></p>
          <p>দেশজুড়ে চলমান নানা পরিস্থিতির মধ্যে এটি একটি প্রতীকী সংবাদ। সমকালের নির্ভীক সাংবাদিকতার স্বাক্ষর হিসেবে এই ডামি কন্টেন্টগুলো কাজ করবে।</p>
          <p>আরও তথ্য শীঘ্রই জানানো হবে। আমাদের সাথেই থাকুন।</p>
        `,
                sub_headline: "এটি সংবাদের সারসংক্ষেপ যা সাব-হেড হিসেবে ব্যবহৃত হবে। এটি লেআউট চেক করার জন্য অত্যন্ত গুরুত্বপূর্ণ।",
                image: randomImg,
                is_featured: isFeatured,
                is_prime: i % 10 === 0, // Every 10th article is "prime"
                views: views,
                status: 'published',
                category: randomCat,
                authorId: reporter.id,
                publishedAt: date,
                updatedAt: date,
            }
        });
    }

    console.log('✅ Database populated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
