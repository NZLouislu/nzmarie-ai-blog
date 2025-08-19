import { mockPosts } from "@/lib/mock/posts";
import Image from "next/image";

export default function BlogList() {
  return (
    <div className="space-y-8">
      {mockPosts.map((post) => (
        <div
          key={post.id}
          className="flex gap-4 md:gap-6 border-b pb-6 items-start"
        >
          <div className="relative w-28 h-20 md:w-40 md:h-28 shrink-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 768px) 160px, 112px"
              className="object-cover rounded-lg"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base md:text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate">{post.author.name}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
