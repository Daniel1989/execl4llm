'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
}

export const FileUpload = ({ onFileSelect, accept = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
} }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        'hover:border-gray-400 hover:bg-gray-50',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop an Excel file here, or click to select
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports .xlsx and .xls files
        </p>
      </div>
    </div>
  );
}; 