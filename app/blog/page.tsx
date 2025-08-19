import Container from "@/components/Container";
import { getBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Heading, Flex, Text, Separator } from "@radix-ui/themes";
import Tag from "@/components/Tag";
import { format } from "date-fns";
import Markdown from "@/lib/markdown";

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getBySlug(params.slug);
  if (!post || post.status === "draft") return notFound();

  return (
    <Container>
      <Heading size="8" mb="2">
        {post.title}
      </Heading>
      <Flex align="center" gap="3" mb="3">
        <Text color="gray">
          {format(new Date(post.publishedAt ?? post.updatedAt), "yyyy-MM-dd")}
        </Text>
        <Separator orientation="vertical" />
        <Flex gap="2" wrap="wrap">
          {post.tags.map((t) => (
            <Tag key={t} name={t} />
          ))}
        </Flex>
      </Flex>
      <Markdown content={post.content} />
    </Container>
  );
}
