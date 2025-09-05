import React from 'react';
import { notFound } from 'next/navigation';
import { getBySlug, listPublished } from '@/lib/posts';
import { Post } from '@/lib/types';
import Image from 'next/image';
import { Box, Avatar } from '@radix-ui/themes';
import Markdown from '@/lib/markdown';
import TableOfContents from '@/components/TableOfContents';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getBySlug(slug);

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

            {post.description && (
              <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">{post.description}</p>
              </div>
            )}

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

export async function generateStaticParams() {
  const posts = listPublished();

  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}
