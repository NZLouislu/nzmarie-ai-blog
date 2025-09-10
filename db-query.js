require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function queryDatabase() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
  
  try {
    console.log('Querying PostStats...');
    const postStats = await prisma.postStat.findMany();
    console.log('PostStats:', postStats);
    
    console.log('\nQuerying Comments...');
    const comments = await prisma.comment.findMany();
    console.log('Comments:', comments);
  } catch (error) {
    console.error('Database query error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

queryDatabase();