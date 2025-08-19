"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "16 / 4" }}>
        <Image
          src="/images/duck-pack.jpg"
          alt="Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
