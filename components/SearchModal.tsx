"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { getLocalizedPath } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
}

export default function SearchModal({
  isOpen,
  onClose,
  posts,
}: SearchModalProps) {
  const { language } = useLanguageStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filteredPosts = posts.filter(
      (post: Post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredPosts.slice(0, 10)); // Limit to 10 results
  }, [query, posts]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Search Posts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === "" ? (
            <div className="p-6 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Start typing to search posts...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No posts found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={getLocalizedPath(`/blog/${post.slug}`, language)}
                  onClick={onClose}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString(
                      language === "zh" ? "zh-CN" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
