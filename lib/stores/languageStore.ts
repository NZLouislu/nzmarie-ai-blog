import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'zh';
  setLanguage: (language: 'en' | 'zh') => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));