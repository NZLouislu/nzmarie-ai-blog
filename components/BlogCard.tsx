"use client";

import * as Avatar from "@radix-ui/react-avatar";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  date: string;
  summary: string;
  slug: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

export default function BlogCard({
  title,
  date,
  summary,
  slug,
  image,
  author,
}: BlogCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="relative h-28 w-36 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 144px, 100vw"
          className="object-cover rounded-md"
          priority
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link href={`/posts/${slug}`} passHref>
            <a className="block">
              <h3 className="text-xl font-bold hover:underline">{title}</h3>
            </a>
          </Link>
          <p className="mt-1 text-sm text-gray-600">{summary}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Avatar.Root className="inline-flex h-5 w-5 select-none items-center justify-center overflow-hidden rounded-full border shrink-0">
            <Avatar.Image
              className="h-full w-full object-cover"
              src={author.avatar}
              alt={author.name}
            />
            <Avatar.Fallback className="text-xs bg-gray-200 text-gray-600">
              {author.name[0]}
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="text-sm text-gray-700">{author.name}</span>
          <span className="text-xs text-gray-400">· {date}</span>
        </div>
      </div>
    </div>
  );
}
