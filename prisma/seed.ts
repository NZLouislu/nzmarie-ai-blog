import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Clear existing data
  await prisma.postStat.deleteMany();
  await prisma.comment.deleteMany();
  console.log('Cleared existing data');
  
  // Create sample post stats
  const postStats = [
    {
      post_id: '2024-01-10-will-ai-replace-human-developers',
      title: 'Will AI Replace Human Developers?',
      language: 'en',
      views: 150,
      likes: 25,
      ai_questions: 5,
      ai_summaries: 3
    },
    {
      post_id: '2024-01-20-new_zealand_paradise_for_children',
      title: 'New Zealand: Paradise for Children',
      language: 'en',
      views: 200,
      likes: 30,
      ai_questions: 7,
      ai_summaries: 4
    }
  ];
  
  for (const stat of postStats) {
    const created = await prisma.postStat.create({ data: stat });
    console.log('Created PostStat:', created);
  }
  
  // Create sample comments
  const comments = [
    {
      postId: '2024-01-10-will-ai-replace-human-developers',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'Great article! Very insightful.',
      status: 'approved' as const
    },
    {
      postId: '2024-01-10-will-ai-replace-human-developers',
      authorName: 'Jane Smith',
      authorEmail: 'jane@example.com',
      content: 'Thanks for sharing this perspective!',
      status: 'approved' as const
    }
  ];
  
  for (const comment of comments) {
    const created = await prisma.comment.create({ data: comment });
    console.log('Created Comment:', created);
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });