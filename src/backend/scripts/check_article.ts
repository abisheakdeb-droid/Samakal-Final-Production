
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const article = await prisma.news.findFirst({
        select: {
            id: true,
            title: true,
            category: true,
            parent_category: true,
        }
    });

    console.log('Sample Article:', article);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
