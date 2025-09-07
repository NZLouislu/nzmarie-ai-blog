import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { listPublished } from "@/lib/posts";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
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
        totalStats?.reduce((sum, stat) => sum + (stat.ai_questions || 0), 0) ||
        0,
      totalAiSummaries:
        totalStats?.reduce((sum, stat) => sum + (stat.ai_summaries || 0), 0) ||
        0,
    };

    // Get total comments
    const { count: totalComments } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true });

    const totalsWithComments = {
      ...totals,
      totalComments: totalComments || 0,
    };

    // Get individual post stats
    const { data: postStats, error: postError } = await supabase
      .from("post_stats")
      .select("*");

    if (postError) {
      console.error("Error fetching post stats:", postError);
      return NextResponse.json(
        { error: "Failed to fetch post stats" },
        { status: 500 }
      );
    }

    // Get posts data for titles
    const posts = listPublished().map((post) => ({
      id: post.id,
      title: post.title,
    }));

    // Combine post stats with titles
    const individualStats =
      postStats?.map((stat) => {
        const post = posts?.find((p) => p.id === stat.post_id);
        return {
          postId: stat.post_id,
          title: post?.title || "Unknown Post",
          views: stat.views || 0,
          likes: stat.likes || 0,
          aiQuestions: stat.ai_questions || 0,
          aiSummaries: stat.ai_summaries || 0,
        };
      }) || [];

    // Get daily stats for time-based analysis
    const { data: dailyStats, error: dailyError } = await supabase
      .from("daily_stats")
      .select("*")
      .order("date", { ascending: false })
      .limit(30); // Last 30 days

    if (dailyError) {
      console.error("Error fetching daily stats:", dailyError);
    }

    // Aggregate daily stats
    interface DailyAggregate {
      date: string;
      views: number;
      likes: number;
      aiQuestions: number;
      aiSummaries: number;
    }

    const dailyAggregates =
      dailyStats?.reduce((acc: Record<string, DailyAggregate>, stat) => {
        const date = stat.date.split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            views: 0,
            likes: 0,
            aiQuestions: 0,
            aiSummaries: 0,
          };
        }
        acc[date].views += stat.views || 0;
        acc[date].likes += stat.likes || 0;
        acc[date].aiQuestions += stat.ai_questions || 0;
        acc[date].aiSummaries += stat.ai_summaries || 0;
        return acc;
      }, {} as Record<string, DailyAggregate>) || {};

    const dailyStatsArray = Object.values(dailyAggregates).sort(
      (a: DailyAggregate, b: DailyAggregate) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      totals: totalsWithComments,
      individualStats,
      dailyStats: dailyStatsArray,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
