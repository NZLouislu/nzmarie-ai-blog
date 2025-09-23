import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { listPublished } from "@/lib/posts";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    console.log("Starting post initialization...");

    // Get all published posts from both languages
    const enPosts = listPublished("en");
    const zhPosts = listPublished("zh");

    console.log(
      `Found ${enPosts.length} English posts and ${zhPosts.length} Chinese posts`
    );

    let initialized = 0;
    let updated = 0;

    // Initialize English posts
    for (const post of enPosts) {
      // Ensure post.id is valid
      if (!post.id) {
        console.error(`Skipping English post with invalid ID:`, post);
        continue;
      }

      const { data: existing } = await supabase
        .from("post_stats")
        .select("id")
        .eq("post_id", post.id)
        .eq("language", "en")
        .single();

      if (!existing) {
        const { error } = await supabase
          .from("post_stats")
          .insert({
            post_id: post.id,
            title: post.title,
            views: 0,
            likes: 0,
            ai_questions: 0,
            ai_summaries: 0,
            language: "en",
          })
          .select(); // Add select() to avoid void return

        if (error) {
          // Check if it's a duplicate key error, if so, it's not a real error
          if (error.code === "23505") {
            console.log(`English post ${post.id} already exists, skipping...`);
            initialized++;
          } else {
            console.error(
              `Failed to initialize English post ${post.id}:`,
              error
            );
          }
        } else {
          initialized++;
          console.log(`Initialized English post: ${post.title}`);

          // Insert initial daily stats
          const today = new Date().toISOString().split("T")[0];
          const { error: dailyStatsError } = await supabase
            .from("daily_stats")
            .insert({
              post_id: post.id,
              date: today,
              views: 0,
              likes: 0,
              ai_questions: 0,
              ai_summaries: 0,
              language: "en",
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
        // Update title if needed
        const { error } = await supabase
          .from("post_stats")
          .update({ title: post.title })
          .eq("post_id", post.id)
          .eq("language", "en");

        if (!error) {
          updated++;
        }
      }
    }

    // Initialize Chinese posts
    for (const post of zhPosts) {
      // Ensure post.id is valid
      if (!post.id) {
        console.error(`Skipping Chinese post with invalid ID:`, post);
        continue;
      }

      const { data: existing } = await supabase
        .from("post_stats")
        .select("id")
        .eq("post_id", post.id)
        .eq("language", "zh")
        .single();

      if (!existing) {
        const { error } = await supabase
          .from("post_stats")
          .insert({
            post_id: post.id,
            title: post.title,
            views: 0,
            likes: 0,
            ai_questions: 0,
            ai_summaries: 0,
            language: "zh",
          })
          .select(); // Add select() to avoid void return

        if (error) {
          // Check if it's a duplicate key error, if so, it's not a real error
          if (error.code === "23505") {
            console.log(`Chinese post ${post.id} already exists, skipping...`);
            initialized++;
          } else {
            console.error(
              `Failed to initialize Chinese post ${post.id}:`,
              error
            );
          }
        } else {
          initialized++;
          console.log(`Initialized Chinese post: ${post.title}`);

          // Insert initial daily stats
          const today = new Date().toISOString().split("T")[0];
          const { error: dailyStatsError } = await supabase
            .from("daily_stats")
            .insert({
              post_id: post.id,
              date: today,
              views: 0,
              likes: 0,
              ai_questions: 0,
              ai_summaries: 0,
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
        // Update title if needed
        const { error } = await supabase
          .from("post_stats")
          .update({ title: post.title })
          .eq("post_id", post.id)
          .eq("language", "zh");

        if (!error) {
          updated++;
        }
      }
    }

    console.log(
      `Post initialization complete: ${initialized} new, ${updated} updated`
    );

    return NextResponse.json({
      success: true,
      message: `Post initialization complete: ${initialized} new posts initialized, ${updated} posts updated`,
      initialized,
      updated,
      totalEnglish: enPosts.length,
      totalChinese: zhPosts.length,
    });
  } catch (error) {
    console.error("Failed to initialize posts:", error);
    return NextResponse.json(
      { error: "Failed to initialize posts", details: error },
      { status: 500 }
    );
  }
}
