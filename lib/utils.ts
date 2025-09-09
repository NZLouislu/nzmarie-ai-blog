
export function getLocalizedPath(path: string, lang: 'en' | 'zh'): string {
  if (lang === 'zh') {
    return `/cn${path.replace(/^\/cn/, '')}`;
  } else {
    return path.replace(/^\/cn/, '');
  }
}