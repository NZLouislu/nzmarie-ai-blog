import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/stats?postId={postId}&language={language}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId"); // This is actually the slug
    const language = searchParams.get("language") || "en";

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Get stats from Supabase
    const { data: stats, error } = await supabase
      .from("post_stats")
      .select("*")
      .eq("post_id", postId)
      .eq("language", language)
      .single();

    if (error) {
      console.error("Supabase error when fetching stats:", error);
      // Return default stats if not found
      return NextResponse.json({
        post_id: postId,
        title: "",
        views: 0,
        likes: 0,
        ai_questions: 0,
        ai_summaries: 0,
        comments: 0,
        language: language || "en",
      });
    }

    if (!stats) {
      // Return default stats if not found
      return NextResponse.json({
        post_id: postId,
        title: "",
        views: 0,
        likes: 0,
        ai_questions: 0,
        ai_summaries: 0,
        comments: 0,
        language: language || "en",
      });
    }

    return NextResponse.json({
      ...stats,
      ai_questions: stats.ai_questions || 0,
      ai_summaries: stats.ai_summaries || 0,
      comments: stats.comments || 0,
    });
  } catch (error) {
    console.error("Error in GET /api/stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

// POST /api/stats (increment views)
export async function POST(request: NextRequest) {
  try {
    const { postId, language = "en", action } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Convert postId to match database format without language suffix
    // The postId from frontend may include language suffix, but database stores without it
    const dbPostId = postId.endsWith(`-${language}`)
      ? postId.slice(0, -(language.length + 1))
      : postId;

    // For now, we'll assume all users are non-admins to avoid the authentication issue
    // In a real application, you would check the user's role from the session/cookie
    const isAdmin = false;

    // Get or create post stats in Supabase
    const updateData: { [key: string]: { increment: number } } = {};
    switch (action) {
      case "view":
        updateData.views = { increment: 1 };
        break;
      case "like":
        updateData.likes = { increment: 1 };
        break;
      case "ai_question":
        updateData.ai_questions = { increment: 1 };
        break;
      case "ai_summary":
        updateData.ai_summaries = { increment: 1 };
        break;
      case "comment":
        updateData.comments = { increment: 1 };
        break;
      default:
        updateData.views = { increment: 1 };
    }

    // Try upsert with the correct conflict resolution first
    const upsertData = {
      post_id: dbPostId,
      title: `Post ${dbPostId}`,
      language: language,
      views: action === "view" ? 1 : 0,
      likes: action === "like" ? 1 : 0,
      ai_questions: action === "ai_question" ? 1 : 0,
      ai_summaries: action === "ai_summary" ? 1 : 0,
      comments: action === "comment" ? 1 : 0,
    };

    // Upsert stats in Supabase
    const { data: updatedStats, error } = await supabase
      .from("post_stats")
      .upsert(upsertData, {
        onConflict: "post_id,language", // This should match the unique constraint
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error when updating stats:", error);

      // If the error is due to the old constraint, try to handle it
      if (
        error.code === "23505" &&
        error.message.includes("post_stats_post_id_key")
      ) {
        // Conflict due to old constraint, try to update existing record directly
        // If upsert fails due to conflict, try to update existing record
        const { data: updatedStats, error: updateError } = await supabase
          .from("post_stats")
          .update({
            views: action === "view" ? { increment: 1 } : undefined,
            likes: action === "like" ? { increment: 1 } : undefined,
            ai_questions:
              action === "ai_question" ? { increment: 1 } : undefined,
            ai_summaries:
              action === "ai_summary" ? { increment: 1 } : undefined,
            comments: action === "comment" ? { increment: 1 } : undefined,
          })
          .eq("post_id", dbPostId)
          .eq("language", language)
          .select()
          .single();

        if (updateError) {
          console.error("Supabase error when updating stats:", updateError);
          return NextResponse.json(
            { error: "Failed to update stats" },
            { status: 500 }
          );
        }

        // Continue with daily stats update
        await updateDailyStats(dbPostId, language, action, isAdmin);
        return NextResponse.json(updatedStats);
      }

      // If upsert fails due to conflict, try to update existing record
      const { data: updatedStats, error: updateError } = await supabase
        .from("post_stats")
        .update({
          views: action === "view" ? { increment: 1 } : undefined,
          likes: action === "like" ? { increment: 1 } : undefined,
          ai_questions: action === "ai_question" ? { increment: 1 } : undefined,
          ai_summaries: action === "ai_summary" ? { increment: 1 } : undefined,
          comments: action === "comment" ? { increment: 1 } : undefined,
        })
        .eq("post_id", dbPostId)
        .eq("language", language)
        .select()
        .single();

      if (updateError) {
        console.error("Supabase error when updating stats:", updateError);
        return NextResponse.json(
          { error: "Failed to update stats" },
          { status: 500 }
        );
      }

      // Continue with daily stats update
      await updateDailyStats(dbPostId, language, action, isAdmin);
      return NextResponse.json(updatedStats);
    }

    // Also update daily stats
    await updateDailyStats(dbPostId, language, action, isAdmin);
    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error("Error in POST /api/stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}

// Helper function to update daily stats
async function updateDailyStats(
  dbPostId: string,
  language: string,
  action: string,
  isAdmin: boolean
) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC

  // Upsert daily stats - include post_id as it's required
  const { error: dailyError } = await supabase.from("daily_stats").upsert(
    {
      post_id: dbPostId,
      userId: "nzmarie",
      date: today,
      language: language,
      views: action === "view" ? 1 : 0,
      likes: action === "like" ? 1 : 0,
      ai_questions: action === "ai_question" ? 1 : 0,
      ai_summaries: action === "ai_summary" ? 1 : 0,
      pageViews: action === "view" ? 1 : 0,
      uniqueVisitors: isAdmin ? 0 : 1,
      reads: 0,
      comments: action === "comment" ? 1 : 0,
    },
    {
      onConflict: "userId,date,language",
    }
  );

  if (dailyError) {
    console.error("Supabase error when updating daily stats:", dailyError);
  }
}

// PUT /api/stats/like (increment likes)
export async function PUT(request: NextRequest) {
  try {
    const { postId, language = "en" } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Convert postId to match database format without language suffix
    // The postId from frontend may include language suffix, but database stores without it
    const dbPostId = postId.endsWith(`-${language}`)
      ? postId.slice(0, -(language.length + 1))
      : postId;

    // Try upsert with the correct conflict resolution first
    const upsertData = {
      post_id: dbPostId,
      language: language,
      likes: 1,
    };

    // Increment likes in Supabase
    const { data: updatedStats, error } = await supabase
      .from("post_stats")
      .upsert(upsertData, {
        onConflict: "post_id,language",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error when updating likes:", error);

      // If the error is due to the old constraint, try to handle it
      if (
        error.code === "23505" &&
        error.message.includes("post_stats_post_id_key")
      ) {
        // Conflict due to old constraint, try to update existing record directly
        // If upsert fails due to conflict, try to update existing record
        const { data: updatedStats, error: updateError } = await supabase
          .from("post_stats")
          .update({
            likes: { increment: 1 },
          })
          .eq("post_id", dbPostId)
          .eq("language", language)
          .select()
          .single();

        if (updateError) {
          console.error("Supabase error when updating likes:", updateError);
          return NextResponse.json(
            { error: "Failed to update likes" },
            { status: 500 }
          );
        }

        return NextResponse.json(updatedStats);
      }

      // If upsert fails due to conflict, try to update existing record
      const { data: updatedStats, error: updateError } = await supabase
        .from("post_stats")
        .update({
          likes: { increment: 1 },
        })
        .eq("post_id", dbPostId)
        .eq("language", language)
        .select()
        .single();

      if (updateError) {
        console.error("Supabase error when updating likes:", updateError);
        return NextResponse.json(
          { error: "Failed to update likes" },
          { status: 500 }
        );
      }

      return NextResponse.json(updatedStats);
    }

    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error("Error in PUT /api/stats/like:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
