import { Post, PostMeta } from './types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'lib/post');

function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const post: Post = {
      id: realSlug,
      slug: realSlug,
      title: data.title || 'Untitled',
      subtitle: data.subtitle,
      description: data.description,
      excerpt: data.excerpt || data.description || '',
      tags: data.tags || [],
      categories: data.categories || [],
      status: data.published ? 'published' : 'draft',
      createdAt: new Date(data.date).toISOString(),
      updatedAt: new Date(data.date).toISOString(),
      publishedAt: data.published ? new Date(data.date).toISOString() : undefined,
      content: content,
      image: data.image,
      author: data.author,
    };

    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug.replace(/\.md$/, '')))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return posts;
}

export function listPublished(): Post[] {
  return getAllPosts().filter(p => p.status === 'published');
}

export function getPostsByCategory(category: string): Post[] {
  return listPublished().filter(p =>
    p.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  getAllPosts().forEach(post => {
    post.categories.forEach(category => categories.add(category));
  });
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getBySlug(slug: string): Post | null {
  const post = getPostBySlug(slug);
  // Only return published posts for public access
  return post && post.status === 'published' ? post : null;
}
