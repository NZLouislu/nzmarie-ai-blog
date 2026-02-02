"use client";

import { useState, useEffect } from "react";
import AboutMe from "./AboutMe";
import { useTranslation } from "@/lib/i18n";

export default function Sidebar() {
  const { t, language } = useTranslation();
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const data = await response.json();
          setAllTags(data);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="md:flex-[3] w-full md:sticky md:top-24 md:self-start space-y-8">
      <div className="hidden md:block">
        <AboutMe />
      </div>

      {allTags.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{t("featuredTags")}</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 20).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-100 text-sm rounded-full hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-all duration-200 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-transparent dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{t("friends")}</h3>
        <div className="space-y-3">
          <a
            href="https://blog.nzlouis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 rounded-lg hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900 dark:hover:to-rose-900 transition-all duration-200 border border-pink-200 dark:border-pink-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {language === "zh" ? "NZLouis 个人博客" : "NZLouis' Blog"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("friendsDescription")}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
