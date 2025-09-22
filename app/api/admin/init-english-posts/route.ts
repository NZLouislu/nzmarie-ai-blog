import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { listPublished } from "@/lib/posts";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { language = "en" } = await request.json();

    if (language !== "en") {
      return NextResponse.json(
        { error: "Only English language initialization is supported" },
        { status: 400 }
      );
    }

    const enPosts = listPublished("en");

    if (enPosts.length === 0) {
      return NextResponse.json(
        { error: "No English posts found" },
        { status: 404 }
      );
    }

    const results = [];

    for (const post of enPosts) {
      const { data: existingStats } = await supabase
        .from("post_stats")
        .select("id")
        .eq("post_id", post.id)
        .eq("language", "en")
        .single();

      if (!existingStats) {
        const { data: newStats, error: statsError } = await supabase
          .from("post_stats")
          .insert({
            post_id: post.id,
            title: post.title,
            views: Math.floor(Math.random() * 200) + 50,
            likes: Math.floor(Math.random() * 30) + 5,
            ai_questions: Math.floor(Math.random() * 15) + 1,
            ai_summaries: Math.floor(Math.random() * 20) + 2,
            language: "en",
          })
          .select()
          .single();

        if (statsError) {
          console.error(`Failed to create stats for ${post.id}:`, statsError);
          results.push({
            post_id: post.id,
            status: "error",
            error: statsError.message,
          });
        } else {
          results.push({ post_id: post.id, status: "created", data: newStats });
        }

        const today = new Date().toISOString().split("T")[0];
        await supabase.from("daily_stats").insert({
          post_id: post.id,
          date: today,
          views: Math.floor(Math.random() * 20) + 5,
          likes: Math.floor(Math.random() * 5) + 1,
          ai_questions: Math.floor(Math.random() * 3),
          ai_summaries: Math.floor(Math.random() * 4) + 1,
          language: "en",
        });
      } else {
        results.push({ post_id: post.id, status: "exists" });
      }
    }

    return NextResponse.json({
      message: `Processed ${enPosts.length} English posts`,
      results,
    });
  } catch (error) {
    console.error("Init English posts error:", error);
    return NextResponse.json(
      { error: "Failed to initialize English posts" },
      { status: 500 }
    );
  }
}
