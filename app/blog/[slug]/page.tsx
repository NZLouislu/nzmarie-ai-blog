import React from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { Post } from "@/lib/types";
import BlogPostClient from "./BlogPostClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  const h = await headers();
  // Get language from x-locale header set by middleware
  // For Chinese paths like /cn/blog/slug, middleware sets x-locale to 'zh'
  const lang = h.get("x-locale") || "en";

  try {
    const { getPostBySlug } = await import("@/lib/posts");
    const post = getPostBySlug(slug, lang as "en" | "zh");

    // Debug logs
    console.log("=== Blog Post Debug Info ===");
    console.log("Slug:", slug);
    console.log("Language:", lang);
    console.log("Post found:", !!post);
    if (post) {
      console.log("Post status:", post.status);
      console.log("Post language:", post.language);
    }

    // Check if user is admin to allow viewing drafts
    // Use cookies() to read httpOnly cookies set by the login API
    const cookieStore = await cookies();
    const adminAuthCookie = cookieStore.get("adminAuthenticated");
    const isAdmin = adminAuthCookie?.value === "true";

    // If post doesn't exist, return 404
    if (!post) {
      notFound();
    }

    // If user is not admin and post is not published, return 404
    // if (post.status !== "published" && !isAdmin) {
    //   notFound();
    // }

    console.log("Rendering post:", post.title);
    // Map the post data to include the date field required by BlogPostClient
    const postWithDate = {
      ...post,
      date: post.publishedAt || post.createdAt,
      author: post.author || "Unknown Author",
    };
    return <BlogPostClient post={postWithDate} />;
  } catch (error) {
    console.error("Failed to get post:", error);
  }

  console.log("Fallback 404");
  notFound();
}

export async function generateStaticParams() {
  try {
    const { listPublished } = await import("@/lib/posts");
    // 为所有语言生成静态路径
    const enPosts = listPublished("en");
    const zhPosts = listPublished("zh");
    const posts = [...enPosts, ...zhPosts];
    return posts.map((post: Post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to get posts:", error);
  }

  return [];
}
