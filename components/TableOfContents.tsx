"use client";

import { useEffect, useState } from "react";
import { useTocStore } from "@/lib/stores/tocStore";
import { extractHeadings } from "@/lib/toc";

interface TableOfContentsProps {
  content?: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const { headings, setHeadings } = useTocStore();
  const [visible, setVisible] = useState(false);

  // Extract headings from content when content changes
  useEffect(() => {
    if (content) {
      const extractedHeadings = extractHeadings(content);
      setHeadings(extractedHeadings);
    }
  }, [content, setHeadings]);

  // Toggle visibility on mobile
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Close TOC when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const toc = document.getElementById("table-of-contents");
      if (toc && !toc.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setVisible(false); // Close mobile TOC after clicking
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop TOC - Always visible on larger screens */}
      <div className="hidden lg:block sticky top-8">
        <div
          id="table-of-contents"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full"
        >
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Table of Contents
          </h3>
          <ul className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`text-left w-full px-2 py-1 rounded text-sm transition-colors ${
                    heading.level === 1
                      ? "font-semibold pl-2 text-gray-800 dark:text-gray-200"
                      : heading.level === 2
                      ? "pl-4 text-gray-600 dark:text-gray-400"
                      : "pl-6 text-gray-500 dark:text-gray-500"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile TOC Toggle */}
      <button
        className="fixed right-4 bottom-4 lg:hidden bg-blue-500 text-white p-3 rounded-full shadow-lg z-20"
        onClick={toggleVisibility}
        aria-label="Toggle table of contents"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Mobile TOC Panel */}
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Table of Contents
              </h3>
              <button
                onClick={toggleVisibility}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close table of contents"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`text-left w-full px-2 py-1 rounded text-sm transition-colors ${
                      heading.level === 1
                        ? "font-semibold pl-2 text-gray-800 dark:text-gray-200"
                        : heading.level === 2
                        ? "pl-4 text-gray-600 dark:text-gray-400"
                        : "pl-6 text-gray-500 dark:text-gray-500"
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
