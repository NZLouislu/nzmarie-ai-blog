"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Box, Avatar } from '@radix-ui/themes';
import Markdown from '@/lib/markdown';
import TableOfContents from '@/components/TableOfContents';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Post } from '@/lib/types';

interface BlogPostClientProps {
  post: Post;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [summary, setSummary] = useState(post?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const originalSummary = post?.description || '';

  const generateAISummary = async (content: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      } else {
        setSummary(originalSummary);
        setError('Generation failed, please try again later');
      }
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setSummary(originalSummary);
      setError('Generation failed, please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <Box className="w-full px-6 py-12 mx-auto max-w-[1200px] pt-20">
        {/* Hero Image */}
        <div className="relative w-full h-96 mb-12 rounded-3xl overflow-hidden">
          <Image
            src={post.image || "/images/posts/truck.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Main Content */}
          <div className="flex-1 max-w-full lg:max-w-[900px]">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">{post.title}</h1>
              {post.subtitle && (
                <h2 className="text-lg lg:text-xl text-gray-600 mb-4 italic">{post.subtitle}</h2>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-4 lg:mb-6">
                <div className="flex items-center gap-2">
                  <Avatar
                    src="/images/authors/l.ico"
                    fallback={(post.author || "L")[0]}
                    radius="full"
                    className="w-8 h-8"
                  />
                  <span className="font-medium">{post.author || "Louis Lu"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6 lg:mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg border border-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <svg className={`w-5 h-5 ${isLoading ? 'text-blue-200 animate-pulse' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <button
                    onClick={() => generateAISummary(post.content)}
                    disabled={isLoading}
                    className="text-sm font-semibold text-white hover:text-blue-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Generating...' : 'AI Summary'}
                  </button>
                </div>
              </div>
              {error && (
                <div className="mb-2 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-300 shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              <div id="summary-content" className="p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 min-h-[80px] flex items-center shadow-sm">
                {isLoading ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-blue-700 font-medium">Generating Summary, please wait...</span>
                  </div>
                ) : (
                  <p className="text-base lg:text-lg text-gray-700 leading-relaxed w-full">{summary}</p>
                )}
              </div>
            </div>

            <div className="prose prose-base lg:prose-lg max-w-none">
              <Markdown content={post.content} />
            </div>
          </div>

          {/* Table of Contents - Hidden on mobile, shown on lg screens */}
          <div className="hidden lg:block w-full lg:w-[300px] lg:sticky lg:top-24 lg:self-start">
            <TableOfContents content={post.content} />
          </div>
        </div>
      </Box>
      <Footer />
    </>
  );
}