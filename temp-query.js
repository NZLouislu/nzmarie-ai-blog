const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const postStats = await prisma.postStat.findMany({take: 1, select: {post_id: true, language: true}});
    const comments = await prisma.comment.findMany({take: 1, select: {post_id: true, language: true}});
    console.log('Example postStat post_id:', postStats[0]?.post_id);
    console.log('Example comment post_id:', comments[0]?.post_id);
    console.log('PostStats:', JSON.stringify(postStats, null, 2));
    console.log('Comments:', JSON.stringify(comments, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
})();