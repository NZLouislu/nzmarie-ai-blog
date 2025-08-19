import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function Markdown({ content }: { content: string }) {
  return <div className="prose"><ReactMarkdown>{content}</ReactMarkdown></div>;
}
