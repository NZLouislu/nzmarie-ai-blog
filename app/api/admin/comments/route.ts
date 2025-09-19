import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const language = searchParams.get("language");

    console.log("Fetching comments for:", { postId, language });

    let query = supabase
      .from("comments")
      .select(
        "id, postId, authorName, authorEmail, content, is_anonymous, createdAt, language"
      )
      .order("createdAt", { ascending: false });

    if (postId) {
      // Convert postId to match database format with language suffix
      const dbPostId = `${postId}-${language || 'en'}`;
      query = query.eq("postId", dbPostId);
    }

    if (language) {
      query = query.eq("language", language);
    }

    const { data: comments, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    console.log(`Found ${comments?.length || 0} comments`);
    return NextResponse.json(comments || []);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    console.log("Deleting comment:", id);

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
