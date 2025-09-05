import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Create sample comments
  const { error: commentError } = await supabase
    .from('comments')
    .insert([
      {
        post_id: '2024-03-10-java-and-spring-in-depth-understanding',
        name: 'John Doe',
        email: 'john@example.com',
        comment: 'Great article! Very comprehensive explanation of Java and Spring.',
        is_anonymous: false
      },
      {
        post_id: '2024-03-10-java-and-spring-in-depth-understanding',
        name: 'Jane Smith',
        email: 'jane@example.com',
        comment: 'Thanks for sharing this detailed guide. Helped me a lot!',
        is_anonymous: false
      },
      {
        post_id: '2024-03-02-the-trio-of-frontend-development',
        comment: 'Excellent overview of frontend technologies!',
        is_anonymous: true
      },
      {
        post_id: '2024-02-24-backend-tech-the-foundation-of-software',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        comment: 'Backend development is indeed the foundation. Well explained!',
        is_anonymous: false
      }
    ]);

  if (commentError) {
    console.error('Error inserting comments:', commentError);
    return;
  }

  // Create sample post stats
  const postStats = [
    {
      post_id: '2024-03-10-java-and-spring-in-depth-understanding',
      title: 'Java and Spring In-Depth Understanding',
      views: 1,
      likes: 1,
      ai_questions: 1
    },
    {
      post_id: '2024-03-02-the-trio-of-frontend-development',
      title: 'The Trio of Frontend Development',
      views: 1,
      likes: 1,
      ai_questions: 1
    },
    {
      post_id: '2024-02-24-backend-tech-the-foundation-of-software',
      title: 'Backend Tech: The Foundation of Software',
      views: 1,
      likes: 1,
      ai_questions: 1
    },
    {
      post_id: '2024-02-17-react-18-typescript-powerful-combination-frontend',
      title: 'React 18 & TypeScript: Powerful Combination for Frontend',
      views: 1,
      likes: 1,
      ai_questions: 1
    }
  ];

  for (const stat of postStats) {
    const { error: statError } = await supabase
      .from('post_stats')
      .upsert(stat, { onConflict: 'post_id' });

    if (statError) {
      console.error('Error inserting post stat:', statError);
      return;
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });