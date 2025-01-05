# Excel to LLM Converter

A web application that converts Excel files into structured data format suitable for LLM consumption. The application extracts not only the content but also preserves styling information like colors, fonts, and formatting.

## Project Structure

```
execl4llm/
├── api/                      # Python FastAPI Backend
│   ├── main.py              # Main FastAPI application
│   └── run.py               # Server startup script
├── src/                     # Next.js Frontend
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Main page component
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   └── ui/             # UI components
│   │       ├── file-upload.tsx      # File upload component
│   │       ├── sheet-selector.tsx   # Sheet selection component
│   │       └── markdown-display.tsx  # Markdown output display
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Common utilities
│   └── types/               # TypeScript type definitions
│       ├── js-xlsx.d.ts     # Excel library types
│       ├── sheetjs-style.d.ts
│       └── xlsx.d.ts
├── public/                  # Static files
├── next.config.js           # Next.js configuration
├── package.json             # Frontend dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Features

- **File Upload**: Drag-and-drop interface for Excel file upload
- **Sheet Selection**: Choose which sheet to analyze
- **Style Preservation**: Extracts and preserves:
  - Font colors
  - Background colors
  - Font styles (bold, italic, underline)
  - Cell formatting
- **Markdown Output**: Converts Excel data to structured markdown format
- **Rich Text Support**: Handles rich text content in cells

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Radix UI Components

### Backend
- Python 3.11
- FastAPI
- openpyxl for Excel processing
- uvicorn for ASGI server

## API Endpoints

### `/api/sheets` (POST)
- Accepts Excel file upload
- Returns list of sheet names in the workbook

### `/api/analyze-sheet` (POST)
- Accepts Excel file and sheet name
- Returns structured data including:
  - Cell content
  - Styling information
  - Cell coordinates
  - Rich text content

## Data Models

### CellStyle
```typescript
{
  backgroundColor?: string;  // Hex color code
  color?: string;           // Hex color code
  fontWeight?: string;      // "bold" | null
  fontStyle?: string;       // "italic" | null
  textDecoration?: string;  // "underline" | null
}
```

### CellInfo
```typescript
{
  content: string;      // Cell content
  richText: string;     // Rich text content
  style: CellStyle;     // Cell styling
  address: string;      // Cell coordinate (e.g., "A1")
}
```

### SheetData
```typescript
{
  name: string;         // Sheet name
  cells: CellInfo[];    // Array of cell information
}
```

## Setup and Running

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd api
pip install fastapi uvicorn openpyxl python-multipart
```

3. Start the backend server:
```bash
cd api
python run.py
```

4. Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Development Notes

- The backend uses CORS to allow requests from any origin
- Cell styles are extracted using openpyxl's style attributes
- Color values are converted from various formats to hex codes
- The frontend uses a responsive design with TailwindCSS
- Error handling is implemented for both frontend and backend
