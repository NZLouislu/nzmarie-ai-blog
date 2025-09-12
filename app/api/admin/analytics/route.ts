import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getBySlug, listPublished } from "@/lib/posts";

export async function GET(request: NextRequest) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase environment variables not configured");
    return NextResponse.json(
      { error: "Server configuration error: Missing Supabase credentials" },
      { status: 500 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const aggregate = searchParams.get("aggregate");

    if (aggregate === "all") {
      let query = supabase.from("post_stats").select("views, likes");

      if (language) {
        query = query.eq("language", language);
      }

      const { data: stats, error: totalError } = await query;

      if (totalError) {
        console.error("Error fetching total stats:", totalError);
        return NextResponse.json(
          { error: "Failed to fetch total stats" },
          { status: 500 }
        );
      }

      const totals = {
        totalViews:
          stats?.reduce((sum, stat) => sum + (stat.views || 0), 0) || 0,
        totalLikes:
          stats?.reduce((sum, stat) => sum + (stat.likes || 0), 0) || 0,
      };

      return NextResponse.json(totals);
    } else if (aggregate === "single") {
      if (!language) {
        return NextResponse.json(
          { error: "Language required for single" },
          { status: 400 }
        );
      }

      const posts = listPublished(language as "en" | "zh");
      const postStats = await Promise.all(
        posts.map(async (post) => {
          const { data: stat, error: statError } = await supabase
            .from("post_stats")
            .select("views, likes")
            .eq("post_id", post.id)
            .eq("language", language)
            .single();

          if (statError && statError.code !== "PGRST116") {
            console.error("Error fetching post stats:", statError);
          }

          return {
            slug: post.slug,
            views: stat ? stat.views || 0 : 0,
            likes: stat ? stat.likes || 0 : 0,
          };
        })
      );

      return NextResponse.json(postStats);
    } else {
      // Get total stats
      const { data: totalStats, error: totalError } = await supabase
        .from("post_stats")
        .select("views, likes, ai_questions, ai_summaries");

      if (totalError) {
        console.error("Error fetching total stats:", totalError);
        return NextResponse.json(
          { error: "Failed to fetch total stats" },
          { status: 500 }
        );
      }

      const totals = {
        totalViews:
          totalStats?.reduce((sum, stat) => sum + (stat.views || 0), 0) || 0,
        totalLikes:
          totalStats?.reduce((sum, stat) => sum + (stat.likes || 0), 0) || 0,
        totalAiQuestions:
          totalStats?.reduce(
            (sum, stat) => sum + (stat.ai_questions || 0),
            0
          ) || 0,
        totalAiSummaries:
          totalStats?.reduce(
            (sum, stat) => sum + (stat.ai_summaries || 0),
            0
          ) || 0,
      };

      const { count: totalComments } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true });

      const enPosts = listPublished("en");
      const zhPosts = listPublished("zh");
      const totalPosts = enPosts.length + zhPosts.length;

      const totalsWithCommentsAndPosts = {
        ...totals,
        totalComments: totalComments || 0,
        totalPosts,
        totalPostsEnglish: enPosts.length,
        totalPostsChinese: zhPosts.length,
      };

      // Get individual post stats with language separation
      const { data: postStats, error: postError } = await supabase
        .from("post_stats")
        .select("*")
        .order("language", { ascending: true });

      if (postError) {
        console.error("Error fetching post stats:", postError);
        return NextResponse.json(
          { error: "Failed to fetch post stats" },
          { status: 500 }
        );
      }

      const individualStats =
        postStats?.map((stat) => {
          const post =
            stat.language === "zh"
              ? getBySlug(stat.post_id, "zh")
              : getBySlug(stat.post_id, "en");
          return {
            postId: stat.post_id,
            title: post ? post.title : "Unknown Post",
            language: stat.language,
            views: stat.views || 0,
            likes: stat.likes || 0,
            aiQuestions: stat.ai_questions || 0,
            aiSummaries: stat.ai_summaries || 0,
          };
        }) || [];

      const individualStatsWithComments = await Promise.all(
        individualStats.map(async (stat) => {
          const { count: commentCount } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", stat.postId);

          return {
            ...stat,
            comments: commentCount || 0,
          };
        })
      );

      // Get daily stats for time-based analysis with language separation
      const { data: dailyStats, error: dailyError } = await supabase
        .from("daily_stats")
        .select("*")
        .order("date", { ascending: false })
        .order("language", { ascending: true })
        .limit(60); // Increased limit to account for language separation

      if (dailyError) {
        console.error("Error fetching daily stats:", dailyError);
      }

      interface DailyAggregate {
        date: string;
        language: string;
        views: number;
        likes: number;
        comments: number;
        aiQuestions: number;
        aiSummaries: number;
      }

      const dailyAggregates =
        dailyStats?.reduce((acc: Record<string, DailyAggregate>, stat) => {
          const date = stat.date.split("T")[0];
          const key = `${date}-${stat.language}`;
          
          if (!acc[key]) {
            acc[key] = {
              date,
              language: stat.language,
              views: 0,
              likes: 0,
              comments: 0,
              aiQuestions: 0,
              aiSummaries: 0,
            };
          }
          acc[key].views += stat.views || 0;
          acc[key].likes += stat.likes || 0;
          acc[key].aiQuestions += stat.ai_questions || 0;
          acc[key].aiSummaries += stat.ai_summaries || 0;
          return acc;
        }, {} as Record<string, DailyAggregate>) || {};

      const dailyStatsArray = Object.values(dailyAggregates).sort(
        (a: DailyAggregate, b: DailyAggregate) => {
          const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateCompare === 0) {
            return a.language.localeCompare(b.language);
          }
          return dateCompare;
        }
      );

      const dailyStatsWithComments = await Promise.all(
        dailyStatsArray.map(async (dayStat) => {
          const { count: dayComments } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .gte("created_at", `${dayStat.date}T00:00:00.000Z`)
            .lt("created_at", `${dayStat.date}T23:59:59.999Z`);

          return {
            ...dayStat,
            comments: dayComments || 0,
          };
        })
      );

      return NextResponse.json({
        totals: totalsWithCommentsAndPosts,
        individualStats: individualStatsWithComments,
        dailyStats: dailyStatsWithComments,
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error("Analytics API error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
