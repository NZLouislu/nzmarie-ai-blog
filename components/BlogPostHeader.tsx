"use client";

interface BlogPostHeaderProps {
  title: string;
  date: string;
  tags: string[];
  language: string;
  onLanguageSwitch: (lang: string) => void;
}

export function BlogPostHeader({
  title,
  date,
  tags,
  language,
  onLanguageSwitch,
}: BlogPostHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <time dateTime={date}>
          {new Date(date).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>

        {tags && tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onLanguageSwitch(language === 'zh' ? 'en' : 'zh')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          {language === 'zh' ? 'EN' : '中文'}
        </button>
      </div>
    </header>
  );
}
