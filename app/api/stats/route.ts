import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Ensure only one Prisma client instance is created
const prisma = new PrismaClient();

// GET /api/stats?postId={postId}&language={language}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId"); // This is actually the slug
    const language = searchParams.get("language") || "en";

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // First, try to find the post by slug to get the real database ID
    let realPostId = null;
    try {
      // Try to find the post in the database by slug
      const post = await prisma.post.findFirst({
        where: {
          slug: postId,
          language: language as "en" | "zh",
        },
      });

      if (post) {
        realPostId = post.id;
      } else {
        // If not found in database, return default stats
        return NextResponse.json({
          postId,
          title: "",
          views: 0,
          likes: 0,
          ai_questions: 0,
          ai_summaries: 0,
          language: language || "en",
        });
      }
    } catch (error) {
      console.error("Database error when finding post:", postId, error);
      // If database error, return default stats
      return NextResponse.json({
        postId,
        title: "",
        views: 0,
        likes: 0,
        ai_questions: 0,
        ai_summaries: 0,
        language: language || "en",
      });
    }

    // Get stats using the real database ID
    const stats = await prisma.postStat.findUnique({
      where: {
        post_id_language: {
          post_id: realPostId!,
          language: (language || "en") as "en" | "zh",
        },
      },
    });

    if (!stats) {
      // Return default stats if not found
      return NextResponse.json({
        postId,
        title: "",
        views: 0,
        likes: 0,
        ai_questions: 0,
        ai_summaries: 0,
        language: language || "en",
      });
    }

    return NextResponse.json({
      ...stats,
      ai_questions: stats.ai_questions || 0,
      ai_summaries: stats.ai_summaries || 0,
    });
  } catch (error) {
    console.error("Error in GET /api/stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  } finally {
    // Note: In Next.js API routes, it is not recommended to disconnect after each request
    // await prisma.$disconnect();
  }
}

// POST /api/stats (increment views)
export async function POST(request: NextRequest) {
  try {
    const { postId, language = "en", action } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // For now, we'll assume all users are non-admins to avoid the authentication issue
    // In a real application, you would check the user's role from the session/cookie
    const isAdmin = false;

    // First, try to find the post by slug to get the real database ID
    let realPostId = null;
    try {
      // Try to find the post in the database by slug
      const post = await prisma.post.findFirst({
        where: {
          slug: postId,
          language: language as "en" | "zh",
        },
      });

      if (post) {
        realPostId = post.id;
        console.log("Found post in database with ID:", realPostId);
      } else {
        // If not found in database, check if it exists as a markdown file
        console.log("Post not found in database, checking markdown files...");

        // We'll create a temporary post record for markdown-based posts
        const tempPost = await prisma.post.upsert({
          where: {
            authorId_slug: {
              authorId: "cmfstfjsu0000qygwl9cbsayd", // Default author ID
              slug: postId,
            },
          },
          update: {},
          create: {
            authorId: "cmfstfjsu0000qygwl9cbsayd", // Default author ID
            slug: postId,
            title: `Post: ${postId}`,
            content: "Content from markdown file",
            language: language as "en" | "zh",
            status: "published",
            tags: "auto-generated",
          },
        });

        realPostId = tempPost.id;
        console.log("Created temporary post record with ID:", realPostId);
      }
    } catch (error) {
      // If we can't find or create the post in the database, return an error
      console.error(
        "Database error when finding/creating post:",
        postId,
        error
      );
      return NextResponse.json(
        { error: "Database error when finding/creating post" },
        { status: 500 }
      );
    }

    // Make sure we have a valid post ID
    if (!realPostId) {
      console.error("No valid post ID found or created for slug:", postId);
      return NextResponse.json(
        { error: "No valid post ID found or created" },
        { status: 500 }
      );
    }

    // Increment views only if we have a valid post ID
    const updatedStats = await prisma.postStat.upsert({
      where: {
        post_id_language: {
          post_id: realPostId,
          language,
        },
      },
      update: {
        views: {
          increment: 1,
        },
      },
      create: {
        post_id: realPostId,
        title: `Post ${postId}`,
        views: 1,
        likes: 0,
        ai_questions: 0,
        ai_summaries: 0,
        language,
      },
    });

    // Also update daily stats
    // First, ensure the user exists
    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          id: "nzmarie",
        },
      });

      if (!user) {
        // Generate a unique email to avoid constraint violations
        const email = `nzmarie-${Date.now()}@example.com`;
        user = await prisma.user.create({
          data: {
            id: "nzmarie",
            email: email,
            name: "NZ Marie",
            role: "user",
            languagePreferences: "both",
          },
        });
      }
    } catch (userError) {
      console.error("Error ensuring user exists:", userError);
      // If we can't create the user, we'll skip daily stats update
      return NextResponse.json(updatedStats);
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
    await prisma.dailyStat.upsert({
      where: {
        userId_date_language: {
          userId: user.id,
          date: today,
          language,
        },
      },
      update: {
        pageViews: {
          increment: 1,
        },
        uniqueVisitors: isAdmin
          ? undefined
          : {
              increment: 1,
            },
      },
      create: {
        userId: user.id,
        date: today,
        pageViews: 1,
        uniqueVisitors: isAdmin ? 0 : 1,
        reads: 0,
        likes: 0,
        comments: 0,
        language,
      },
    });

    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error("Error in POST /api/stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  } finally {
    // Note: In Next.js API routes, it is not recommended to disconnect after each request
    // await prisma.$disconnect();
  }
}

