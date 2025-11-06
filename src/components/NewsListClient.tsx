import { useState, useEffect } from 'react';

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

   const limit = 10;

   const fetchArticles = async (page: number) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/articles?page=${page}&limit=${limit}&status=published`);
         if (response.ok) {
            const result = await response.json();
            const data = result.data || [];

            // Use data as is (alt text will be handled by fallback to article title)
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

            // Scroll to top of news section
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

   // Helper function untuk format waktu relatif
   const getTimeAgo = (dateString: string | null): string => {
      if (!dateString) return 'Baru saja';

      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Baru saja';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`;
      return `${Math.floor(diffInSeconds / 2592000)} bulan yang lalu`;
   };

   // Helper function untuk get category color
   const getCategoryColor = (categoryName: string): string => {
      const colors: Record<string, string> = {
         Ekonomi: 'from-blue-500 to-blue-600',
         Saham: 'from-green-500 to-green-600',
         Kripto: 'from-purple-500 to-purple-600',
         Market: 'from-orange-500 to-orange-600',
         Energi: 'from-yellow-500 to-yellow-600',
         'Sektor Riil': 'from-red-500 to-red-600',
         'Gaya Hidup': 'from-pink-500 to-pink-600',
      };
      return colors[categoryName] || 'from-gray-500 to-gray-600';
   };

   const offset = (currentPage - 1) * limit;

   return (
      <div id="news-list-section">
         <div className="space-y-6">
            {loading ? (
               <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 text-lg mt-4">Memuat artikel...</p>
               </div>
            ) : articles && articles.length > 0 ? (
               articles.map((article) => {
                  const category = article.categories?.name || 'Umum';
                  const categoryColor = getCategoryColor(category);
                  const timeAgo = getTimeAgo(article.published_at || article.created_at);
                  const articleUrl = `/artikel/${article.slug}`;

                  return (
                     <article key={article.id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <a href={articleUrl} className="flex gap-6">
                           <div className="flex-shrink-0">
                              {article.thumbnail_url ? (
                                 <img src={article.thumbnail_url} alt={article.thumbnail_alt || article.title || 'Article thumbnail'} className="w-48 h-28 rounded-lg object-cover" loading="lazy" />
                              ) : (
                                 <div className="w-48 h-28 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                       ></path>
                                    </svg>
                                 </div>
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 leading-tight">{article.title}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary || 'Tidak ada ringkasan tersedia...'}</p>
                              <p className="text-sm text-blue-600 font-medium">
                                 {category} | {timeAgo}
                              </p>
                           </div>
                        </a>
                     </article>
                  );
               })
            ) : (
               <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">Belum ada artikel yang diterbitkan.</p>
                  <p className="text-gray-400 text-sm mt-2">Silakan publikasikan artikel dari dashboard admin.</p>
               </div>
            )}
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
               {/* Previous Button */}
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${currentPage > 1 ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'}`}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
               </button>

               {/* Next Button */}
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 rounded-lg border transition-colors ${currentPage < totalPages ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'}`}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
               </button>
            </div>
         )}
      </div>
   );
}
