import * as React from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

interface ArticlesPaginationProps {
   currentPage: number;
   totalPages: number;
   totalItems: number;
   itemsPerPage: number;
   statusFilter: string;
}

export default function ArticlesPagination({ currentPage, totalPages, totalItems, itemsPerPage, statusFilter }: ArticlesPaginationProps) {
   if (totalPages <= 1) return null;

   const generatePaginationItems = () => {
      const items: React.ReactNode[] = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
         startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
         items.push(
            <PaginationItem key="1">
               <PaginationLink href={`?status=${statusFilter}&page=1`} isActive={currentPage === 1}>
                  1
               </PaginationLink>
            </PaginationItem>
         );
         if (startPage > 2) {
            items.push(
               <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
               </PaginationItem>
            );
         }
      }

      for (let i = startPage; i <= endPage; i++) {
         items.push(
            <PaginationItem key={i}>
               <PaginationLink href={`?status=${statusFilter}&page=${i}`} isActive={currentPage === i}>
                  {i}
               </PaginationLink>
            </PaginationItem>
         );
      }

      if (endPage < totalPages) {
         if (endPage < totalPages - 1) {
            items.push(
               <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
               </PaginationItem>
            );
         }
         items.push(
            <PaginationItem key={totalPages}>
               <PaginationLink href={`?status=${statusFilter}&page=${totalPages}`} isActive={currentPage === totalPages}>
                  {totalPages}
               </PaginationLink>
            </PaginationItem>
         );
      }

      return items;
   };

   return (
      <div className="mt-6">
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious href={currentPage > 1 ? `?status=${statusFilter}&page=${currentPage - 1}` : undefined} className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''} />
               </PaginationItem>
               {generatePaginationItems()}
               <PaginationItem>
                  <PaginationNext href={currentPage < totalPages ? `?status=${statusFilter}&page=${currentPage + 1}` : undefined} className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''} />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
