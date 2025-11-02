import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';

export interface Column<T> {
   id: string;
   header: string;
   accessorKey?: keyof T;
   cell?: (row: T) => React.ReactNode;
   sortable?: boolean;
   className?: string;
}

interface DataTableProps<T> {
   data: T[];
   columns: Column<T>[];
   searchKey?: string;
   searchPlaceholder?: string;
   onSearch?: (value: string) => void;
   actions?: (row: T) => React.ReactNode;
   emptyMessage?: string;
   className?: string;
}

export function DataTable<T extends Record<string, any>>({ data, columns, searchKey, searchPlaceholder = 'Search...', onSearch, actions, emptyMessage = 'No data available.', className }: DataTableProps<T>) {
   const [searchValue, setSearchValue] = React.useState('');

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      onSearch?.(value);
   };

   return (
      <div className={cn('space-y-4', className)}>
         {/* Search */}
         {searchKey && onSearch && (
            <div className="flex items-center gap-2">
               <Input type="text" placeholder={searchPlaceholder} value={searchValue} onChange={handleSearchChange} className="max-w-sm" />
            </div>
         )}

         {/* Table */}
         <div className="rounded-md border border-gray-200 bg-white">
            <Table>
               <TableHeader>
                  <TableRow>
                     {columns.map((column) => (
                        <TableHead key={column.id} className={column.className}>
                           {column.header}
                        </TableHead>
                     ))}
                     {actions && <TableHead className="w-[100px]">Actions</TableHead>}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center">
                           {emptyMessage}
                        </TableCell>
                     </TableRow>
                  ) : (
                     data.map((row, index) => (
                        <TableRow key={index}>
                           {columns.map((column) => {
                              let content: React.ReactNode;

                              if (column.cell) {
                                 content = column.cell(row);
                              } else if (column.accessorKey) {
                                 content = row[column.accessorKey];
                              } else {
                                 content = null;
                              }

                              return (
                                 <TableCell key={column.id} className={column.className}>
                                    {content}
                                 </TableCell>
                              );
                           })}
                           {actions && <TableCell>{actions(row)}</TableCell>}
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
