import React from 'react';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Box, Text, Avatar } from '@radix-ui/themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(decodeURIComponent(category));

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="w-full px-6 py-12 mx-auto max-w-[1200px] pt-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 capitalize">{category} Posts</h1>
          <p className="text-xl text-gray-600">
            Discover all articles in the {category} category.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:justify-center">
          <div className="md:flex-[7] w-full max-w-[900px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
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
                      {post.subtitle && (
                        <Text size="4" color="gray" className="line-clamp-1 italic">
                          {post.subtitle}
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

                      <div className="pt-4">
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
                      </div>
                    </Box>
                  </Card>
                </Link>
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

export async function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}