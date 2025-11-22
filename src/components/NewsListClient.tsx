import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';

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

interface NewsListClientProps {
   initialPage?: number;
   initialArticles?: Article[];
   initialTotalPages?: number;
   initialTotalArticles?: number;
}

export default function NewsListClient({ initialPage = 1, initialArticles = [], initialTotalPages = 1, initialTotalArticles = 0 }: NewsListClientProps) {
   const [articles, setArticles] = useState<Article[]>(initialArticles);
   const [currentPage, setCurrentPage] = useState(initialPage);
   const [totalPages, setTotalPages] = useState(initialTotalPages);
   const [totalArticles, setTotalArticles] = useState(initialTotalArticles);
   const [loading, setLoading] = useState(false);
   const [isClient, setIsClient] = useState(false);

   const limit = 10;

   // Ensure component only runs on client-side
   useEffect(() => {
      setIsClient(true);
   }, []);

   const fetchArticles = async (page: number) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/articles?page=${page}&limit=${limit}&status=published`);
         if (response.ok) {
            const result = await response.json();
            const data = result.data || [];

            setArticles(data);
            setTotalPages(result.totalPages || Math.ceil((result.total || 0) / limit));
            setTotalArticles(result.total || 0);
            setCurrentPage(page);

            // Update URL without page reload
            const url = new URL(window.location.href);
            if (page === 1) {
               url.searchParams.delete('page');
            } else {
               url.searchParams.set('page', page.toString());
            }
            window.history.pushState({ page }, '', url.toString());

            // Scroll to news list section
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
      if (page >= 1 && page <= totalPages && page !== currentPage) {
         fetchArticles(page);
      }
   };

   // Update articles when initialArticles change (server-side update)
   useEffect(() => {
      setArticles(initialArticles);
      setCurrentPage(initialPage);
      setTotalPages(initialTotalPages);
      setTotalArticles(initialTotalArticles);
   }, [initialArticles, initialPage, initialTotalPages, initialTotalArticles]);

   // Hide server-rendered content when paginated (client-side only)
   useEffect(() => {
      if (!isClient) return;
      
      const newsSection = document.getElementById('news-list-section');
      const clientSection = document.getElementById('news-list-section-client');
      
      if (!newsSection) return;

      // Hide server-rendered content when page changes (React will render new content)
      if (currentPage !== initialPage) {
         newsSection.style.display = 'none';
         if (clientSection) {
            clientSection.style.display = '';
         }
      } else {
         newsSection.style.display = '';
         if (clientSection) {
            clientSection.style.display = 'none';
         }
      }
   }, [currentPage, initialPage, isClient]);

   return (
      <>
         {/* Loading indicator */}
         {loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center mb-6">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               <p className="text-gray-500 text-lg mt-4">Memuat artikel...</p>
            </div>
         )}
         
         {/* Client-side rendered articles when paginated (only render if page changed and on client) */}
         {isClient && currentPage !== initialPage && articles.length > 0 && !loading && (
            <div id="news-list-section-client" className="space-y-6">
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
         )}

         {/* Pagination Controls */}
         {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
               {/* Previous Button */}
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className={`px-4 py-2 rounded-lg border transition-colors ${currentPage > 1 && !loading ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed'}`}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
               </button>

               {/* Page Info */}
               <span className="px-4 py-2 text-sm text-gray-700">
                  Halaman {currentPage} dari {totalPages}
               </span>

               {/* Next Button */}
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className={`px-4 py-2 rounded-lg border transition-colors ${currentPage < totalPages && !loading ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed'}`}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
               </button>
            </div>
         )}
      </>
   );
}
