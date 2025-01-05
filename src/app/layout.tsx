import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Excel to Markdown Converter',
  description: 'Convert Excel files to structured markdown format for LLM consumption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
