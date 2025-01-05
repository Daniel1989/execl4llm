'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { SheetSelector } from '@/components/ui/sheet-selector';
import { MarkdownDisplay } from '@/components/ui/markdown-display';
import { processExcelFile, analyzeSheet, convertToMarkdown, type SheetData } from '@/lib/utils';

export default function Home() {
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [markdownResult, setMarkdownResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      const sheetNames = await processExcelFile(file);
      setSheets(sheetNames);
      setSelectedSheet('');
      setCurrentFile(file);
      setMarkdownResult('');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing the Excel file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetSelect = async (sheetName: string) => {
    if (!currentFile) return;

    try {
      setIsLoading(true);
      setSelectedSheet(sheetName);
      const sheetData = await analyzeSheet(currentFile, sheetName);
      const markdown = convertToMarkdown(sheetData);
      setMarkdownResult(markdown);
    } catch (error) {
      console.error('Error analyzing sheet:', error);
      alert('Error analyzing the selected sheet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Excel to Markdown Converter</h1>
          <p className="mt-2 text-gray-600">
            Upload an Excel file and convert its contents to structured markdown format
          </p>
        </div>

        <div className="space-y-6">
          <FileUpload onFileSelect={handleFileSelect} />

          {sheets.length > 0 && (
            <div className="space-y-4">
              <SheetSelector
                sheets={sheets}
                selectedSheet={selectedSheet}
                onSheetSelect={handleSheetSelect}
              />
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {markdownResult && !isLoading && (
            <MarkdownDisplay markdown={markdownResult} />
          )}
        </div>
      </div>
    </main>
  );
}
