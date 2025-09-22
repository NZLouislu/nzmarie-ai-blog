"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useTogglesStore } from "@/lib/stores/togglesStore";
import BlogList from "@/components/BlogList";
import { Post } from "@/lib/types";

async function performSearch(
  searchQuery: string,
  setResults: React.Dispatch<React.SetStateAction<Post[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!searchQuery.trim()) {
    setResults([]);
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(
      `/api/posts/search?q=${encodeURIComponent(searchQuery)}`
    );
    if (response.ok) {
      const data = await response.json();
      setResults(data);

      // Load stats for search results
      // Remove the fetchPostStats call since it doesn't exist
    }
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    setLoading(false);
  }
}

function SearchContent() {
  const { language } = useLanguageStore();
  const { fetchToggles } = useTogglesStore();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, setResults, setLoading);
    }
  }, [initialQuery]);

  useEffect(() => {
    fetchToggles();
  }, [fetchToggles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, setResults, setLoading);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounce
    const timer = setTimeout(() => {
      if (value.trim()) {
        performSearch(value, setResults, setLoading);
      } else {
        setResults([]);
      }
    }, 300); // 300ms debounce

    setDebounceTimer(timer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <>
      <Navbar />
      <div className="w-full px-6 py-12 mx-auto max-w-[1200px] pt-20">
        <div className="flex flex-col md:flex-row gap-12 md:justify-center">
          <div className="md:flex-[7] w-full max-w-[900px]">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {language === "en" ? "Search" : "搜索"}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {language === "en"
                  ? "Search for posts by title or content."
                  : "按标题或内容搜索文章。"}
              </p>

              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative w-full max-w-2xl">
                  <input
                    type="text"
                    placeholder={
                      language === "en" ? "Search posts..." : "搜索文章..."
                    }
                    value={query}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">
                  {language === "en" ? "Searching..." : "搜索中..."}
                </p>
              </div>
            ) : query && results.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {language === "en" ? "No results found" : "未找到结果"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {language === "en"
                    ? "Try adjusting your search terms."
                    : "请尝试调整搜索词。"}
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}{" "}
                  for &quot;{query}&quot;
                </p>
                <BlogList posts={results} />
              </div>
            ) : null}
          </div>

          <Sidebar />
        </div>
      </div>
      <Footer />
    </>
  );
}

function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

export default SearchPage;
export const dynamic = "force-dynamic";
