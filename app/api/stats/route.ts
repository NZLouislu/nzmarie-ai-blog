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

    // Convert postId to match database format with language suffix for Chinese
    // For Chinese posts, the postId in database includes -zh suffix
    const dbPostId = language === "zh" ? `${postId}-zh` : postId;

    // For now, we'll assume all users are non-admins to avoid the authentication issue
    // In a real application, you would check the user's role from the session/cookie
    const isAdmin = false;

    // First, try to get existing record
    const { data: existingStats, error: selectError } = await supabase
      .from("post_stats")
      .select("*")
      .eq("post_id", dbPostId)
      .eq("language", language)
      .limit(1)
      .single();

    // Handle select error (other than "no rows found")
    if (selectError && selectError.code !== "PGRST116") {
      console.error("Supabase error when fetching stats:", selectError);
    }

    // Prepare upsert data
    const upsertData = {
      post_id: dbPostId,
      title: `Post ${postId}`, // Use original postId for title
      language: language,
      views: existingStats?.views || 0,
      likes: existingStats?.likes || 0,
      ai_questions: existingStats?.ai_questions || 0,
      ai_summaries: existingStats?.ai_summaries || 0,
      comments: existingStats?.comments || 0,
    };

    // Apply increment based on action
    switch (action) {
      case "view":
        upsertData.views += 1;
        break;
      case "like":
        upsertData.likes += 1;
        break;
      case "ai_question":
        upsertData.ai_questions += 1;
        break;
      case "ai_summary":
        upsertData.ai_summaries += 1;
        break;
      case "comment":
        upsertData.comments += 1;
        break;
      default:
        upsertData.views += 1;
    }

    // Use insert for new records, or update for existing records to avoid constraint issues
    if (existingStats) {
      // Update existing record
      const { data: updatedStats, error: updateError } = await supabase
        .from("post_stats")
        .update(upsertData)
        .eq("id", existingStats.id)
        .select()
        .single();

      if (updateError) {
        console.error("Supabase error when updating stats:", updateError);
        return NextResponse.json(
          { error: "Failed to update stats" },
          { status: 500 }
        );
      }

      // Also update daily stats
      await updateDailyStats(dbPostId, language, action, isAdmin);
      return NextResponse.json(updatedStats);
    } else {
      // Insert new record
      const { data: insertedStats, error: insertError } = await supabase
        .from("post_stats")
        .insert(upsertData)
        .select()
        .single();

      if (insertError) {
        console.error("Supabase error when inserting stats:", insertError);
        return NextResponse.json(
          { error: "Failed to insert stats" },
          { status: 500 }
        );
      }

      // Also update daily stats
      await updateDailyStats(dbPostId, language, action, isAdmin);
      return NextResponse.json(insertedStats);
    }
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

  // Format date as YYYY-MM-DD to match database format
  const formattedDate = today.toISOString().split("T")[0];

  // First try to get existing record
  const { data: existingRecord, error: selectError } = await supabase
    .from("daily_stats")
    .select("*")
    .eq("userId", "nzmarie")
    .eq("date", formattedDate)
    .eq("language", language)
    .limit(1)
    .single();

  // If there's an error other than "no rows found", log it
  if (selectError && selectError.code !== "PGRST116") {
    console.error("Error selecting daily stats:", selectError);
  }

  // Prepare base update data
  const updateData = {
    userId: "nzmarie",
    date: formattedDate,
    language: language,
    pageViews: existingRecord?.pageViews || 0,
    uniqueVisitors: existingRecord?.uniqueVisitors || 0,
    reads: existingRecord?.reads || 0,
    likes: existingRecord?.likes || 0,
    comments: existingRecord?.comments || 0,
    ai_questions: existingRecord?.ai_questions || 0,
    ai_summaries: existingRecord?.ai_summaries || 0,
  };

  // Apply increment based on action
  switch (action) {
    case "view":
      updateData.pageViews += 1;
      updateData.uniqueVisitors = isAdmin
        ? updateData.uniqueVisitors
        : updateData.uniqueVisitors + 1;
      break;
    case "like":
      updateData.likes += 1;
      break;
    case "ai_question":
      updateData.ai_questions += 1;
      break;
    case "ai_summary":
      updateData.ai_summaries += 1;
      break;
    case "comment":
      updateData.comments += 1;
      break;
  }

  // Use insert for new records, or update for existing records
  if (existingRecord) {
    // Update existing record
    const { error: updateError } = await supabase
      .from("daily_stats")
      .update(updateData)
      .eq("id", existingRecord.id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase error when updating daily stats:", updateError);
    }
  } else {
    // Insert new record
    const { error: insertError } = await supabase
      .from("daily_stats")
      .insert(updateData)
      .select()
      .single();

    if (insertError) {
      console.error("Supabase error when inserting daily stats:", insertError);
    }
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

    // Convert postId to match database format with language suffix for Chinese
    // For Chinese posts, the postId in database includes -zh suffix
    const dbPostId = language === "zh" ? `${postId}-zh` : postId;

    // First, try to get existing record
    const { data: existingStats, error: selectError } = await supabase
      .from("post_stats")
      .select("*")
      .eq("post_id", dbPostId)
      .eq("language", language)
      .limit(1)
      .single();

    // Handle select error (other than "no rows found")
    if (selectError && selectError.code !== "PGRST116") {
      console.error("Supabase error when fetching stats:", selectError);
    }

    // Prepare upsert data
    const upsertData = {
      post_id: dbPostId,
      title: `Post ${postId}`, // Use original postId for title
      language: language,
      views: existingStats?.views || 0,
      likes: (existingStats?.likes || 0) + 1, // Increment likes
      ai_questions: existingStats?.ai_questions || 0,
      ai_summaries: existingStats?.ai_summaries || 0,
      comments: existingStats?.comments || 0,
    };

    // Use insert for new records, or update for existing records to avoid constraint issues
    if (existingStats) {
      // Update existing record
      const { data: updatedStats, error: updateError } = await supabase
        .from("post_stats")
        .update(upsertData)
        .eq("id", existingStats.id)
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
    } else {
      // Insert new record
      const { data: insertedStats, error: insertError } = await supabase
        .from("post_stats")
        .insert(upsertData)
        .select()
        .single();

      if (insertError) {
        console.error("Supabase error when inserting likes:", insertError);
        return NextResponse.json(
          { error: "Failed to insert likes" },
          { status: 500 }
        );
      }

      return NextResponse.json(insertedStats);
    }
  } catch (error) {
    console.error("Error in PUT /api/stats/like:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
