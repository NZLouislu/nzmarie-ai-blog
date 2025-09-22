"use client";

import Image from 'next/image';

interface BlogPostFooterProps {
  author: {
    name: string;
    avatar?: string;
  };
  copyright?: string;
}

export function BlogPostFooter({ author, copyright }: BlogPostFooterProps) {
  return (
    <footer className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <p className="font-medium text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-600">Author</p>
        </div>
      </div>

      {copyright && (
        <p className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} {copyright}
        </p>
      )}
    </footer>
  );
}
