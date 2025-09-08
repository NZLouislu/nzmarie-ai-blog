import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostsByTag, getPostsByCategory, getAllCategories, getAllTags, listPublished, getBySlug } from '@/lib/posts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const language = searchParams.get('language') as 'en' | 'zh' || 'en';

  try {
    switch (action) {
      case 'allPosts':
        const allPosts = getAllPosts(language);
        return NextResponse.json(allPosts);

      case 'published':
        const publishedPosts = listPublished(language);
        return NextResponse.json(publishedPosts);

      case 'byTag':
        const tag = searchParams.get('tag');
        if (!tag) {
          return NextResponse.json({ error: 'Tag parameter is required' }, { status: 400 });
        }
        const postsByTag = getPostsByTag(tag, language);
        return NextResponse.json(postsByTag);

      case 'byCategory':
        const category = searchParams.get('category');
        if (!category) {
          return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
        }
        const postsByCategory = getPostsByCategory(category, language);
        return NextResponse.json(postsByCategory);

      case 'categories':
        const categories = getAllCategories(language);
        return NextResponse.json(categories);

      case 'tags':
        const tags = getAllTags(language);
        return NextResponse.json(tags);

      case 'bySlug':
        const slug = searchParams.get('slug');
        if (!slug) {
          return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
        }
        const post = getBySlug(slug, language);
        return NextResponse.json(post);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}