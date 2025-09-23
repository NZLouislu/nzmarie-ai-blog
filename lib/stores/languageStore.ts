import { create } from "zustand";

interface LanguageState {
  language: "en" | "zh";
  setLanguage: (language: "en" | "zh") => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (language) => {
    set({ language });
    if (typeof window !== "undefined") {
      document.cookie = `i18n_lang=${language}; path=/; max-age=${
        365 * 24 * 60 * 60
      }`;
    }
  },
}));
