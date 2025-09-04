"use client";

import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";

export default function AboutMe() {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar.Root className="inline-flex h-[280px] w-[200px] select-none items-center justify-center overflow-hidden rounded-2xl mb-6 bg-gray-200 relative">
        <Image
          src="/images/authors/LouisLu.png"
          alt="NZLouis"
          fill
          className="object-cover"
        />
        <Avatar.Fallback className="text-gray-600 flex items-center justify-center h-full w-full text-2xl">
          NZLouis
        </Avatar.Fallback>
      </Avatar.Root>

      <h2 className="text-2xl font-semibold">Louis Lu</h2>
      <p className="text-gray-600 text-lg mt-3">
        Full-Stack, AI and ML Engineer, designer, and lifelong learner.
      </p>
    </div>
  );
}
