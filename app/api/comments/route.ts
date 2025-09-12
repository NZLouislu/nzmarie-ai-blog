import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const language = searchParams.get('language');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('language', language || 'en')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting comment submission...');
    const { postId, language, name, email, comment, isAnonymous } = await request.json();

    if (!postId || !comment) {
      return NextResponse.json({ error: 'Post ID and comment are required' }, { status: 400 });
    }

    console.log('Attempting to save to Supabase...');
    const startTime = Date.now();

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        language: language || 'en',
        name: isAnonymous ? null : name,
        email: isAnonymous ? null : email,
        comment,
        is_anonymous: isAnonymous
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
    }

    const endTime = Date.now();
    console.log(`Database operation completed in ${endTime - startTime}ms`);

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Comments API error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}