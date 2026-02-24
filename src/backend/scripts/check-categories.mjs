import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.news.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    });

    const parentCategories = await prisma.news.groupBy({
        by: ['parent_category'],
        _count: {
            parent_category: true,
        },
    });

    console.log('--- Categories ---');
    console.log(JSON.stringify(categories, null, 2));
    console.log('--- Parent Categories ---');
    console.log(JSON.stringify(parentCategories, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
