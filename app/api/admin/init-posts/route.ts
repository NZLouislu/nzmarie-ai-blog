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
      const { data: existing } = await supabase
        .from("post_stats")
        .select("id")
        .eq("post_id", post.id)
        .eq("language", "en")
        .single();

      if (!existing) {
        const { error } = await supabase.from("post_stats").insert({
          post_id: post.id,
          title: post.title,
          views: 0,
          likes: 0,
          ai_questions: 0,
          ai_summaries: 0,
          language: "en",
        });

        if (error) {
          console.error(`Failed to initialize English post ${post.id}:`, error);
        } else {
          initialized++;
          console.log(`Initialized English post: ${post.title}`);
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
      const { data: existing } = await supabase
        .from("post_stats")
        .select("id")
        .eq("post_id", post.id)
        .eq("language", "zh")
        .single();

      if (!existing) {
        const { error } = await supabase.from("post_stats").insert({
          post_id: post.id,
          title: post.title,
          views: 0,
          likes: 0,
          ai_questions: 0,
          ai_summaries: 0,
          language: "zh",
        });

        if (error) {
          console.error(`Failed to initialize Chinese post ${post.id}:`, error);
        } else {
          initialized++;
          console.log(`Initialized Chinese post: ${post.title}`);
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
