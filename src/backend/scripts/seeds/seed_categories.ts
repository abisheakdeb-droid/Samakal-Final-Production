
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    "বাংলাদেশ",
    "সারাদেশ",
    "রাজধানী",
    "রাজনীতি",
    "বিশ্ব",
    "অর্থনীতি",
    "খেলা",
    "অপরাধ",
    "লাইফস্টাইল",
    "প্রযুক্তি",
    "বিনোদন",
    "চাকরি",
    "মতামত",
];

async function main() {
    console.log("Starting to seed categories...");

    const articles = await prisma.news.findMany({
        select: { id: true }
    });

    console.log(`Found ${articles.length} articles without categories.`);

    const batchSize = 50;
    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        await Promise.all(batch.map((article: { id: string }) => {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            return prisma.news.update({
                where: { id: article.id },
                data: {
                    category: randomCategory,
                    status: 'published'
                },
            });
        }));
        console.log(`Processed ${Math.min(i + batchSize, articles.length)}/${articles.length} articles.`);
    }

    console.log("Finished seeding categories.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
