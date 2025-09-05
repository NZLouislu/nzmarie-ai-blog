import { getAllCategories } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}