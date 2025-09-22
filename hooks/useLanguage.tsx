"use client";

import { useLanguageStore } from "@/lib/stores/languageStore";

export function useLanguage() {
  const { language, setLanguage } = useLanguageStore();

  const switchLanguage = (newLanguage: 'en' | 'zh') => {
    setLanguage(newLanguage);
  };

  return {
    language,
    switchLanguage,
  };
}
