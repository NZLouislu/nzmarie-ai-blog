"use client";

import * as Avatar from "@radix-ui/react-avatar";

export default function AboutMe() {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar.Root className="inline-flex h-[280px] w-[200px] select-none items-center justify-center overflow-hidden rounded-lg mb-4 bg-gray-200">
        <Avatar.Image
          className="h-full w-full object-cover"
          src="/images/authors/LouisLu.png"
          alt="NZLouis"
        />
        <Avatar.Fallback className="text-gray-600 flex items-center justify-center h-full w-full text-2xl">
          NZLouis
        </Avatar.Fallback>
      </Avatar.Root>

      <h2 className="text-xl font-semibold">Louis Lu</h2>
      <p className="text-gray-600 mt-2">
        Full-Stack, AI and ML Engineer, designer, and lifelong learner.
      </p>
    </div>
  );
}
