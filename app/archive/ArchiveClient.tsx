"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/lib/stores/languageStore';
import { getLocalizedPath } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import type { Post } from '@/lib/types';

interface ArchiveClientProps {
  initialPosts: Record<string, Post[]>;
}

export default function ArchiveClient({ initialPosts }: ArchiveClientProps) {
  const { language } = useLanguageStore();
  const [postsByYear, setPostsByYear] = useState(initialPosts);
  const prevLanguageRef = useRef<string | null>(null);

  useEffect(() => {
    const languageChanged = prevLanguageRef.current !== null && prevLanguageRef.current !== language;

    if (languageChanged) {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/posts/published?language=${language}`);
          if (res.ok) {
            const allPosts: Post[] = await res.json();

            // Group posts by year
            const grouped = allPosts.reduce((acc, post) => {
              const year = post.publishedAt
                ? new Date(post.publishedAt).getFullYear().toString()
                : new Date(post.createdAt).getFullYear().toString();

              if (!acc[year]) {
                acc[year] = [];
              }
              acc[year].push(post);
              return acc;
            }, {} as Record<string, Post[]>);

            setPostsByYear(grouped);
          }
        } catch (error) {
          console.error("Failed to fetch archive posts:", error);
        }
      };

      fetchPosts();
    }

    prevLanguageRef.current = language;
  }, [language]);

  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      <Navbar />
      <div className="w-full px-6 py-12 mx-auto max-w-[1200px] pt-20">
        <div className="flex flex-col md:flex-row gap-12 md:justify-center">
          <div className="md:flex-[7] w-full max-w-[900px]">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                {language === 'en' ? 'Archive' : '归档'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {language === 'en'
                  ? `All posts organized by year and date. (${Object.values(postsByYear).flat().length} posts)`
                  : `按年份和日期组织的所有文章。(${Object.values(postsByYear).flat().length}篇文章)`
                }
              </p>
            </div>

            <div className="space-y-12">
              {sortedYears.map((year) => (
                <div key={year} className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    {year}
                  </h2>
                  <div className="space-y-3">
                    {postsByYear[year]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((post) => {
                        const date = new Date(post.createdAt);
                        const dateStr = language === 'zh'
                          ? `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
                          : `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

                        return (
                          <div key={post.id} className="flex items-start gap-4 py-2 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                            <span className="text-gray-500 dark:text-gray-400 font-mono text-sm min-w-[60px]">
                              {dateStr} —
                            </span>
                            <Link
                              href={getLocalizedPath(`/blog/${post.slug}`, language)}
                              className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1"
                            >
                              <span className="text-lg font-semibold">{post.title}</span>
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </>
  );
}
