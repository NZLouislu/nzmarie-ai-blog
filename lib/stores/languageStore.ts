import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'zh';
  setLanguage: (language: 'en' | 'zh') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isCn = pathname.startsWith('/cn');
      const cookie = document.cookie.split('; ').find(row => row.startsWith('i18n_lang='));
      const cookieLang = cookie ? cookie.split('=')[1] as 'en' | 'zh' : 'en';
      if (isCn && cookieLang === 'en') {
        document.cookie = `i18n_lang=zh; path=/; max-age=${365 * 24 * 60 * 60}`;
        return 'zh';
      } else if (!isCn && cookieLang === 'zh') {
        document.cookie = `i18n_lang=en; path=/; max-age=${365 * 24 * 60 * 60}`;
        return 'en';
      }
      return cookieLang;
    }
    return 'en';
  })(),
  setLanguage: (language) => {
    set({ language });
    if (typeof window !== 'undefined') {
      document.cookie = `i18n_lang=${language}; path=/; max-age=${365 * 24 * 60 * 60}`;
    }
  },
}));