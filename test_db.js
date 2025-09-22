const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // 测试查询 daily_stats 表
    const dailyStatsCount = await prisma.dailyStat.count();
    console.log('Daily stats count:', dailyStatsCount);
    
    // 测试查询 comments 表
    const commentsCount = await prisma.comment.count();
    console.log('Comments count:', commentsCount);
    
    // 测试查询 post_stats 表
    const postStatsCount = await prisma.postStat.count();
    console.log('Post stats count:', postStatsCount);
    
    console.log('Database structure is correct!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();