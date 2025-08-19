"use client";

import { mockPosts } from "@/lib/mock/posts";
import Image from "next/image";
import { Card, Box, Text, Avatar } from "@radix-ui/themes";

export default function BlogList() {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <Card
          key={post.id}
          className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <Box className="relative w-full h-56">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </Box>

          <Box className="p-5 space-y-3">
            <Text size="5" weight="bold" className="line-clamp-2">
              {post.title}
            </Text>
            <Text size="2" color="gray">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Text size="2" color="gray" className="line-clamp-3">
              {post.excerpt}
            </Text>

            <div className="pt-3">
              <div className="inline-flex items-center gap-2 whitespace-nowrap">
                <Avatar
                  src={post.author.avatar}
                  fallback={post.author.name[0]}
                  radius="full"
                  className="w-4 h-4 shrink-0"
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
      ))}
    </div>
  );
}
