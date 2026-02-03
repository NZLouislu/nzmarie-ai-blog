"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Post } from "@/lib/types";
import { useTogglesStore } from "@/lib/stores/togglesStore";
import { useLanguageStore } from "@/lib/stores/languageStore";
import BlogList from "@/components/BlogList";

export interface CategoryContentProps {
  category: string;
  posts: Post[];
  language: "en" | "zh";
}

export default function CategoryContent({
  category,
  posts,
}: CategoryContentProps) {
  const { fetchToggles } = useTogglesStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    fetchToggles();
  }, [fetchToggles]);

  const getCategoryDisplayName = () => {
    const categoryLower = category.toLowerCase();
    if (categoryLower === "selling" || category === "卖房") {
      return language === "zh" ? "卖房" : "Selling";
    }
    if (categoryLower === "buying" || category === "买房") {
      return language === "zh" ? "买房" : "Buying";
    }
    return category;
  };

  const displayCategory = getCategoryDisplayName();
  const titleText =
    language === "zh" ? `${displayCategory} 类别文章` : `${displayCategory} Category Posts`;
  const descriptionText =
    language === "zh"
      ? `发现 ${displayCategory} 类别的所有文章。`
      : `Discover all articles in the ${displayCategory} category.`;

  return (
    <>
      <Navbar />
      <div className="w-full px-6 py-12 mx-auto max-w-[1200px] pt-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 capitalize">{titleText}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{descriptionText}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:justify-center">
          <div className="md:flex-[7] w-full max-w-[900px]">
            <BlogList posts={posts} />
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </>
  );
}
