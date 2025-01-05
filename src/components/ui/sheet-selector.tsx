'use client';

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

interface SheetSelectorProps {
  sheets: string[];
  selectedSheet: string;
  onSheetSelect: (sheet: string) => void;
}

export const SheetSelector = ({
  sheets,
  selectedSheet,
  onSheetSelect,
}: SheetSelectorProps) => {
  return (
    <Select.Root value={selectedSheet} onValueChange={onSheetSelect}>
      <Select.Trigger
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        aria-label="Select sheet"
      >
        <Select.Value placeholder="Select a sheet">
          {selectedSheet || 'Select a sheet'}
        </Select.Value>
        <Select.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={cn(
            'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md',
            'animate-in fade-in-80'
          )}
        >
          <Select.Viewport className="p-1">
            {sheets.map((sheet) => (
              <Select.Item
                key={sheet}
                value={sheet}
                className={cn(
                  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                  'focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Select.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{sheet}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}; 