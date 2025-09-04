"use client";

import { mockPosts } from "@/lib/mock/posts";
import Image from "next/image";
import Link from "next/link";
import { Card, Box, Text, Avatar } from "@radix-ui/themes";

export default function BlogList() {
  return (
    <div className="space-y-8">
      {mockPosts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="block">
          <Card className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white cursor-pointer">
            <Box className="relative w-full h-64">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </Box>

            <Box className="p-6 space-y-4">
              <Text size="6" weight="bold" className="line-clamp-2">
                {post.title}
              </Text>
              <Text size="3" color="gray">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text size="3" color="gray" className="line-clamp-3">
                {post.excerpt}
              </Text>

              <div className="pt-4">
                <div className="inline-flex items-center gap-2 whitespace-nowrap">
                  <Avatar
                    src={post.author.avatar}
                    fallback={post.author.name[0]}
                    radius="full"
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="text-sm">
                    {post.author.name}{" "}
                    <span className="text-gray-500">
                      • {post.readTime} min read
                    </span>
                  </span>
                </div>
              </div>
            </Box>
          </Card>
        </Link>
      ))}
    </div>
  );
}
