"use client";

import { useState, useEffect, RefObject } from "react";

export function useReadingProgress(contentRef: RefObject<HTMLElement>) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const windowScrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (totalHeight) {
        const progress = Math.round((windowScrollTop / totalHeight) * 100);
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateReadingProgress);
    };

    window.addEventListener("scroll", handleScroll);
    updateReadingProgress();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentRef]);

  return { readingProgress };
}
