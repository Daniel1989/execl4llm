import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CellStyle {
  backgroundColor?: string;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
}

export interface CellInfo {
  content: string;
  richText: string;
  style: CellStyle;
  address: string;
}

export interface SheetData {
  name: string;
  cells: CellInfo[];
}

export function processExcelFile(file: File): Promise<string[]> {
  const formData = new FormData();
  formData.append('file', file);

  return fetch('http://localhost:8000/api/sheets', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}

export function analyzeSheet(file: File, sheetName: string): Promise<SheetData> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheet_name', sheetName);

  return fetch('http://localhost:8000/api/analyze-sheet', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}

export function convertToMarkdown(sheetData: SheetData): string {
  let markdown = `# Sheet: ${sheetData.name}\n\n`;
  markdown += '| Cell | Content | Styles |\n';
  markdown += '|------|---------|--------|\n';

  sheetData.cells.forEach((cell) => {
    const styles = Object.entries(cell.style)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    markdown += `| ${cell.address} | ${cell.content} | ${styles || 'None'} |\n`;
  });

  return markdown;
} 