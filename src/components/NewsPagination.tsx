'use client';

import { useState, useEffect } from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import NewsCard from './NewsCard';

// CSS animations for smooth transitions
const animationStyles = `
   @keyframes fadeInUp {
      from {
         opacity: 0;
         transform: translateY(20px);
      }
      to {
         opacity: 1;
         transform: translateY(0);
      }
   }
   
   .article-item {
      opacity: 0;
   }
`;

interface Article {
   id: number;
   title: string;
   slug: string;
   summary: string;
   thumbnail_url: string | null;
   thumbnail_alt?: string | null;
   published_at: string;
   created_at: string;
   categories?: {
      id: number;
      name: string;
      slug: string;
   };
}

interface NewsPaginationProps {
   initialPage?: number;
   initialArticles?: Article[];
   initialTotalPages?: number;
   categoryId?: number;
   tagId?: number;
   searchQuery?: string;
}

export default function NewsPagination({ initialPage = 1, initialArticles = [], initialTotalPages = 1, categoryId, tagId, searchQuery }: NewsPaginationProps) {
   const [articles, setArticles] = useState<Article[]>(initialArticles);
   const [currentPage, setCurrentPage] = useState(initialPage);
   const [totalPages, setTotalPages] = useState(initialTotalPages);
   const [loading, setLoading] = useState(false);

   const limit = 10;

   const fetchArticles = async (page: number) => {
      setLoading(true);
      try {
         let url = `/api/articles?page=${page}&limit=${limit}&status=published`;

         if (categoryId) {
            url += `&category_id=${categoryId}`;
         }

         if (tagId) {
            url += `&tag_id=${tagId}`;
         }

         if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
         }

         const response = await fetch(url);
         if (response.ok) {
            const result = await response.json();
            const data = result.data || [];

            setArticles(data);
            setTotalPages(result.totalPages || Math.ceil((result.total || 0) / limit));
            setCurrentPage(page);

            // Update URL without page reload
            const urlObj = new URL(window.location.href);
            if (page === 1) {
               urlObj.searchParams.delete('page');
            } else {
               urlObj.searchParams.set('page', page.toString());
            }
            // Preserve search query if exists
            if (searchQuery) {
               urlObj.searchParams.set('q', searchQuery);
            }
            window.history.pushState({ page }, '', urlObj.toString());

            // Scroll to news list section smoothly
            const newsSection = document.getElementById('news-list-section');
            if (newsSection) {
               newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
         }
      } catch (error) {
         console.error('Error fetching articles:', error);
      } finally {
         setLoading(false);
      }
   };

   const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
         fetchArticles(page);
      }
   };

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
               <PaginationLink
                  href="#"
                  onClick={(e) => {
                     e.preventDefault();
                     handlePageChange(1);
                  }}
                  isActive={currentPage === 1}
               >
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
               <PaginationLink
                  href="#"
                  onClick={(e) => {
                     e.preventDefault();
                     handlePageChange(i);
                  }}
                  isActive={currentPage === i}
               >
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
               <PaginationLink
                  href="#"
                  onClick={(e) => {
                     e.preventDefault();
                     handlePageChange(totalPages);
                  }}
                  isActive={currentPage === totalPages}
               >
                  {totalPages}
               </PaginationLink>
            </PaginationItem>
         );
      }

      return items;
   };

   // Update articles when initialArticles change (server-side update)
   useEffect(() => {
      setArticles(initialArticles);
      setCurrentPage(initialPage);
      setTotalPages(initialTotalPages);
   }, [initialArticles, initialPage, initialTotalPages]);

   if (totalPages <= 1) {
      // Just render articles, no pagination
      return (
         <div id="news-list-section" className="space-y-8">
            {articles.map((article) => (
               <NewsCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  slug={article.slug}
                  summary={article.summary}
                  thumbnail_url={article.thumbnail_url}
                  thumbnail_alt={article.thumbnail_alt}
                  published_at={article.published_at}
                  created_at={article.created_at}
                  categories={article.categories}
               />
            ))}
         </div>
      );
   }

   return (
      <>
         <style>{animationStyles}</style>

         {/* Articles List */}
         <div id="news-list-section" className="space-y-8 relative min-h-[400px]">
            {/* Loading Overlay */}
            {loading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-lg">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-gray-600 text-lg mt-4 font-medium">Memuat artikel...</p>
               </div>
            )}

            {/* Articles with smooth fade transition */}
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
               {articles.length > 0
                  ? articles.map((article, index) => (
                       <div
                          key={`${article.id}-${currentPage}`}
                          className="article-item my-3"
                          style={{
                             animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                          }}
                       >
                          <NewsCard
                             id={article.id}
                             title={article.title}
                             slug={article.slug}
                             summary={article.summary}
                             thumbnail_url={article.thumbnail_url}
                             thumbnail_alt={article.thumbnail_alt}
                             published_at={article.published_at}
                             created_at={article.created_at}
                             categories={article.categories}
                          />
                       </div>
                    ))
                  : !loading && (
                       <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                          <p className="text-gray-500 text-lg">Tidak ada artikel.</p>
                       </div>
                    )}
            </div>
         </div>

         {/* Pagination */}
         <div className="mt-8">
            <Pagination>
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                           e.preventDefault();
                           handlePageChange(currentPage - 1);
                        }}
                        className={currentPage <= 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                     />
                  </PaginationItem>
                  {generatePaginationItems()}
                  <PaginationItem>
                     <PaginationNext
                        href="#"
                        onClick={(e) => {
                           e.preventDefault();
                           handlePageChange(currentPage + 1);
                        }}
                        className={currentPage >= totalPages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                     />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         </div>
      </>
   );
}
