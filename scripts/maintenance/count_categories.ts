
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.news.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
        orderBy: {
            _count: {
                category: 'desc',
            },
        },
    });

    console.log('Category Counts:', categories);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
