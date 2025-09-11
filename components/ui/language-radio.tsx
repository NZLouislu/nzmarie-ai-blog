interface LanguageRadioProps {
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

export default function LanguageRadio({
  currentLanguage,
  onLanguageChange,
  className = "",
}: LanguageRadioProps) {
  return (
    <div
      className={`inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 ${className}`}
    >
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => onLanguageChange(language.code)}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
            currentLanguage === language.code
              ? "bg-white text-indigo-700 shadow-sm border border-indigo-200 ring-1 ring-indigo-200"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <span className="text-base">{language.flag}</span>
          <span>{language.name}</span>
        </button>
      ))}
    </div>
  );
}
