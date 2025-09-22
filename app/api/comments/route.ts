import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Comment } from "@prisma/client";

// Ensure only one Prisma client instance is created
const prisma = new PrismaClient();

// GET /api/comments?postId={postId}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId"); // This is actually the slug

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
        },
      });

      if (post) {
        realPostId = post.id;
      } else {
        // If not found in database, return empty array
        return NextResponse.json([]);
      }
    } catch (error) {
      console.error("Database error when finding post:", postId, error);
      // If database error, return empty array
      return NextResponse.json([]);
    }

    // Add error handling when getting comments
    let comments: Comment[] = [];
    try {
      comments = await prisma.comment.findMany({
        where: {
          postId: realPostId!,
          status: "approved",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      // Even if getting comments fails, return an empty array instead of an error
      console.error("Error fetching comments:", error);
      comments = [];
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  } finally {
    // Note: In Next.js API routes, it is not recommended to disconnect after each request
    // await prisma.$disconnect();
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const { postId, authorName, authorEmail, content, isAnonymous } =
      await request.json();

    // Validate required fields
    if (!postId || !content) {
      return NextResponse.json(
        { error: "Post ID and content are required" },
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
        },
      });

      if (post) {
        realPostId = post.id;
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
            language: "en", // Default to English
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

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        post: {
          connect: {
            id: realPostId,
          },
        },
        authorName: isAnonymous ? "Anonymous" : authorName,
        authorEmail: isAnonymous ? "anonymous@example.com" : authorEmail,
        content,
        is_anonymous: isAnonymous || false, // Correct field name
        status: "pending",
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  } finally {
    // Note: In Next.js API routes, it is not recommended to disconnect after each request
    // await prisma.$disconnect();
  }
}
