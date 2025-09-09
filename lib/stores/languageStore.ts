import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'zh';
  setLanguage: (language: 'en' | 'zh') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (() => {
    if (typeof window !== 'undefined') {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('i18n_lang='));
      return cookie ? cookie.split('=')[1] as 'en' | 'zh' : 'en';
    }
    return 'en';
  })(),
  setLanguage: (language) => set({ language }),
}));