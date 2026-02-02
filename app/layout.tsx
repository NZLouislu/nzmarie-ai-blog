import "./globals.css";
import { ReactNode } from "react";
import { headers } from 'next/headers';
import LanguageHandler from "@/components/LanguageHandler";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const locale = h.get('x-locale') || 'en';
  const lang = locale === 'zh' ? 'zh-CN' : 'en';
  const host = h.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const alternatePath = locale === 'zh' ? '' : '/cn';
  const currentPath = locale === 'zh' ? '/cn' : '';

  return (
    <html lang={lang} className="scroll-smooth">
      <head>
        <link rel="alternate" hrefLang="en" href={`${baseUrl}${alternatePath}`} />
        <link rel="alternate" hrefLang="zh-CN" href={`${baseUrl}${currentPath}`} />
      </head>
      <body className="antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 min-h-screen">
        <LanguageHandler initialLanguage={locale as "en" | "zh"} />
        {children}
      </body>
    </html>
  );
}
