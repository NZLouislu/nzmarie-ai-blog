"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full px-6 py-12">
      <div className="relative w-full mt-8 aspect-video rounded-3xl overflow-hidden">
        <Image
          src="/img/nzmarie-background1.png"
          alt="Banner"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
