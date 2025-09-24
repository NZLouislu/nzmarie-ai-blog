const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Create a sample user for posts
  console.log('Creating user...');
  const user = await prisma.user.upsert({
    where: { email: 'marie@ssrealty.co.nz' },
    update: {},
    create: {
      email: 'marie@ssrealty.co.nz',
      name: 'NZMarie',
      role: 'admin',
      languagePreferences: 'both'
    }
  });
  console.log('Created/Found user:', user.email);
  
  // Create sample posts
  console.log('Creating posts...');
  const posts = [
    {
      id: 'sample-post-1-en',
      authorId: user.id,
      slug: '2024-01-10-will-ai-replace-human-developers',
      title: 'Will AI Replace Human Developers?',
      content: 'Sample content for the article...',
      language: 'en',
      status: 'published',
      tags: 'AI,Development,Future'
    },
    {
      id: 'sample-post-2-en',
      authorId: user.id,
      slug: '2024-01-20-new_zealand_paradise_for_children',
      title: 'New Zealand: Paradise for Children',
      content: 'Sample content for the article...',
      language: 'en',
      status: 'published',
      tags: 'New Zealand,Travel,Family'
    }
  ];
  
  for (const postData of posts) {
    try {
      console.log('Creating post:', postData.title);
      const post = await prisma.post.upsert({
        where: { id: postData.id },
        update: {},
        create: postData
      });
      console.log('Created/Found Post:', post.title);
    } catch (error) {
      console.error('Error creating post:', postData.title, error.message);
    }
  }
  
  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.postStat.deleteMany();
  await prisma.comment.deleteMany();
  console.log('Cleared existing data');
  
  // Get the actual post IDs
  console.log('Fetching posts...');
  const post1 = await prisma.post.findUnique({
    where: { id: 'sample-post-1-en' }
  });
  
  const post2 = await prisma.post.findUnique({
    where: { id: 'sample-post-2-en' }
  });
  
  console.log('Post1:', post1 ? 'Found' : 'Not found');
  console.log('Post2:', post2 ? 'Found' : 'Not found');
  
  if (post1 && post2) {
    // Create sample post stats
    console.log('Creating post stats...');
    const postStats = [
      {
        post_id: post1.id,
        title: 'Will AI Replace Human Developers?',
        language: 'en',
        views: 150,
        likes: 25,
        ai_questions: 5,
        ai_summaries: 3
      },
      {
        post_id: post2.id,
        title: 'New Zealand: Paradise for Children',
        language: 'en',
        views: 200,
        likes: 30,
        ai_questions: 7,
        ai_summaries: 4
      }
    ];
    
    for (const stat of postStats) {
      try {
        console.log('Creating post stat:', stat.title);
        const created = await prisma.postStat.upsert({
          where: { post_id: stat.post_id },
          update: {},
          create: stat
        });
        console.log('Created/Found PostStat:', created.title);
      } catch (error) {
        console.error('Error creating post stat:', stat.title, error.message);
      }
    }
    
    // Create sample comments
    console.log('Creating comments...');
    const comments = [
      {
        postId: post1.id,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Great article! Very insightful.',
        status: 'approved'
      },
      {
        postId: post1.id,
        authorName: 'Jane Smith',
        authorEmail: 'jane@example.com',
        content: 'Thanks for sharing this perspective!',
        status: 'approved'
      }
    ];
    
    for (const comment of comments) {
      try {
        console.log('Creating comment for post:', post1.title);
        const created = await prisma.comment.create({ data: comment });
        console.log('Created Comment:', created.id);
      } catch (error) {
        console.error('Error creating comment:', error.message);
      }
    }
  } else {
    console.log('Could not find posts, skipping stats and comments');
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