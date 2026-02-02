"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { getLocalizedPath } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/cn/, "");

  const linkCls = (isActive: boolean) =>
    `relative pb-1 text-sm md:text-base font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive
      ? "text-indigo-600 dark:text-indigo-400 font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-indigo-600 dark:after:bg-indigo-400 after:animate-underline"
      : "text-gray-700 dark:text-gray-300"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-[1200px] items-center px-6 py-3">
          <Link
            href={getLocalizedPath("/", language)}
            className="flex items-center flex-shrink-0"
          >
            <Image
              src="/images/nzmarie-logo.png"
              alt="NZMarie logo — Marie Nian"
              width={100}
              height={30}
              priority
              className="w-auto h-[32px] object-contain"
            />
          </Link>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <NavigationMenu.Root className="hidden md:flex">
              <NavigationMenu.List className="flex gap-6">
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/", language)}
                    className={linkCls(normalizedPath === "/")}
                  >
                    {language === "en" ? "All Posts" : "所有文章"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/blog/category/selling", language)}
                    className={linkCls(
                      normalizedPath.startsWith("/blog/category/selling")
                    )}
                  >
                    {language === "en" ? "Selling" : "卖房"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/archive", language)}
                    className={linkCls(normalizedPath.startsWith("/archive"))}
                  >
                    {language === "en" ? "Archive" : "归档"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <a
                    href="https://nzmarie.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {language === "en" ? "About me" : "关于我"}
                  </a>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/search", language)}
                    className={linkCls(normalizedPath.startsWith("/search"))}
                    title="Search"
                  >
                    <Search size={20} className="dark:text-gray-300" />
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <button
                    onClick={() => {
                      const newLang = language === "en" ? "zh" : "en";
                      let newPath = pathname;

                      if (newLang === "zh") {
                        if (!pathname.startsWith("/cn")) {
                          newPath = `/cn${pathname === "/" ? "" : pathname}`;
                        }
                      } else {
                        if (pathname.startsWith("/cn")) {
                          newPath = pathname.replace(/^\/cn/, "") || "/";
                        }
                      }

                      setLanguage(newLang);
                      router.push(newPath);
                    }}
                    className="px-3 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 transition-colors"
                  >
                    {language === "en" ? "中文" : "English"}
                  </button>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
            <NavigationMenu.Root>
              <NavigationMenu.List className="flex flex-col gap-4 p-4">
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/", language)}
                    className={linkCls(normalizedPath === "/")}
                    onClick={() => setOpen(false)}
                  >
                    {language === "en" ? "All Posts" : "所有文章"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/blog/category/buying", language)}
                    className={linkCls(
                      normalizedPath.startsWith("/blog/category/buying")
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {language === "en" ? "Buying" : "买房"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/blog/category/selling", language)}
                    className={linkCls(
                      normalizedPath.startsWith("/blog/category/selling")
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {language === "en" ? "Selling" : "卖房"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/archive", language)}
                    className={linkCls(normalizedPath.startsWith("/archive"))}
                    onClick={() => setOpen(false)}
                  >
                    {language === "en" ? "Archive" : "归档"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <a
                    href="https://nzmarie.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    onClick={() => setOpen(false)}
                  >
                    {language === "en" ? "About me" : "关于我"}
                  </a>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href={getLocalizedPath("/search", language)}
                    className={linkCls(normalizedPath === "/search")}
                    onClick={() => setOpen(false)}
                  >
                    {language === "en" ? "Search" : "搜索"}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <button
                    onClick={() => {
                      const newLang = language === "en" ? "zh" : "en";
                      let newPath = pathname;

                      if (newLang === "zh") {
                        if (!pathname.startsWith("/cn")) {
                          newPath = `/cn${pathname === "/" ? "" : pathname}`;
                        }
                      } else {
                        if (pathname.startsWith("/cn")) {
                          newPath = pathname.replace(/^\/cn/, "") || "/";
                        }
                      }

                      setLanguage(newLang);
                      router.push(newPath || "/");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {language === "en" ? "中文" : "English"}
                  </button>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        )}
      </nav>
    </>
  );
}
