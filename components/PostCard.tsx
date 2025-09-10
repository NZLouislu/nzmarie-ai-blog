import Link from "next/link";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { getLocalizedPath } from "@/lib/utils";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import Tag from "./Tag";
import { format } from "date-fns";
import { PostMeta } from "@/lib/types";

export default function PostCard({ post }: { post: PostMeta }) {
  const { language } = useLanguageStore();
  return (
    <Card size="3" variant="surface">
      <Flex direction="column" gap="2">
        <Link href={getLocalizedPath(`/blog/${post.slug}`, language)}>
          <Heading size="5" weight="bold">{post.title}</Heading>
        </Link>
        <Text size="2" color="gray">
          {format(new Date(post.publishedAt ?? post.updatedAt), "yyyy-MM-dd")}
        </Text>
        <Text size="3">{post.excerpt}</Text>
        <Flex gap="2" wrap="wrap">
          {post.tags?.map((t) => (
            <Tag key={t} name={t} />
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
