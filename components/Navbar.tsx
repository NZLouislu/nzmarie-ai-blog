"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center">
            <div className="flex items-center w-[100px] h-[30px]">
              <Image
                src="/images/nzlouis-logo.png"
                alt="Nzlouis logo — Lu Louis"
                width={100}
                height={30}
                priority
                className="w-[100px] h-[30px] object-contain"
              />
            </div>
          </Link>

          <NavigationMenu.Root className="hidden md:flex">
            <NavigationMenu.List className="flex gap-6">
              <NavigationMenu.Item>
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/about"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t bg-white shadow-md">
            <NavigationMenu.Root>
              <NavigationMenu.List className="flex flex-col gap-4 p-4">
                <NavigationMenu.Item>
                  <Link
                    href="/"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Blog
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/about"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    About
                  </Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        )}
      </nav>
    </>
  );
}
