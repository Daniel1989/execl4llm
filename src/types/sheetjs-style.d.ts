declare module 'sheetjs-style' {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [key: string]: WorkSheet };
    Props?: any;
    Styles?: {
      indexedColors?: string[];
      fonts?: any[];
      fills?: any[];
      borders?: any[];
      cellXfs?: any[];
      cellStyleXfs?: any[];
    };
    Themes?: any[];
    SSF?: any;
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
      fill?: {
        patternType?: string;
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
    xf?: any;    // Extended format
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
    cellXfs?: boolean;
    cellStyleXfs?: boolean;
  }

  export function read(data: any, opts?: Partial<ParsingOptions>): WorkBook;
  export const utils: Utils;
} 