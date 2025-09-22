"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
}

interface BlogPostNavigationProps {
  previousPost?: BlogPost;
  nextPost?: BlogPost;
}

export function BlogPostNavigation({ previousPost, nextPost }: BlogPostNavigationProps) {
  return (
    <nav className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <div className="flex-1">
        {previousPost && (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <p className="text-sm text-gray-500">Previous</p>
              <p className="font-medium">{previousPost.title}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center justify-end gap-2 text-blue-600 hover:text-blue-800 transition-colors group"
          >
            <div className="text-right">
              <p className="text-sm text-gray-500">Next</p>
              <p className="font-medium">{nextPost.title}</p>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </nav>
  );
}
