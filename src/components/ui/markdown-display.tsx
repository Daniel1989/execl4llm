'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MarkdownDisplayProps {
  markdown: string;
  className?: string;
}

export const MarkdownDisplay = ({ markdown, className }: MarkdownDisplayProps) => {
  const containerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [markdown]);

  return (
    <div className={cn('relative w-full', className)}>
      <pre
        ref={containerRef}
        className="w-full h-[500px] overflow-auto p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm"
      >
        <code className="block whitespace-pre-wrap font-mono">{markdown}</code>
      </pre>
      <div className="absolute top-2 right-2 space-x-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(markdown);
          }}
          className={cn(
            'px-2 py-1 text-xs rounded-md bg-white border border-gray-200 shadow-sm',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
          aria-label="Copy to clipboard"
        >
          Copy
        </button>
      </div>
    </div>
  );
}; 