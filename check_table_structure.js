const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // 检查 daily_stats 表结构
    const dailyStatsSchema = await prisma.$queryRaw`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='daily_stats'
    `;
    
    console.log('Daily Stats Table Schema:');
    console.log(dailyStatsSchema[0].sql);
    console.log('');
    
    // 检查 post_stats 表结构
    const postStatsSchema = await prisma.$queryRaw`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='post_stats'
    `;
    
    console.log('Post Stats Table Schema:');
    console.log(postStatsSchema[0].sql);
    console.log('');
    
    // 检查 comments 表结构
    const commentsSchema = await prisma.$queryRaw`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='comments'
    `;
    
    console.log('Comments Table Schema:');
    console.log(commentsSchema[0].sql);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();