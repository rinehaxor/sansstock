// NewsCard component - renders article cards
import { getOptimizedImageUrl } from '../lib/utils';

interface NewsCardProps {
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

function getTimeAgo(dateString: string | null): string {
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
}

export default function NewsCard({ title, slug, summary, thumbnail_url, thumbnail_alt, published_at, created_at, categories }: NewsCardProps) {
   const category = categories?.name || 'Umum';
   const timeAgo = getTimeAgo(published_at || created_at);
   const articleUrl = `/artikel/${slug}`;

   return (
      <article className="group bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a href={articleUrl} className="flex-shrink-0 w-full sm:w-48">
               {thumbnail_url ? (
                  <img src={getOptimizedImageUrl(thumbnail_url, 192, 112) || thumbnail_url} alt={thumbnail_alt || title || 'Article thumbnail'} className="w-full sm:w-48 h-48 sm:h-28 rounded-lg object-cover" loading="lazy" width="192" height="112" decoding="async" fetchPriority="low" sizes="(max-width: 640px) 100vw, 192px" style={{ aspectRatio: '192/112' }} />
               ) : (
                  <div className="w-full sm:w-48 h-48 sm:h-28 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                     <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                     </svg>
                  </div>
               )}
            </a>
            <div className="flex-1 min-w-0">
               <a href={articleUrl} className="block">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2 leading-tight">{title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{summary || 'Tidak ada ringkasan tersedia...'}</p>
               </a>
               <p className="text-xs sm:text-sm text-blue-600 font-medium">
                  {categories?.slug ? (
                     <>
                        <a href={`/categories/${categories.slug}`} className="hover:underline">
                           {category}
                        </a>
                        {' | '}
                        {timeAgo}
                     </>
                  ) : (
                     `${category} | ${timeAgo}`
                  )}
               </p>
            </div>
         </div>
      </article>
   );
}
