import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || "test-draft-article";
    const lang = searchParams.get("lang") || "en";

    console.log("=== Test Draft API Debug Info ===");
    console.log("Slug:", slug);
    console.log("Language:", lang);

    const post = getPostBySlug(slug, lang as "en" | "zh");

    console.log("Post found:", !!post);
    if (post) {
      console.log("Post status:", post.status);
      console.log("Post language:", post.language);
      console.log("Post title:", post.title);
    }

    return NextResponse.json({
      slug,
      lang,
      postExists: !!post,
      post: post
        ? {
            title: post.title,
            status: post.status,
            language: post.language,
          }
        : null,
    });
  } catch (error) {
    console.error("Test draft error:", error);
    return NextResponse.json(
      { error: "Failed to test draft" },
      { status: 500 }
    );
  }
}
