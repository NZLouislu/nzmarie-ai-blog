"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguageStore } from "@/lib/stores/languageStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();


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
                  {language === 'en' ? 'All Posts' : '所有文章'}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/backend"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? 'Backend' : '后端'}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/frontend"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? 'Frontend' : '前端'}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/life"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? 'Life' : '生活'}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/blog/category/tech"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? 'Tech' : '科技'}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/archive"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? 'Archive' : '归档'}
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <a
                  href="https://nzlouis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? 'About me' : '关于我'}
                </a>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link
                  href="/search"
                  className="flex items-center justify-center -mt-1 p-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
                  title="Search"
                >
                  <Search size={20} />
                </Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  {language === 'en' ? '中文' : 'English'}
                </button>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
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
                    {language === 'en' ? 'Home' : '首页'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/backend"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'Backend' : '后端'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/frontend"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'Frontend' : '前端'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/life"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'Life' : '生活'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/blog/category/tech"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'Tech' : '科技'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/archive"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'Archive' : '归档'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <a
                    href="https://nzlouis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'About me' : '关于我'}
                  </a>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <Link
                    href="/search"
                    className="block text-sm font-medium hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {language === 'en' ? 'Search' : '搜索'}
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <button
                    onClick={() => {
                      setLanguage(language === 'en' ? 'zh' : 'en');
                      setOpen(false);
                    }}
                    className="block text-sm font-medium hover:text-blue-600 text-left"
                  >
                    {language === 'en' ? '中文' : 'English'}
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
