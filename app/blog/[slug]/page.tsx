import React from 'react';
import { notFound } from 'next/navigation';
import { mockPosts } from '@/lib/mock/posts';
import Image from 'next/image';
import { Box, Text, Avatar } from '@radix-ui/themes';
import Markdown from '@/lib/markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = mockPosts.find(p => p.slug === slug);

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
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 max-w-[700px]">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={post.author.avatar}
                    fallback={post.author.name[0]}
                    radius="full"
                    className="w-8 h-8"
                  />
                  <span className="font-medium">{post.author.name}</span>
                </div>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <Markdown content={post.content} />
            </div>
          </div>

          {/* Table of Contents */}
          <div className="w-full lg:w-[300px]">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                <a href="#why-nextjs-15" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Why Next.js 15?
                </a>
                <a href="#getting-started" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Getting Started
                </a>
                <a href="#project-structure" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Project Structure
                </a>
                <a href="#key-features" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Key Features
                </a>
                <a href="#conclusion" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Conclusion
                </a>
              </nav>
            </div>
          </div>
        </div>
      </Box>
      <Footer />
    </>
  );
}
