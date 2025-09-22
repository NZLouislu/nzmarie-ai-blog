import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/comments?postId={postId}
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

    // Get comments from Supabase
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("postId", postId)
      .eq("language", language)
      .eq("status", "approved")
      .order("createdAt", { ascending: false });

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

    // Convert postId to match database format without language suffix
    // The postId from frontend includes language suffix, but database stores without it
    const dbPostId = postId.endsWith(`-${language}`)
      ? postId.slice(0, -(language.length + 1))
      : postId;

    // Create comment in Supabase
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        postId: dbPostId,
        authorName: isAnonymous ? "Anonymous" : authorName,
        authorEmail: isAnonymous ? "anonymous@example.com" : authorEmail,
        content: content,
        is_anonymous: isAnonymous || false,
        status: "pending",
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

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
