"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  TextArea,
  TextField,
  Separator,
  Text,
} from "@radix-ui/themes";
import Markdown from "@/lib/markdown";
import Container from "@/components/Container";
import { listPublished } from "@/lib/posts";
import { nanoid } from "nanoid/non-secure";

type Draft = {
  title: string;
  slug: string;
  tags: string;
  content: string;
  excerpt: string;
};

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[\s\/]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");

export default function EditorPage() {
  const [posts, setPosts] = useState(listPublished());
  const [draft, setDraft] = useState<Draft>({
    title: "Untitled",
    slug: "untitled",
    tags: "draft",
    content: "# New Post\n\nWrite your Markdown content here…",
    excerpt: "Post excerpt…",
  });

  const tagArray = useMemo(
    () =>
      draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [draft.tags]
  );

  function handlePublish() {
    const newPost = {
      id: nanoid(),
      slug: draft.slug || toSlug(draft.title),
      title: draft.title,
      excerpt: draft.excerpt,
      tags: tagArray,
      categories: ["blog"],
      status: "published" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      content: draft.content,
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    alert("Published (demo in-memory save). You can see it on the homepage.");
  }

  return (
    <Container>
      <Heading size="7" mb="4">
        Editor
      </Heading>
      <Flex direction={{ initial: "column", md: "row" }} gap="4">
        <Box style={{ flex: 1 }}>
          <Flex direction="column" gap="3">
            <TextField.Root
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  title: e.target.value,
                  slug: toSlug(e.target.value),
                }))
              }
              placeholder="Title"
            />
            <TextField.Root
              value={draft.slug}
              onChange={(e) =>
                setDraft((d) => ({ ...d, slug: toSlug(e.target.value) }))
              }
              placeholder="Slug"
            />
            <TextField.Root
              value={draft.excerpt}
              onChange={(e) =>
                setDraft((d) => ({ ...d, excerpt: e.target.value }))
              }
              placeholder="Excerpt"
            />
            <TextField.Root
              value={draft.tags}
              onChange={(e) =>
                setDraft((d) => ({ ...d, tags: e.target.value }))
              }
              placeholder="Tags (comma separated)"
            />
            <Text as="label" size="2" color="gray">
              Content (Markdown)
            </Text>
            <TextArea
              rows={18}
              value={draft.content}
              onChange={(e) =>
                setDraft((d) => ({ ...d, content: e.target.value }))
              }
            />
            <Flex gap="3">
              <Button onClick={handlePublish}>Publish</Button>
              <Button
                variant="soft"
                onClick={() =>
                  alert("Save as draft: implement after DB connection")
                }
              >
                Save as Draft
              </Button>
            </Flex>
          </Flex>
        </Box>

        <Separator orientation="vertical" style={{ minHeight: 400 }} />

        <Box style={{ flex: 1 }}>
          <Heading size="5" mb="2">
            Preview
          </Heading>
          <Markdown content={draft.content} />
        </Box>
      </Flex>
    </Container>
  );
}
