import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
