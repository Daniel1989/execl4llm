declare module 'xlsx' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [key: string]: WorkSheet };
    Props?: any;
    SSF?: any;
    Workbook?: any;
  }

  export interface WorkSheet {
    [key: string]: any;
    '!ref'?: string;
  }

  export interface CellObject {
    t?: string;  // Type
    v?: any;     // Value
    r?: string;  // Rich text
    h?: string;  // HTML
    w?: string;  // Formatted text
    f?: string;  // Formula
    s?: {        // Style
      fgColor?: {
        rgb?: string;
        theme?: number;
        tint?: number;
        indexed?: number;
      };
      bgColor?: {
        rgb?: string;
        theme?: number;
        tint?: number;
        indexed?: number;
      };
      font?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        color?: {
          rgb?: string;
          theme?: number;
          tint?: number;
          indexed?: number;
        };
      };
      border?: any;
      numFmt?: any;
      alignment?: any;
    };
    meta?: any;  // Additional metadata
  }

  export interface Range {
    s: { r: number; c: number };
    e: { r: number; c: number };
  }

  export interface Utils {
    decode_range(range: string): Range;
    encode_cell(cell: { r: number; c: number }): string;
  }

  export interface ParsingOptions {
    type: string;
    cellStyles?: boolean;
    cellNF?: boolean;
    cellDates?: boolean;
    cellFormula?: boolean;
    cellHTML?: boolean;
    sheetStubs?: boolean;
  }

  export function read(data: any, opts?: Partial<ParsingOptions>): WorkBook;
  export const utils: Utils;
} 