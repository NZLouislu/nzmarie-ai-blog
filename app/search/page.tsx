"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Box, Text, Avatar } from '@radix-ui/themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  image?: string;
  author?: string;
}

interface PostStats {
  views: number;
  likes: number;
  comments: number;
  ai_questions: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, PostStats>>({});
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }

  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setStatsMap({});
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);

        // Load stats for search results
        if (data.length > 0) {
          const statsPromises = data.map(async (post: Post) => {
            try {
              const statsResponse = await fetch(`/api/stats?postId=${post.id}`);
              if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                return { postId: post.id, stats: statsData };
              }
            } catch (error) {
              console.error('Failed to load stats for post:', post.id, error);
            }
            return { postId: post.id, stats: { views: 1, likes: 1, comments: 0, ai_questions: 1 } };
          });

          const statsResults = await Promise.all(statsPromises);
          const newStatsMap: Record<string, PostStats> = {};
          statsResults.forEach(({ postId, stats }) => {
            newStatsMap[postId] = stats;
          });
          setStatsMap(newStatsMap);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
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
        performSearch(value);
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
              <h1 className="text-4xl font-bold mb-4">Search</h1>
              <p className="text-xl text-gray-600 mb-8">
                Search for posts by title or content.
              </p>

              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative w-full max-w-2xl">
                  <input
                    type="text"
                    placeholder="Search posts..."
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
                <p className="mt-4 text-gray-600">Searching...</p>
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {results.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                      <Card className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white cursor-pointer h-full">
                        <Box className="relative w-full h-48">
                          <Image
                            src={post.image || "/images/posts/truck.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </Box>

                        <Box className="p-6 space-y-4 flex-1 flex flex-col">
                          <h3 className="text-2xl font-bold line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <Text size="4" color="gray" className="line-clamp-1 italic">
                              {post.excerpt}
                            </Text>
                          )}
                          <Text size="3" color="gray">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Text>
                          <Text size="3" color="gray" className="line-clamp-3 flex-1">
                            {post.excerpt}
                          </Text>

                          <div className="pt-4 flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 whitespace-nowrap">
                              <Avatar
                                src="/images/authors/l.ico"
                                fallback={(post.author || "L")[0]}
                                radius="full"
                                className="w-5 h-5 shrink-0"
                              />
                              <span className="text-sm">
                                {post.author || "Louis Lu"}{" "}
                                <span className="text-gray-500">
                                  • 5 min read
                                </span>
                              </span>
                            </div>
                            {statsMap[post.id] && (
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span>{statsMap[post.id].views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  <span>{statsMap[post.id].likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03 8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  <span>{statsMap[post.id].comments}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  <span>{statsMap[post.id].ai_questions}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Box>
                      </Card>
                    </Link>
                  ))}
                </div>
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
export const dynamic = 'force-dynamic';