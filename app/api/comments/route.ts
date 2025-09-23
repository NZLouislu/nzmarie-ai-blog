import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/comments?postId={postId}&language={language}
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

    // For comments, we always use the base postId (without language suffix)
    // but filter by language field
    const dbPostId = postId.replace(/-zh$/, ""); // Remove -zh suffix if present

    // Get comments from Supabase
    let query = supabase
      .from("comments")
      .select("*")
      .eq("postId", dbPostId)
      .eq("language", language)
      .order("createdAt", { ascending: false });

    // In development, show all comments regardless of status
    // In production, only show approved comments
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode: showing all comments");
      // Don't add status filter in development
    } else {
      query = query.eq("status", "approved");
    }

    const { data: comments, error } = await query;

    if (error) {
      console.error("Supabase error when fetching comments:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const {
      postId,
      authorName,
      authorEmail,
      content,
      isAnonymous,
      language = "en",
    } = await request.json();

    // Validate required fields
    if (!postId || !content) {
      return NextResponse.json(
        { error: "Post ID and content are required" },
        { status: 400 }
      );
    }

    // For comments, we always use the base postId (without language suffix)
    // Comments table stores postId without language suffix, but we filter by language field
    const dbPostId = postId.replace(/-zh$/, ""); // Remove -zh suffix if present

    // Create comment in Supabase
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        postId: dbPostId,
        authorName: isAnonymous ? "Anonymous" : authorName,
        authorEmail: isAnonymous ? "anonymous@example.com" : authorEmail,
        content: content,
        is_anonymous: isAnonymous || false,
        status: process.env.NODE_ENV === "development" ? "approved" : "pending", // Auto-approve in development
        language: language,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error when creating comment:", error);
      return NextResponse.json(
        { error: "Failed to create comment" },
        { status: 500 }
      );
    }

    // After successfully creating a comment, increment the comment count in post_stats
    try {
      // For stats, we need to use the correct postId with language suffix for Chinese
      const statsPostId = language === "zh" ? `${dbPostId}-zh` : dbPostId;

      // First, try to get existing record
      const { data: existingStats, error: selectError } = await supabase
        .from("post_stats")
        .select("*")
        .eq("post_id", statsPostId)
        .eq("language", language)
        .limit(1)
        .single();

      // Handle select error (other than "no rows found")
      if (selectError && selectError.code !== "PGRST116") {
        console.error("Supabase error when fetching stats:", selectError);
      }

      // Prepare upsert data
      const upsertData = {
        post_id: statsPostId,
        title: `Post ${postId}`,
        language: language,
        views: existingStats?.views || 0,
        likes: existingStats?.likes || 0,
        ai_questions: existingStats?.ai_questions || 0,
        ai_summaries: existingStats?.ai_summaries || 0,
        comments: (existingStats?.comments || 0) + 1, // Increment comments
      };

      // Use insert for new records, or update for existing records to avoid constraint issues
      if (existingStats) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("post_stats")
          .update(upsertData)
          .eq("id", existingStats.id)
          .select()
          .single();

        if (updateError) {
          console.error("Supabase error when updating stats:", updateError);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("post_stats")
          .insert(upsertData)
          .select()
          .single();

        if (insertError) {
          console.error("Supabase error when inserting stats:", insertError);
        }
      }
    } catch (statsUpdateError) {
      console.error(
        "Error updating post stats after comment creation:",
        statsUpdateError
      );
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
