import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeatureToggles {
  totalViews: boolean;
  totalLikes: boolean;
  totalComments: boolean;
  aiSummaries: boolean;
  aiQuestions: boolean;
}

interface TogglesState {
  toggles: FeatureToggles;
  isLoading: boolean;
  error: string | null;

  setToggle: (key: keyof FeatureToggles, value: boolean) => void;
  setToggles: (toggles: Partial<FeatureToggles>) => void;
  toggleFeature: (key: keyof FeatureToggles) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchToggles: () => Promise<void>;
  updateToggle: (key: keyof FeatureToggles, value: boolean) => Promise<void>;
}

export const useTogglesStore = create<TogglesState>()(
  persist(
    (set, get) => ({
      toggles: {
        totalViews: true,
        totalLikes: true,
        totalComments: true,
        aiSummaries: true,
        aiQuestions: true,
      },
      isLoading: false,
      error: null,

      setToggle: (key, value) =>
        set((state) => ({
          toggles: { ...state.toggles, [key]: value },
        })),

      setToggles: (newToggles) =>
        set((state) => ({
          toggles: { ...state.toggles, ...newToggles },
        })),

      toggleFeature: (key) =>
        set((state) => ({
          toggles: {
            ...state.toggles,
            [key]: !state.toggles[key],
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      fetchToggles: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/admin/toggles');
          if (response.ok) {
            const data = await response.json();
            set({ toggles: data });
          }
        } catch (error) {
          set({ error: 'Failed to fetch toggles' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateToggle: async (key, value) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/admin/toggles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [key]: value }),
          });
          if (response.ok) {
            get().setToggle(key, value);
          } else {
            set({ error: 'Failed to update toggle' });
          }
        } catch (error) {
          set({ error: 'Failed to update toggle' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'feature-toggles',
      partialize: (state) => ({ toggles: state.toggles }),
    }
  )
);