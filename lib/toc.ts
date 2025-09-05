export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

export function generateTocHtml(headings: TocItem[]): string {
  if (headings.length === 0) return '';

  let html = '<nav class="space-y-1">\n';

  headings.forEach((heading) => {
    const indent = '  '.repeat(heading.level - 1);
    html += `${indent}<a href="#${heading.id}" class="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1">\n`;
    html += `${indent}  ${'#'.repeat(heading.level)} ${heading.text}\n`;
    html += `${indent}</a>\n`;
  });

  html += '</nav>';
  return html;
}