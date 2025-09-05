import { listPublished } from "@/lib/posts";
import Image from "next/image";
import Link from "next/link";
import { Card, Box, Text, Avatar } from "@radix-ui/themes";

export default function BlogList() {
  const posts = listPublished();

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="block">
          <Card className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white cursor-pointer">
            <Box className="relative w-full h-64">
              <Image
                src={post.image || "/images/posts/truck.jpg"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </Box>

            <Box className="p-6 space-y-4">
              <h3 className="text-2xl font-bold line-clamp-2">
                {post.title}
              </h3>
              <Text size="3" color="gray">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
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
  );
}
