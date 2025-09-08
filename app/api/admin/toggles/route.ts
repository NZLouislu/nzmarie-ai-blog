import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('feature_toggles')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching toggles:', error);
      return NextResponse.json({ error: 'Failed to fetch toggles' }, { status: 500 });
    }

    // Default toggles if none exist
    const defaultToggles = {
      total_views: true,
      total_likes: true,
      total_comments: true,
      ai_summaries: true,
      ai_questions: true,
    };

    if (!data) {
      // Create default toggles
      const { error: createError } = await supabase
        .from('feature_toggles')
        .insert(defaultToggles);

      if (createError) {
        console.error('Error creating default toggles:', createError);
        console.error('Error code:', createError.code);
        console.error('Error message:', createError.message);
        console.error('Error details:', createError.details);
        console.error('Error hint:', createError.hint);
      }

      return NextResponse.json({
        totalViews: defaultToggles.total_views,
        totalLikes: defaultToggles.total_likes,
        totalComments: defaultToggles.total_comments,
        aiSummaries: defaultToggles.ai_summaries,
        aiQuestions: defaultToggles.ai_questions,
      });
    }

    return NextResponse.json({
      totalViews: data.total_views,
      totalLikes: data.total_likes,
      totalComments: data.total_comments,
      aiSummaries: data.ai_summaries,
      aiQuestions: data.ai_questions,
    });
  } catch (error) {
    console.error('Toggles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch toggles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { feature, enabled } = await request.json();

    if (!feature || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Feature and enabled status are required' }, { status: 400 });
    }

    // Map frontend feature names to database column names
    const columnMap: { [key: string]: string } = {
      totalViews: 'total_views',
      totalLikes: 'total_likes',
      totalComments: 'total_comments',
      aiSummaries: 'ai_summaries',
      aiQuestions: 'ai_questions',
    };

    const columnName = columnMap[feature];
    if (!columnName) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }

    // Check if toggles exist
    const { data: existing } = await supabase
      .from('feature_toggles')
      .select('*')
      .single();

    if (!existing) {
      // Create new toggles record
      const defaultToggles = {
        total_views: true,
        total_likes: true,
        total_comments: true,
        ai_summaries: true,
        ai_questions: true,
        [columnName]: enabled,
      };

      const { error } = await supabase
        .from('feature_toggles')
        .insert(defaultToggles);

      if (error) {
        console.error('Error creating toggles:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        return NextResponse.json({ error: 'Failed to update toggle' }, { status: 500 });
      }
    } else {
      // Update existing toggles
      const { error } = await supabase
        .from('feature_toggles')
        .update({ [columnName]: enabled })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating toggle:', error);
        return NextResponse.json({ error: 'Failed to update toggle' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggles API error:', error);
    return NextResponse.json({ error: 'Failed to update toggle' }, { status: 500 });
  }
}