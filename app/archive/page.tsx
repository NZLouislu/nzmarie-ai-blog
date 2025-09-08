"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { useLanguageStore } from '@/lib/stores/languageStore';
import { Post } from '@/lib/types';

export default function ArchivePage() {
  const { language } = useLanguageStore();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(`/api/posts/language?action=published&language=${language}`);
        if (response.ok) {
          const newPosts = await response.json();
          setPosts(newPosts);
        }
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    loadPosts();
  }, [language]);

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof posts>);

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

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
              <p className="text-xl text-gray-600">
                {language === 'en' ? 'All posts organized by year and date.' : '按年份和日期组织的所有文章。'}
              </p>
            </div>

            <div className="space-y-12">
              {sortedYears.map((year) => (
                <div key={year} className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    {year}
                  </h2>
                  <div className="space-y-3">
                    {postsByYear[year]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((post) => {
                        const date = new Date(post.createdAt);
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const dateStr = `${month}/${day}`;

                        return (
                          <div key={post.id} className="flex items-start gap-4 py-2 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                            <span className="text-gray-500 font-mono text-sm min-w-[60px]">
                              {dateStr} —
                            </span>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-gray-900 hover:text-blue-600 transition-colors flex-1"
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