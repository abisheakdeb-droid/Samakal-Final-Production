import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const photoArticles = await prisma.news.findMany({
        where: {
            OR: [
                { category: 'ছবি' },
                { category: 'photo' },
                { category: 'photogallery' },
                { parent_category: 'ছবি' },
                { parent_category: 'photo' },
                { parent_category: 'photogallery' }
            ]
        },
        select: {
            id: true,
            title: true,
            category: true,
            parent_category: true
        },
        take: 10
    });

    console.log('--- Photo Articles Found ---');
    console.log(JSON.stringify(photoArticles, null, 2));

    const countChobi = await prisma.news.count({ where: { category: 'ছবি' } });
    const countPhoto = await prisma.news.count({ where: { category: 'photo' } });
    const countGallery = await prisma.news.count({ where: { category: 'photogallery' } });

    console.log(`Counts: ছবি: ${countChobi}, photo: ${countPhoto}, photogallery: ${countGallery}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
