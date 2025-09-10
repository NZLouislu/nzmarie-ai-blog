import "./globals.css";
import { ReactNode } from "react";
import { headers } from 'next/headers';

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
    <html lang={lang}>
      <head>
        <link rel="alternate" hrefLang="en" href={`${baseUrl}${alternatePath}`} />
        <link rel="alternate" hrefLang="zh-CN" href={`${baseUrl}${currentPath}`} />
      </head>
      <body className="antialiased bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
