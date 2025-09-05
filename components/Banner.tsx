"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full px-6 py-12">
      <div className="relative w-full mt-5 h-96 rounded-3xl overflow-hidden">
        <Image
          src="/images/duck-pack.jpg"
          alt="Banner"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
