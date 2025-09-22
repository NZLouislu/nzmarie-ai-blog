const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 获取 daily_stats 表的结构信息
  const dailyStatsFields = await prisma.$queryRaw`
    SELECT sql FROM sqlite_master 
    WHERE type='table' AND name='daily_stats'
  `;
  
  console.log('Daily Stats Table Schema:');
  console.log(dailyStatsFields[0].sql);
  
  // 获取 comments 表的结构信息
  const commentsFields = await prisma.$queryRaw`
    SELECT sql FROM sqlite_master 
    WHERE type='table' AND name='comments'
  `;
  
  console.log('\nComments Table Schema:');
  console.log(commentsFields[0].sql);
  
  // 获取 post_stats 表的结构信息
  const postStatsFields = await prisma.$queryRaw`
    SELECT sql FROM sqlite_master 
    WHERE type='table' AND name='post_stats'
  `;
  
  console.log('\nPost Stats Table Schema:');
  console.log(postStatsFields[0].sql);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });