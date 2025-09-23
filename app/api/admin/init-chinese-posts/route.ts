import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { listPublished } from "@/lib/posts";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { language = "zh" } = await request.json();

    if (language !== "zh") {
      return NextResponse.json(
        { error: "Only Chinese language initialization is supported" },
        { status: 400 }
      );
    }

    const zhPosts = listPublished("zh");

    if (zhPosts.length === 0) {
      return NextResponse.json(
        { error: "No Chinese posts found" },
        { status: 404 }
      );
    }

    const results = [];

    for (const post of zhPosts) {
      // Ensure post.id is valid
      if (!post.id) {
        console.error(`Skipping Chinese post with invalid ID:`, post);
        results.push({
          post_id: "unknown",
          status: "error",
          error: "Invalid post ID",
        });
        continue;
      }

      const { data: existingStats } = await supabase
        .from("post_stats")
        .select("id")
        .eq("post_id", post.id)
        .eq("language", "zh")
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
            language: "zh",
          })
          .select()
          .single();

        if (statsError) {
          // Check if it's a duplicate key error, if so, it's not a real error
          if (statsError.code === "23505") {
            console.log(
              `Chinese post ${post.id} already exists, marking as exists...`
            );
            results.push({ post_id: post.id, status: "exists" });
          } else {
            console.error(`Failed to create stats for ${post.id}:`, statsError);
            results.push({
              post_id: post.id,
              status: "error",
              error: statsError.message,
            });
          }
        } else {
          results.push({ post_id: post.id, status: "created", data: newStats });
        }

        // Only insert daily stats if post stats were successfully created or if we're updating
        if (!statsError || statsError.code === "23505") {
          const today = new Date().toISOString().split("T")[0];
          const { error: dailyStatsError } = await supabase
            .from("daily_stats")
            .insert({
              post_id: post.id,
              date: today,
              views: Math.floor(Math.random() * 20) + 5,
              likes: Math.floor(Math.random() * 5) + 1,
              ai_questions: Math.floor(Math.random() * 3),
              ai_summaries: Math.floor(Math.random() * 4) + 1,
              language: "zh",
            });

          // We don't need to handle duplicate errors for daily_stats as they might be expected
          if (dailyStatsError && dailyStatsError.code !== "23505") {
            console.error(
              `Failed to create daily stats for ${post.id}:`,
              dailyStatsError
            );
          }
        }
      } else {
        results.push({ post_id: post.id, status: "exists" });
      }
    }

    return NextResponse.json({
      message: `Processed ${zhPosts.length} Chinese posts`,
      results,
    });
  } catch (error) {
    console.error("Init Chinese posts error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Chinese posts" },
      { status: 500 }
    );
  }
}
