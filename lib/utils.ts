import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedPath(path: string, locale?: string): string {
  if (!locale || locale === "en") {
    return path;
  }
  // Use /cn for Chinese instead of /zh
  const pathPrefix = locale === "zh" ? "cn" : locale;
  return `/${pathPrefix}${path}`;
}
