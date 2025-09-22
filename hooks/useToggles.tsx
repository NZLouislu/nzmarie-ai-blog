"use client";

import { useTogglesStore } from "@/lib/stores/togglesStore";

export function useToggles() {
  const { toggles } = useTogglesStore();

  return {
    featureToggles: toggles,
  };
}
