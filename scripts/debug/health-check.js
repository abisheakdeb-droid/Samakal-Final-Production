// System Health Check - Using Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImports() {
  try {
    console.log('\n=== 📊 SAMAKAL IMPORT PROGRESS ===\n');

    // Total Articles
    const totalCount = await prisma.article.count();
    console.log(`✅ Total Articles in Database: ${totalCount.toLocaleString()}`);

    // Articles by Category
    console.log('\n📁 Articles by Category:');
    const categoryGroups = await prisma.article.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20
    });
    
    categoryGroups.forEach((group, index) => {
      const bar = '█'.repeat(Math.floor(group._count.id / 10));
      console.log(`  ${index + 1}. ${group.category.padEnd(20)} ${group._count.id.toString().padStart(5)} ${bar}`);
    });

    // Data Quality
    console.log('\n🔍 Data Quality Check:');
    const [noImage, noSummary, noContent, noParent] = await Promise.all([
      prisma.article.count({ where: { OR: [{ image: null }, { image: '' }] } }),
      prisma.article.count({ where: { OR: [{ summary: null }, { summary: '' }] } }),
      prisma.article.count({ where: { OR: [{ content: null }, { content: '' }] } }),
      prisma.article.count({ where: { OR: [{ parentCategory: null }, { parentCategory: '' }] } })
    ]);

    console.log(`  Missing Images: ${noImage} (${((noImage/totalCount)*100).toFixed(1)}%)`);
    console.log(`  Missing Summary: ${noSummary} (${((noSummary/totalCount)*100).toFixed(1)}%)`);
    console.log(`  Missing Content: ${noContent} (${((noContent/totalCount)*100).toFixed(1)}%)`);
    console.log(`  Missing Parent Category: ${noParent} (${((noParent/totalCount)*100).toFixed(1)}%)`);

    // Recent Imports (last 6 hours)
    console.log('\n⏰ Recent Activity (Last 6 Hours):');
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const recentArticles = await prisma.article.count({
      where: { createdAt: { gte: sixHoursAgo } }
    });
    console.log(`  New articles: ${recentArticles}`);

    if (recentArticles > 0) {
      const recentByCategory = await prisma.article.groupBy({
        by: ['category'],
        where: { createdAt: { gte: sixHoursAgo } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      });
      
      console.log(`  By category:`);
      recentByCategory.forEach(group => {
        console.log(`    - ${group.category}: +${group._count.id}`);
      });
    }

    // Parent Category Distribution
    console.log('\n🗂️  Parent Category Distribution:');
    const parentGroups = await prisma.article.groupBy({
      by: ['parentCategory'],
      _count: { id: true },
      where: { parentCategory: { not: null } },
      orderBy: { _count: { id: 'desc' } }
    });
    
    parentGroups.forEach(group => {
      console.log(`  ${group.parentCategory}: ${group._count.id}`);
    });

    // Categories Distribution
    const uniqueCategories = await prisma.article.findMany({
      distinct: ['category'],
      select: { category: true }
    });
    console.log(`\n📊 Total Unique Categories: ${uniqueCategories.length}`);

    console.log('\n✅ Health Check Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkImports();
