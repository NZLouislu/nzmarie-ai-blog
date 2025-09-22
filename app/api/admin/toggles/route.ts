import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get feature toggles (single user design)
    const { data: toggles, error } = await supabase
      .from("feature_toggles")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Toggles error:", error);
      // If no toggles exist, return default values
      return NextResponse.json({
        totalViews: true,
        totalLikes: true,
        totalComments: true,
        aiSummaries: true,
        aiQuestions: true,
        homeStatistics: true,
      });
    }

    // Convert to the expected format
    const result = {
      totalViews: toggles.total_views,
      totalLikes: toggles.total_likes,
      totalComments: toggles.total_comments,
      aiSummaries: toggles.ai_summaries,
      aiQuestions: toggles.ai_questions,
      homeStatistics: toggles.home_statistics,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Toggles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch toggles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle both old format (feature, enabled) and new format (direct key-value pairs)
    const updateData: { [key: string]: boolean } = {};

    if ("feature" in body && "enabled" in body) {
      // Old format
      const { feature, enabled } = body;
      if (!feature || typeof enabled !== "boolean") {
        return NextResponse.json(
          { error: "Feature and enabled status are required" },
          { status: 400 }
        );
      }

      // Map old format to new format
      switch (feature) {
        case "totalViews":
          updateData.total_views = enabled;
          break;
        case "totalLikes":
          updateData.total_likes = enabled;
          break;
        case "totalComments":
          updateData.total_comments = enabled;
          break;
        case "aiSummaries":
          updateData.ai_summaries = enabled;
          break;
        case "aiQuestions":
          updateData.ai_questions = enabled;
          break;
        case "homeStatistics":
          updateData.home_statistics = enabled;
          break;
        default:
          return NextResponse.json(
            { error: `Invalid feature: ${feature}` },
            { status: 400 }
          );
      }
    } else {
      // New format - map frontend feature names to database columns
      if ("totalViews" in body) updateData.total_views = body.totalViews;
      if ("totalLikes" in body) updateData.total_likes = body.totalLikes;
      if ("totalComments" in body)
        updateData.total_comments = body.totalComments;
      if ("aiSummaries" in body) updateData.ai_summaries = body.aiSummaries;
      if ("aiQuestions" in body) updateData.ai_questions = body.aiQuestions;
      if ("homeStatistics" in body)
        updateData.home_statistics = body.homeStatistics;
    }

    // Validate that we have at least one field to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid toggle data provided" },
        { status: 400 }
      );
    }

    // Since this is a single-user design, we'll upsert the first (and only) row
    const { error } = await supabase
      .from("feature_toggles")
      .upsert(updateData, {
        onConflict: "id",
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggles API error:", error);
    return NextResponse.json(
      { error: "Failed to update toggle" },
      { status: 500 }
    );
  }
}
