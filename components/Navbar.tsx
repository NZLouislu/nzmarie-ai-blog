"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center w-[100px] h-[30px]">
              <Image
                src="/images/nzlouis-logo.png"
                alt="NZLouis logo — Louis Lu"
                width={100}
                height={30}
                priority
                className="w-[100px] h-[30px] object-contain"
              />
            </div>
          </Link>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <NavigationMenu.Root className="hidden md:flex">
            <NavigationMenu.List className="flex gap-6">
              <NavigationMenu.Item>
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  All Posts
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/backend"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Backend
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/frontend"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Frontend
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/life"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Life
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/tech"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Tech
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/archive"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Archive
                </Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

            <a
              href="https://nzlouis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              About me
            </a>
            <Link
              href="/search"
              className="flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
              title="Search"
            >
              <Search size={20} />
            </Link>
          </div>

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
                    href="/blog/category/backend"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Backend
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/frontend"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Frontend
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/life"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Life
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/tech"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Tech
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/archive"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    Archive
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
