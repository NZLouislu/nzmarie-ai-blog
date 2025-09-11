import { useState } from "react";

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

const languages = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "zh",
    name: "中文",
    flag: "🇨🇳",
  },
];

export default function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  className = "",
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-lg bg-white shadow-lg border border-gray-200">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                    currentLanguage === language.code
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className="flex-1 text-left">{language.name}</span>
                  {currentLanguage === language.code && (
                    <svg
                      className="h-4 w-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
