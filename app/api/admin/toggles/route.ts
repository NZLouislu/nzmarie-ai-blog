import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { UserSession } from "@/lib/auth/session";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to get user ID from session
async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("userSession");

    if (!sessionCookie?.value) {
      return null;
    }

    const session: UserSession = JSON.parse(sessionCookie.value);

    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    // Return the actual user ID from the session
    return session.id;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}

export async function GET() {
  try {
    // Get user ID from session
    const sessionUserId = await getUserId();

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to get feature toggles for the session user ID first
    let { data: toggles, error } = await supabase
      .from("feature_toggles")
      .select("*")
      .eq("user_id", sessionUserId)
      .limit(1)
      .single();

    // If not found, try with the mapped user ID (fallback for existing data)
    if (error || !toggles) {
      // Map the session user ID to the database user ID for backward compatibility
      const userIdMap: Record<string, string> = {
        nzmarie: "user_nzmarie",
        admin: "user_admin",
        nzlouis: "user_nzlouis",
      };

      const dbUserId = userIdMap[sessionUserId] || sessionUserId;

      ({ data: toggles, error } = await supabase
        .from("feature_toggles")
        .select("*")
        .eq("user_id", dbUserId)
        .limit(1)
        .single());
    }

    if (error) {
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
      totalViews: toggles.total_views ?? true,
      totalLikes: toggles.total_likes ?? true,
      totalComments: toggles.total_comments ?? true,
      aiSummaries: toggles.ai_summaries ?? true,
      aiQuestions: toggles.ai_questions ?? true,
      homeStatistics: toggles.home_statistics ?? true,
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

export async function PUT(request: NextRequest) {
  try {
    const sessionUserId = await getUserId();

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Map frontend feature names to database columns
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

    // Prepare update data using the session user ID
    const updateData: Record<string, boolean | string> = {
      [dbColumn]: value,
      user_id: sessionUserId, // 使用会话中的实际用户ID
    };

    // Update or insert the toggle for the specific user
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggles API error:", error);
    return NextResponse.json(
      { error: "Failed to update toggle" },
      { status: 500 }
    );
  }
}
