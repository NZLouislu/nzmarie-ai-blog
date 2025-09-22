"use client";

import { forwardRef } from "react";
import Markdown from "@/lib/markdown";

interface BlogPostContentProps {
  content: string;
}

export const BlogPostContent = forwardRef<HTMLDivElement, BlogPostContentProps>(
  ({ content }, ref) => {
    return (
      <div
        ref={ref}
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
      >
        {content ? <Markdown content={content} /> : <p>No content available</p>}
      </div>
    );
  }
);

BlogPostContent.displayName = "BlogPostContent";
