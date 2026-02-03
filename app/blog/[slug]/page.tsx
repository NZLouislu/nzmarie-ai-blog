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

export const dynamic = "force-dynamic";

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  const h = await headers();
  const lang = h.get("x-locale") || "en";
  const searchParams = h.get("x-search-params") || "";
  const isDraftMode = searchParams.includes("draft=true");

  try {
    const { getPostBySlug, getDraftBySlug } = await import("@/lib/posts");

    let post;
    let isDraft = false;

    if (isDraftMode) {
      post = getDraftBySlug ? getDraftBySlug(slug, lang as "en" | "zh") : null;
      isDraft = true;

      if (post) {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("userSession");

        if (!sessionCookie?.value) {
          notFound();
        }

        try {
          const session = JSON.parse(sessionCookie.value);
          const isAuthorized = ["nzmarie", "admin"].includes(session.username) ||
            session.role === "admin";

          if (!isAuthorized || new Date(session.expiresAt) < new Date()) {
            notFound();
          }
        } catch {
          notFound();
        }
      }
    } else {
      post = getPostBySlug(slug, lang as "en" | "zh");
    }

    if (!post) {
      notFound();
    }

    const postWithDate = {
      ...post,
      date: post.publishedAt || post.createdAt,
      author: post.author || "Unknown Author",
      isDraft: isDraft,
      status: isDraft ? "draft" : (post.status || "published")
    };

    return <BlogPostClient post={postWithDate} isDraft={isDraft} />;
  } catch (error) {
    console.error("Failed to get post:", error);
    notFound();
  }
}
