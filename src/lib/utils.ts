import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CellInfo {
  content: string;
  richText: string;
  style: {
    backgroundColor?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
  };
  address: string;
}

export interface SheetData {
  name: string;
  cells: CellInfo[];
}

// Helper function to convert Excel theme colors to RGB
function getThemeColor(theme?: number, tint?: number): string | undefined {
  const themeColors = {
    0: '#FFFFFF', // Background 1
    1: '#000000', // Text 1
    2: '#E7E6E6', // Background 2
    3: '#44546A', // Text 2
    4: '#4472C4', // Accent 1
    5: '#ED7D31', // Accent 2
    6: '#A5A5A5', // Accent 3
    7: '#FFC000', // Accent 4 (Yellow)
    8: '#5B9BD5', // Accent 5
    9: '#70AD47'  // Accent 6
  };

  if (theme === undefined) return undefined;
  
  const baseColor = themeColors[theme as keyof typeof themeColors];
  if (!baseColor) return undefined;

  // If no tint, return the base color
  if (!tint) return baseColor;

  // TODO: Implement tint adjustment if needed
  return baseColor;
}

export function processExcelFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { 
          type: 'array',
          cellStyles: true,
          cellNF: true,
          cellDates: true,
          cellFormula: true,
          cellHTML: true,
          sheetStubs: true
        });
        console.log('Workbook loaded:', workbook);
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export function analyzeSheet(file: File, sheetName: string): Promise<SheetData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { 
          type: 'array',
          cellStyles: true,
          cellNF: true,
          cellDates: true,
          cellFormula: true,
          cellHTML: true,
          sheetStubs: true
        });
        
        // Log the raw workbook data
        console.log('Raw workbook data:', {
          Props: workbook.Props,  // Workbook properties
          SSF: workbook.SSF,     // Number formats
          SheetNames: workbook.SheetNames,
          Workbook: (workbook as any).Workbook // Additional workbook info
        });

        const worksheet = workbook.Sheets[sheetName];
        
        const cells: CellInfo[] = [];

        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        // Iterate through all cells in the range
        for(let R = range.s.r; R <= range.e.r; ++R) {
          for(let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
            const cell = worksheet[cellAddress];
            
            if (!cell) continue;
            
            // Log raw cell data
            console.log(`Raw cell ${cellAddress} data:`, {
              cell,
              cellType: cell.t,
              cellValue: cell.v,
              cellRaw: cell.w,
              cellFormula: cell.f,
              cellStyle: cell.s,
              cellMetadata: (cell as any).meta
            });

            // Get style information
            let backgroundColor: string | undefined;
            let textColor: string | undefined;
            let fontWeight: string | undefined;
            let fontStyle: string | undefined;
            let textDecoration: string | undefined;

            // Try to get style from the cell's style object
            if (cell.s) {
              // Log raw style data
              console.log(`Raw style data for ${cellAddress}:`, {
                style: cell.s,
                fill: cell.s.fill,
                font: cell.s.font,
                border: cell.s.border,
                numFmt: cell.s.numFmt,
                alignment: cell.s.alignment
              });

              // Try to get fill color
              if (cell.s.fgColor || cell.s.bgColor) {
                if (cell.s.fgColor?.rgb) {
                  backgroundColor = `#${cell.s.fgColor.rgb}`;
                } else if (cell.s.fgColor?.theme !== undefined) {
                  backgroundColor = getThemeColor(cell.s.fgColor.theme, cell.s.fgColor.tint);
                } else if (cell.s.fgColor?.indexed !== undefined) {
                  // Handle indexed colors
                  const indexedColors = (workbook as any).Styles?.indexedColors || [];
                  if (indexedColors[cell.s.fgColor.indexed]) {
                    backgroundColor = `#${indexedColors[cell.s.fgColor.indexed]}`;
                  }
                } else if (cell.s.bgColor?.rgb) {
                  backgroundColor = `#${cell.s.bgColor.rgb}`;
                } else if (cell.s.bgColor?.theme !== undefined) {
                  backgroundColor = getThemeColor(cell.s.bgColor.theme, cell.s.bgColor.tint);
                } else if (cell.s.bgColor?.indexed !== undefined) {
                  const indexedColors = (workbook as any).Styles?.indexedColors || [];
                  if (indexedColors[cell.s.bgColor.indexed]) {
                    backgroundColor = `#${indexedColors[cell.s.bgColor.indexed]}`;
                  }
                }
              }

              // Try to get font information
              if (cell.s.font) {
                if (cell.s.font.color) {
                  if (cell.s.font.color.rgb) {
                    textColor = `#${cell.s.font.color.rgb}`;
                  } else if (cell.s.font.color.theme !== undefined) {
                    textColor = getThemeColor(cell.s.font.color.theme, cell.s.font.color.tint);
                  } else if (cell.s.font.color.indexed !== undefined) {
                    const indexedColors = (workbook as any).Styles?.indexedColors || [];
                    if (indexedColors[cell.s.font.color.indexed]) {
                      textColor = `#${indexedColors[cell.s.font.color.indexed]}`;
                    }
                  }
                }
                if (cell.s.font.bold) fontWeight = 'bold';
                if (cell.s.font.italic) fontStyle = 'italic';
                if (cell.s.font.underline) textDecoration = 'underline';
              }
            }

            // Create cell info
            const cellInfo: CellInfo = {
              content: cell.v?.toString() || '',
              richText: cell.r || cell.h || cell.v?.toString() || '',
              style: {
                backgroundColor,
                color: textColor,
                fontWeight,
                fontStyle,
                textDecoration,
              },
              address: cellAddress,
            };

            console.log(`Processed cell ${cellAddress}:`, cellInfo);
            cells.push(cellInfo);
          }
        }

        resolve({
          name: sheetName,
          cells: cells.filter(cell => cell.content || Object.values(cell.style).some(v => v !== undefined)),
        });
      } catch (error) {
        console.error('Error analyzing sheet:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export function convertToMarkdown(sheetData: SheetData): string {
  let markdown = `# Sheet: ${sheetData.name}\n\n`;
  markdown += '| Cell | Content | Rich Text | Styles |\n';
  markdown += '|------|---------|-----------|--------|\n';

  sheetData.cells.forEach((cell) => {
    const styles = Object.entries(cell.style)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    markdown += `| ${cell.address} | ${cell.content} | ${cell.richText} | ${styles || 'None'} |\n`;
  });

  return markdown;
} 