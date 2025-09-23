import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 简单的测试路由，不进行复杂的会话验证
export async function GET(request: NextRequest) {
  try {
    console.log("Test toggles API called");

    // 直接使用固定的用户ID进行测试
    const testUserId = "nzmarie";

    // 获取功能切换
    const { data: toggles, error } = await supabase
      .from("feature_toggles")
      .select("*")
      .eq("user_id", testUserId)
      .limit(1)
      .single();

    if (error) {
      console.log("No toggles found, returning defaults");
      return NextResponse.json({
        totalViews: true,
        totalLikes: true,
        totalComments: true,
        aiSummaries: true,
        aiQuestions: true,
        homeStatistics: true,
      });
    }

    // 转换格式
    const result = {
      totalViews: toggles.total_views ?? true,
      totalLikes: toggles.total_likes ?? true,
      totalComments: toggles.total_comments ?? true,
      aiSummaries: toggles.ai_summaries ?? true,
      aiQuestions: toggles.ai_questions ?? true,
      homeStatistics: toggles.home_statistics ?? true,
    };

    console.log("Returning toggles:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch toggles" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("Test toggles PUT API called");

    const body = await request.json();
    const { key, value } = body;
    console.log("Update request:", { key, value });

    if (!key || typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // 字段映射
    const columnMap: Record<string, string> = {
      totalViews: "total_views",
      totalLikes: "total_likes",
      totalComments: "total_comments",
      aiSummaries: "ai_summaries",
      aiQuestions: "ai_questions",
      homeStatistics: "home_statistics",
    };

    const dbColumn = columnMap[key];
    if (!dbColumn) {
      return NextResponse.json(
        { error: `Invalid feature key: ${key}` },
        { status: 400 }
      );
    }

    // 准备更新数据
    const updateData: Record<string, boolean | string> = {
      [dbColumn]: value,
      user_id: "nzmarie", // 直接使用固定用户ID
    };

    console.log("Upsert data:", updateData);

    // 更新功能切换
    const { error } = await supabase
      .from("feature_toggles")
      .upsert(updateData, {
        onConflict: "user_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Upsert error:", error);
      return NextResponse.json(
        { error: "Failed to update toggle" },
        { status: 500 }
      );
    }

    console.log("Toggle updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test PUT API error:", error);
    return NextResponse.json(
      { error: "Failed to update toggle" },
      { status: 500 }
    );
  }
}
