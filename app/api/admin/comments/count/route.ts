import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { listPublished } from "@/lib/posts";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Get all published posts from both languages
    const enPosts = listPublished("en");
    const zhPosts = listPublished("zh");

    const allPosts = [
      ...enPosts.map((post) => ({ ...post, language: "en" })),
      ...zhPosts.map((post) => ({ ...post, language: "zh" })),
    ];

    console.log(
      `Found ${enPosts.length} English posts and ${zhPosts.length} Chinese posts`
    );

    const postsWithCommentCounts = await Promise.all(
      allPosts.map(async (post) => {
        const { count: commentCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("postId", `${post.id}-${post.language}`)
          .eq("language", post.language);

        return {
          id: post.id,
          post_id: post.id,
          title: post.title,
          language: post.language,
          _count: { comments: commentCount || 0 },
        };
      })
    );

    console.log(
      "Posts with comment counts:",
      JSON.stringify(postsWithCommentCounts, null, 2)
    );
    return NextResponse.json(postsWithCommentCounts);
  } catch (error) {
    console.error("Failed to fetch comment counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
