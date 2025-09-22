"use client";

import { create } from "zustand";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TocState {
  headings: Heading[];
  setHeadings: (headings: Heading[]) => void;
  activeHeading: string;
  setActiveHeading: (id: string) => void;
}

export const useTocStore = create<TocState>((set) => ({
  headings: [],
  setHeadings: (headings) => set({ headings }),
  activeHeading: "",
  setActiveHeading: (activeHeading) => set({ activeHeading }),
}));
