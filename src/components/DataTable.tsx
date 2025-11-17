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
   actionMenuItems?: (row: T) => Array<{ label: string; onClick: () => void; icon?: React.ReactNode }>;
   emptyMessage?: string;
   className?: string;
   enableSelection?: boolean;
   onSelectionChange?: (selectedRows: T[]) => void;
   onMassDelete?: (selectedRows: T[]) => Promise<void> | void;
   getRowId?: (row: T) => string | number;
   defaultSort?: { key: string; direction: 'asc' | 'desc' };
   // Pagination props
   currentPage?: number;
   totalPages?: number;
   totalItems?: number;
   itemsPerPage?: number;
   onPageChange?: (page: number) => void;
   paginationBaseUrl?: string;
   buildPaginationUrl?: (page: number, search?: string) => string;
}

export function DataTable<T extends Record<string, any>>({
   data,
   columns,
   searchKey,
   searchPlaceholder = 'Filter...',
   onSearch,
   actions,
   actionMenuItems,
   emptyMessage = 'No data available.',
   className,
   enableSelection = false,
   onSelectionChange,
   onMassDelete,
   getRowId,
   currentPage,
   totalPages,
   totalItems,
   itemsPerPage,
   onPageChange,
   paginationBaseUrl,
   buildPaginationUrl,
   defaultSort,
}: DataTableProps<T>) {
   // Get initial search value from URL if available
   const getInitialSearchValue = () => {
      if (typeof window !== 'undefined') {
         const urlParams = new URLSearchParams(window.location.search);
         return urlParams.get('search') || '';
      }
      return '';
   };

   const [searchValue, setSearchValue] = React.useState(getInitialSearchValue());
   const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
   const [sortConfig, setSortConfig] = React.useState<{ key: string | null; direction: 'asc' | 'desc' | null }>(defaultSort ? { key: defaultSort.key, direction: defaultSort.direction } : { key: null, direction: null });
   const [openActionMenu, setOpenActionMenu] = React.useState<number | null>(null);
   const [isDeleting, setIsDeleting] = React.useState(false);
   const actionMenuRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

   // Update search value when URL changes
   React.useEffect(() => {
      if (typeof window !== 'undefined') {
         const updateSearchFromURL = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('search') || '';
            setSearchValue(searchParam);
         };
         updateSearchFromURL();
         window.addEventListener('popstate', updateSearchFromURL);
         return () => window.removeEventListener('popstate', updateSearchFromURL);
      }
   }, []);

   // Handle click outside to close action menu
   React.useEffect(() => {
      if (openActionMenu === null) return;

      function handleClickOutside(event: MouseEvent) {
         const target = event.target as Node;
         const menuIndex = openActionMenu;
         if (menuIndex === null) return;

         const menuElement = actionMenuRefs.current.get(menuIndex);

         // Check if click is outside the action menu container
         if (menuElement && !menuElement.contains(target)) {
            setOpenActionMenu(null);
         }
      }
      // Use a small delay to ensure button clicks are processed first
      const timeoutId = setTimeout(() => {
         document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => {
         clearTimeout(timeoutId);
         document.removeEventListener('click', handleClickOutside);
      };
   }, [openActionMenu]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      onSearch?.(value);
   };

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (buildPaginationUrl) {
         window.location.href = buildPaginationUrl(1, searchValue);
      } else if (paginationBaseUrl) {
         const params = new URLSearchParams();
         if (searchValue) {
            params.set('search', searchValue);
         }
         params.set('page', '1');
         window.location.href = `${paginationBaseUrl}?${params.toString()}`;
      }
   };

   const handleSearchClear = () => {
      setSearchValue('');
      if (buildPaginationUrl) {
         window.location.href = buildPaginationUrl(1);
      } else if (paginationBaseUrl) {
         window.location.href = `${paginationBaseUrl}?page=1`;
      }
      onSearch?.('');
   };

   const handleSelectAll = (checked: boolean) => {
      if (checked) {
         const allIndices = new Set(data.map((_, index) => index));
         setSelectedRows(allIndices);
         onSelectionChange?.(data);
      } else {
         setSelectedRows(new Set());
         onSelectionChange?.([]);
      }
   };

   const handleSelectRow = (index: number, checked: boolean) => {
      const newSelected = new Set(selectedRows);
      if (checked) {
         newSelected.add(index);
      } else {
         newSelected.delete(index);
      }
      setSelectedRows(newSelected);
      const selectedData = Array.from(newSelected).map((i) => data[i]);
      onSelectionChange?.(selectedData);
   };

   const handleMassDelete = async () => {
      if (selectedRows.size === 0) return;

      const selectedData = Array.from(selectedRows).map((i) => data[i]);
      const count = selectedData.length;

      if (!confirm(`Apakah Anda yakin ingin menghapus ${count} item yang dipilih?`)) {
         return;
      }

      setIsDeleting(true);
      try {
         if (onMassDelete) {
            await onMassDelete(selectedData);
         }
         // Clear selection after delete
         setSelectedRows(new Set());
         onSelectionChange?.([]);
      } catch (error) {
         console.error('Error deleting items:', error);
         alert('Terjadi error saat menghapus item. Silakan coba lagi.');
      } finally {
         setIsDeleting(false);
      }
   };

   const handleSort = (columnId: string) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column || !column.sortable) return;

      setSortConfig((prev) => {
         if (prev.key === columnId) {
            if (prev.direction === 'asc') {
               return { key: columnId, direction: 'desc' };
            } else if (prev.direction === 'desc') {
               return { key: null, direction: null };
            }
         }
         return { key: columnId, direction: 'asc' };
      });
   };

   const isAllSelected = data.length > 0 && selectedRows.size === data.length;
   const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

   // Sort data based on sortConfig
   const sortedData = React.useMemo(() => {
      if (!sortConfig.key || !sortConfig.direction) {
         return data;
      }

      const column = columns.find((col) => col.id === sortConfig.key);
      if (!column || !column.sortable) {
         return data;
      }

      const sorted = [...data].sort((a, b) => {
         let aValue: any;
         let bValue: any;

         if (column.accessorKey) {
            aValue = a[column.accessorKey];
            bValue = b[column.accessorKey];
         } else {
            // For custom cell renderers, try to get the value from common fields
            aValue = a[sortConfig.key as keyof typeof a];
            bValue = b[sortConfig.key as keyof typeof b];
         }

         // Handle null/undefined values
         if (aValue == null && bValue == null) return 0;
         if (aValue == null) return 1;
         if (bValue == null) return -1;

         // Handle dates
         if (aValue instanceof Date || (typeof aValue === 'string' && aValue.match(/^\d{4}-\d{2}-\d{2}/))) {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
         }

         // Compare values
         if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
         }

         if (sortConfig.direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
         } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
         }
      });

      return sorted;
   }, [data, sortConfig, columns]);

   const getPageUrl = (pageNum: number) => {
      if (buildPaginationUrl) {
         return buildPaginationUrl(pageNum, searchValue);
      }
      if (paginationBaseUrl) {
         const params = new URLSearchParams();
         if (searchValue) {
            params.set('search', searchValue);
         }
         params.set('page', pageNum.toString());
         return `${paginationBaseUrl}?${params.toString()}`;
      }
      return `?page=${pageNum}${searchValue ? `&search=${encodeURIComponent(searchValue)}` : ''}`;
   };

   const generatePaginationItems = () => {
      if (!totalPages || !currentPage) return null;

      const items: React.ReactNode[] = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
         startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
         items.push(
            <a
               key="1"
               href={getPageUrl(1)}
               className={cn(
                  'inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                  currentPage === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
               )}
            >
               1
            </a>
         );
         if (startPage > 2) {
            items.push(
               <span key="ellipsis-start" className="px-3 py-2 text-gray-500">
                  ...
               </span>
            );
         }
      }

      for (let i = startPage; i <= endPage; i++) {
         items.push(
            <a
               key={i}
               href={getPageUrl(i)}
               className={cn(
                  'inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                  currentPage === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
               )}
            >
               {i}
            </a>
         );
      }

      if (endPage < totalPages) {
         if (endPage < totalPages - 1) {
            items.push(
               <span key="ellipsis-end" className="px-3 py-2 text-gray-500">
                  ...
               </span>
            );
         }
         items.push(
            <a
               key={totalPages}
               href={getPageUrl(totalPages)}
               className={cn(
                  'inline-flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors',
                  currentPage === totalPages ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
               )}
            >
               {totalPages}
            </a>
         );
      }

      return items;
   };

   return (
      <div className={cn('space-y-4', className)}>
         {/* Search and Controls */}
         <div className="flex items-center justify-between gap-4">
            {(searchKey || onSearch) && (
               <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm">
                  <div className="relative">
                     <Input type="text" placeholder={searchPlaceholder} value={searchValue} onChange={handleSearchChange} className="w-full pr-10" />
                     {searchValue && (
                        <button
                           type="button"
                           onClick={handleSearchClear}
                           className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                           aria-label="Clear search"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     )}
                     <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Search"
                        style={{ right: searchValue ? '2.5rem' : '0.5rem' }}
                     >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                     </button>
                  </div>
               </form>
            )}
            <div className="flex items-center gap-2">
               {enableSelection && selectedRows.size > 0 && (
                  <>
                     <span className="text-sm text-gray-600">{selectedRows.size} item dipilih</span>
                     {onMassDelete && (
                        <button
                           onClick={handleMassDelete}
                           disabled={isDeleting}
                           className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                           {isDeleting ? (
                              <>
                                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Menghapus...
                              </>
                           ) : (
                              <>
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                 </svg>
                                 Hapus {selectedRows.size} item
                              </>
                           )}
                        </button>
                     )}
                  </>
               )}
            </div>
         </div>

         {/* Table */}
         <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <Table>
               <TableHeader className="rounded-t-xl">
                  <TableRow className="hover:bg-gray-50/50 border-b border-gray-200">
                     {enableSelection && (
                        <TableHead className="w-12">
                           <input
                              type="checkbox"
                              checked={isAllSelected}
                              ref={(input) => {
                                 if (input) input.indeterminate = isIndeterminate;
                              }}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                           />
                        </TableHead>
                     )}
                     {columns.map((column) => (
                        <TableHead key={column.id} className={cn(column.className, column.sortable && 'cursor-pointer select-none hover:bg-gray-100')} onClick={() => column.sortable && handleSort(column.id)}>
                           <div className="flex items-center gap-2">
                              <span>{column.header}</span>
                              {column.sortable && sortConfig.key === column.id && <span className="text-gray-400">{sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}</span>}
                           </div>
                        </TableHead>
                     ))}
                     {(actions || actionMenuItems) && <TableHead className="w-[100px] text-right">Actions</TableHead>}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {sortedData.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={columns.length + (enableSelection ? 1 : 0) + (actions || actionMenuItems ? 1 : 0)} className="h-24 text-center">
                           {emptyMessage}
                        </TableCell>
                     </TableRow>
                  ) : (
                     sortedData.map((row, index) => (
                        <TableRow key={index} className={cn('hover:bg-gray-50/50 transition-colors', selectedRows.has(index) && 'bg-blue-50')}>
                           {enableSelection && (
                              <TableCell>
                                 <input
                                    type="checkbox"
                                    checked={selectedRows.has(index)}
                                    onChange={(e) => handleSelectRow(index, e.target.checked)}
                                    className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                 />
                              </TableCell>
                           )}
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
                           {(actions || actionMenuItems) && (
                              <TableCell className="text-right">
                                 {actions ? (
                                    actions(row)
                                 ) : actionMenuItems ? (
                                    <div
                                       className="relative inline-block"
                                       ref={(el) => {
                                          if (el) {
                                             actionMenuRefs.current.set(index, el);
                                          } else {
                                             actionMenuRefs.current.delete(index);
                                          }
                                       }}
                                    >
                                       <button
                                          type="button"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             setOpenActionMenu(openActionMenu === index ? null : index);
                                          }}
                                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                                          aria-label="Actions"
                                       >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                          </svg>
                                       </button>
                                       {openActionMenu === index && (
                                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1" onClick={(e) => e.stopPropagation()}>
                                             <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">Actions</div>
                                             {actionMenuItems(row).map((item, itemIndex) => (
                                                <button
                                                   key={itemIndex}
                                                   type="button"
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      // Close menu first
                                                      setOpenActionMenu(null);
                                                      // Execute handler immediately
                                                      item.onClick();
                                                   }}
                                                   className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors rounded-md mx-1"
                                                >
                                                   {item.icon}
                                                   <span>{item.label}</span>
                                                </button>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                 ) : null}
                              </TableCell>
                           )}
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         {/* Pagination */}
         {totalPages && totalPages > 1 && currentPage && (
            <div className="mt-6">
               <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
                  {currentPage > 1 ? (
                     <a
                        href={buildPaginationUrl ? buildPaginationUrl(currentPage - 1, searchValue) : getPageUrl(currentPage - 1)}
                        className={cn('inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors', 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
                     >
                        Previous
                     </a>
                  ) : (
                     <button
                        disabled
                        aria-disabled={true}
                        tabIndex={-1}
                        className={cn('inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors', 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none')}
                     >
                        Previous
                     </button>
                  )}
                  {generatePaginationItems()}
                  {currentPage < totalPages ? (
                     <a
                        href={buildPaginationUrl ? buildPaginationUrl(currentPage + 1, searchValue) : getPageUrl(currentPage + 1)}
                        className={cn('inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors', 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
                     >
                        Next
                     </a>
                  ) : (
                     <button
                        disabled
                        aria-disabled={true}
                        tabIndex={-1}
                        className={cn('inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors', 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none')}
                     >
                        Next
                     </button>
                  )}
               </nav>
               {totalItems && itemsPerPage && (
                  <div className="mt-4 text-sm text-gray-600 text-center">
                     Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} item
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