// PUT /api/stats/like (increment likes)
export async function PUT(request: NextRequest) {
  try {
    const { postId, language = "en" } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // First, try to find the post by slug to get the real database ID
    let realPostId = null;
    try {
      // Try to find the post in the database by slug
      const post = await prisma.post.findFirst({
        where: {
          slug: postId,
          language: language as "en" | "zh",
        },
      });

      if (post) {
        realPostId = post.id;
        console.log("Found post in database with ID:", realPostId);
      } else {
        // If not found in database, check if it exists as a markdown file
        console.log("Post not found in database, checking markdown files...");

        // We'll create a temporary post record for markdown-based posts
        const tempPost = await prisma.post.upsert({
          where: {
            authorId_slug: {
              authorId: "cmfstfjsu0000qygwl9cbsayd", // Default author ID
              slug: postId,
            },
          },
          update: {},
          create: {
            authorId: "cmfstfjsu0000qygwl9cbsayd", // Default author ID
            slug: postId,
            title: `Post: ${postId}`,
            content: "Content from markdown file",
            language: language as "en" | "zh",
            status: "published",
            tags: "auto-generated",
          },
        });

        realPostId = tempPost.id;
        console.log("Created temporary post record with ID:", realPostId);
      }
    } catch (error) {
      // If we can't find or create the post in the database, return an error
      console.error(
        "Database error when finding/creating post:",
        postId,
        error
      );
      return NextResponse.json(
        { error: "Database error when finding/creating post" },
        { status: 500 }
      );
    }

    // Make sure we have a valid post ID
    if (!realPostId) {
      console.error("No valid post ID found or created for slug:", postId);
      return NextResponse.json(
        { error: "No valid post ID found or created" },
        { status: 500 }
      );
    }

    // Increment likes only if we have a valid post ID
    const updatedStats = await prisma.postStat.upsert({
      where: {
        post_id_language: {
          post_id: realPostId,
          language,
        },
      },
      update: {
        likes: {
          increment: 1,
        },
      },
      create: {
        post_id: realPostId,
        title: `Post ${postId}`,
        views: 0,
        likes: 1,
        ai_questions: 0,
        ai_summaries: 0,
        language,
      },
    });

    // Also update daily stats
    // First, ensure the user exists
    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          id: "nzmarie",
        },
      });

      if (!user) {
        // Generate a unique email to avoid constraint violations
        const email = `nzmarie-${Date.now()}@example.com`;
        user = await prisma.user.create({
          data: {
            id: "nzmarie",
            email: email,
            name: "NZ Marie",
            role: "user",
            languagePreferences: "both",
          },
        });
      }
    } catch (userError) {
      console.error("Error ensuring user exists:", userError);
      // If we can't create the user, we'll skip daily stats update
      return NextResponse.json(updatedStats);
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
    await prisma.dailyStat.upsert({
      where: {
        userId_date_language: {
          userId: user.id,
          date: today,
          language,
        },
      },
      update: {
        likes: {
          increment: 1,
        },
      },
      create: {
        userId: user.id,
        date: today,
        pageViews: 0,
        uniqueVisitors: 0,
        reads: 0,
        likes: 1,
        comments: 0,
        language,
      },
    });

    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error("Error in PUT /api/stats/like:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  } finally {
    // Note: In Next.js API routes, it is not recommended to disconnect after each request
    // await prisma.$disconnect();
  }
}
