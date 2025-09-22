"use client";

import * as Avatar from "@radix-ui/react-avatar";

export default function AvatarSidebar() {
  return (
    <aside className="sticky top-20 flex flex-col items-center gap-4 rounded-xl border bg-white p-6 shadow-sm">
      <Avatar.Root className="inline-flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full border">
        <Avatar.Image
          className="h-full w-full object-cover"
          src="/avatar.jpg"
          alt="NZMarie"
        />
        <Avatar.Fallback className="text-xl font-semibold bg-gray-200 text-gray-600">
          NZ
        </Avatar.Fallback>
      </Avatar.Root>
      <h2 className="text-lg font-semibold">NZMarie</h2>
      <p className="text-sm text-gray-600 text-center">
        Software engineer and lifelong learner, sharing code and thoughts.
      </p>
    </aside>
  );
}
