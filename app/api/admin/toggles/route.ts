import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("feature_toggles")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching toggles:", error);
      return NextResponse.json(
        { error: "Failed to fetch toggles" },
        { status: 500 }
      );
    }

    // Default toggles if none exist
    const defaultToggles = {
      total_views: true,
      total_likes: true,
      total_comments: true,
      ai_summaries: true,
      ai_questions: true,
      home_statistics: true,
    };

    if (!data) {
      // Create default toggles
      const { error: createError } = await supabase
        .from("feature_toggles")
        .insert(defaultToggles);

      if (createError) {
        console.error("Error creating default toggles:", createError);
        console.error("Error code:", createError.code);
        console.error("Error message:", createError.message);
        console.error("Error details:", createError.details);
        console.error("Error hint:", createError.hint);
      }

      return NextResponse.json({
        totalViews: defaultToggles.total_views,
        totalLikes: defaultToggles.total_likes,
        totalComments: defaultToggles.total_comments,
        aiSummaries: defaultToggles.ai_summaries,
        aiQuestions: defaultToggles.ai_questions,
        homeStatistics: defaultToggles.home_statistics,
      });
    }

    return NextResponse.json({
      totalViews: data.total_views,
      totalLikes: data.total_likes,
      totalComments: data.total_comments,
      aiSummaries: data.ai_summaries,
      aiQuestions: data.ai_questions,
      homeStatistics: data.home_statistics,
    });
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
    let updateData: { [key: string]: boolean } = {};

    if ("feature" in body && "enabled" in body) {
      // Old format
      const { feature, enabled } = body;
      if (!feature || typeof enabled !== "boolean") {
        return NextResponse.json(
          { error: "Feature and enabled status are required" },
          { status: 400 }
        );
      }
      updateData[feature] = enabled;
    } else {
      // New format - direct key-value pairs
      updateData = body;
    }

    // Map frontend feature names to database column names
    const columnMap: { [key: string]: string } = {
      totalViews: "total_views",
      totalLikes: "total_likes",
      totalComments: "total_comments",
      aiSummaries: "ai_summaries",
      aiQuestions: "ai_questions",
      homeStatistics: "home_statistics",
    };

    // Convert all feature names to column names
    const dbUpdates: { [key: string]: boolean } = {};
    for (const [feature, enabled] of Object.entries(updateData)) {
      const columnName = columnMap[feature];
      if (!columnName) {
        return NextResponse.json(
          { error: `Invalid feature: ${feature}` },
          { status: 400 }
        );
      }
      if (typeof enabled !== "boolean") {
        return NextResponse.json(
          { error: `Invalid value for ${feature}` },
          { status: 400 }
        );
      }
      dbUpdates[columnName] = enabled;
    }

    // Check if toggles exist
    const { data: existing } = await supabase
      .from("feature_toggles")
      .select("*")
      .single();

    if (!existing) {
      // Create new toggles record
      const defaultToggles = {
        total_views: true,
        total_likes: true,
        total_comments: true,
        ai_summaries: true,
        ai_questions: true,
        home_statistics: true,
        ...dbUpdates,
      };

      const { error } = await supabase
        .from("feature_toggles")
        .insert(defaultToggles);

      if (error) {
        console.error("Error creating toggles:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        return NextResponse.json(
          { error: "Failed to update toggle" },
          { status: 500 }
        );
      }
    } else {
      // Update existing toggles
      const { error } = await supabase
        .from("feature_toggles")
        .update(dbUpdates)
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating toggle:", error);
        return NextResponse.json(
          { error: "Failed to update toggle" },
          { status: 500 }
        );
      }
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
