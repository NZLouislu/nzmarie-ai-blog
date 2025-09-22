import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: {
        email: "nzmarie@example.com",
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 500 }
      );
    }

    // Get all feature toggles for the admin user
    const toggles = await prisma.featureToggle.findMany({
      where: {
        userId: adminUser.id,
      },
    });

    // Convert to the expected format
    const result: { [key: string]: boolean } = {
      totalViews: true,
      totalLikes: true,
      totalComments: true,
      aiSummaries: true,
      aiQuestions: true,
      homeStatistics: true,
    };

    // Override with actual values from database
    for (const toggle of toggles) {
      switch (toggle.key) {
        case "total_views":
          result.totalViews = toggle.enabled;
          break;
        case "total_likes":
          result.totalLikes = toggle.enabled;
          break;
        case "total_comments":
          result.totalComments = toggle.enabled;
          break;
        case "ai_summaries":
          result.aiSummaries = toggle.enabled;
          break;
        case "ai_questions":
          result.aiQuestions = toggle.enabled;
          break;
        case "home_statistics":
          result.homeStatistics = toggle.enabled;
          break;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Toggles API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch toggles" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: {
        email: "nzmarie@example.com",
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 500 }
      );
    }

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

    // Map frontend feature names to database keys
    const keyMap: { [key: string]: string } = {
      totalViews: "total_views",
      totalLikes: "total_likes",
      totalComments: "total_comments",
      aiSummaries: "ai_summaries",
      aiQuestions: "ai_questions",
      homeStatistics: "home_statistics",
    };

    // Update each toggle
    for (const [feature, enabled] of Object.entries(updateData)) {
      const dbKey = keyMap[feature];
      if (!dbKey) {
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

      // Upsert the toggle (create if not exists, update if exists)
      await prisma.featureToggle.upsert({
        where: {
          userId_key: {
            userId: adminUser.id,
            key: dbKey,
          },
        },
        update: {
          enabled: enabled,
        },
        create: {
          userId: adminUser.id,
          key: dbKey,
          enabled: enabled,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggles API error:", error);
    return NextResponse.json(
      { error: "Failed to update toggle" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
