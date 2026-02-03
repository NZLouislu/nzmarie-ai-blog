"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { getLocalizedPath } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const normalizedPath = pathname.startsWith("/cn")
    ? pathname.replace(/^\/cn/, "") || "/"
    : pathname;

  const linkCls = (active: boolean) =>
    `text-sm md:text-base font-medium transition-colors ${active
      ? "text-indigo-600 dark:text-indigo-400"
      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
    }`;

  const toggleLanguage = (newLang: "en" | "zh") => {
    const cleanPath = pathname.startsWith("/cn")
      ? pathname.replace(/^\/cn/, "") || "/"
      : pathname;

    let newPath = cleanPath;
    if (newLang === "zh") {
      newPath = `/cn${cleanPath === "/" ? "" : cleanPath}`;
    }

    setLanguage(newLang);
    router.push(newPath || "/");
    setOpen(false);
  };

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
                    href={language === "zh" ? "https://www.nzmarie.com/cn" : "https://nzmarie.com"}
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
                    onClick={() => toggleLanguage(language === "en" ? "zh" : "en")}
                    className="px-3 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600 transition-colors"
                  >
                    {language === "en" ? "中文" : "English"}
                  </button>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 focus:outline-none"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 overflow-y-auto max-h-[calc(100vh-64px)]">
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
                    href={language === "zh" ? "https://www.nzmarie.com/cn" : "https://nzmarie.com"}
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
                    onClick={() => toggleLanguage(language === "en" ? "zh" : "en")}
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
