import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (postId) {
      // Get stats for a specific post
      const { data: stats, error: statsError } = await supabase
        .from('post_stats')
        .select('*')
        .eq('post_id', postId)
        .single();

      // Get comment count
      const { count: commentCount, error: commentError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Stats error:', statsError);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
      }

      const defaultStats = {
        views: 1,
        likes: 1,
        comments: commentCount || 0,
        ai_questions: 1
      };

      if (!stats) {
        // Create default stats if they don't exist
        const { error: createError } = await supabase
          .from('post_stats')
          .insert({
            post_id: postId,
            title: 'Blog Post',
            views: defaultStats.views,
            likes: defaultStats.likes,
            ai_questions: 0
          });

        if (createError) {
          console.error('Create stats error:', createError);
        }

        return NextResponse.json(defaultStats);
      }

      return NextResponse.json({
        views: stats.views,
        likes: stats.likes,
        comments: commentCount || 0,
        ai_questions: stats.ai_questions
      });
    } else {
      // Get total stats for all posts
      const { data: stats, error: statsError } = await supabase
        .from('post_stats')
        .select('views, likes, ai_questions');

      if (statsError) {
        console.error('Total stats error:', statsError);
        return NextResponse.json({
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          totalAiQuestions: 0
        });
      }

      const totalViews = stats?.reduce((sum, stat) => sum + (stat.views || 0), 0) || 0;
      const totalLikes = stats?.reduce((sum, stat) => sum + (stat.likes || 0), 0) || 0;
      const totalAiQuestions = stats?.reduce((sum, stat) => sum + (stat.ai_questions || 0), 0) || 0;

      const { count: totalComments, error: commentError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      return NextResponse.json({
        totalViews,
        totalLikes,
        totalComments: totalComments || 0,
        totalAiQuestions
      });
    }
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, action } = await request.json();

    if (!postId || !action) {
      return NextResponse.json({ error: 'Post ID and action are required' }, { status: 400 });
    }

    if (action === 'like') {
      // Increment likes
      const { error: likeError } = await supabase.rpc('increment_likes', { post_id_param: postId });

      if (likeError) {
        // Fallback: manual update
        const { data: existing } = await supabase
          .from('post_stats')
          .select('likes')
          .eq('post_id', postId)
          .single();

        if (existing) {
          await supabase
            .from('post_stats')
            .update({ likes: (existing.likes || 0) + 1 })
            .eq('post_id', postId);
        } else {
          await supabase
            .from('post_stats')
            .insert({
              post_id: postId,
              title: 'Blog Post',
              likes: 1,
              views: 0,
              ai_questions: 0
            });
        }
      }

      // Update daily stats
      const today = new Date().toISOString().split('T')[0];

      const { data: existingDaily } = await supabase
        .from('daily_stats')
        .select('likes')
        .eq('post_id', postId)
        .eq('date', today)
        .single();

      if (existingDaily) {
        await supabase
          .from('daily_stats')
          .update({ likes: (existingDaily.likes || 0) + 1 })
          .eq('post_id', postId)
          .eq('date', today);
      } else {
        await supabase
          .from('daily_stats')
          .insert({
            post_id: postId,
            date: today,
            views: 0,
            likes: 1,
            ai_questions: 0
          });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'view') {
      // Increment views
      const { data: existing } = await supabase
        .from('post_stats')
        .select('views')
        .eq('post_id', postId)
        .single();

      if (existing) {
        await supabase
          .from('post_stats')
          .update({ views: (existing.views || 0) + 1 })
          .eq('post_id', postId);
      } else {
        await supabase
          .from('post_stats')
          .insert({
            post_id: postId,
            title: 'Blog Post',
            views: 1,
            likes: 0,
            ai_questions: 0
          });
      }

      // Update daily stats
      const today = new Date().toISOString().split('T')[0];

      const { data: existingDaily } = await supabase
        .from('daily_stats')
        .select('views')
        .eq('post_id', postId)
        .eq('date', today)
        .single();

      if (existingDaily) {
        await supabase
          .from('daily_stats')
          .update({ views: (existingDaily.views || 0) + 1 })
          .eq('post_id', postId)
          .eq('date', today);
      } else {
        await supabase
          .from('daily_stats')
          .insert({
            post_id: postId,
            date: today,
            views: 1,
            likes: 0,
            ai_questions: 0
          });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'ai_question') {
      // Increment AI questions
      const { data: existing } = await supabase
        .from('post_stats')
        .select('ai_questions')
        .eq('post_id', postId)
        .single();

      if (existing) {
        await supabase
          .from('post_stats')
          .update({ ai_questions: (existing.ai_questions || 0) + 1 })
          .eq('post_id', postId);
      } else {
        await supabase
          .from('post_stats')
          .insert({
            post_id: postId,
            title: 'Blog Post',
            views: 0,
            likes: 0,
            ai_questions: 1
          });
      }

      // Update daily stats
      const today = new Date().toISOString().split('T')[0];

      const { data: existingDaily } = await supabase
        .from('daily_stats')
        .select('ai_questions')
        .eq('post_id', postId)
        .eq('date', today)
        .single();

      if (existingDaily) {
        await supabase
          .from('daily_stats')
          .update({ ai_questions: (existingDaily.ai_questions || 0) + 1 })
          .eq('post_id', postId)
          .eq('date', today);
      } else {
        await supabase
          .from('daily_stats')
          .insert({
            post_id: postId,
            date: today,
            views: 0,
            likes: 0,
            ai_questions: 1
          });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}