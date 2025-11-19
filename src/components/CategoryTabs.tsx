'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCardWrapper';

interface Category {
   id: number;
   name: string;
   slug: string;
   description?: string;
}

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

interface CategoryTabsProps {
   categories: string | Category[];
   initialCategoryId?: number;
}

export default function CategoryTabs({ categories: categoriesProp, initialCategoryId }: CategoryTabsProps) {
   // Parse categories - simple and straightforward
   let categories: Category[] = [];
   try {
      if (typeof categoriesProp === 'string') {
         categories = JSON.parse(categoriesProp) || [];
      } else if (Array.isArray(categoriesProp)) {
         categories = categoriesProp;
      }
   } catch (error) {
      categories = [];
   }

   // Set initial active category
   const getInitialCategoryId = () => {
      if (initialCategoryId) return initialCategoryId;
      if (categories.length > 0) return categories[0].id;
      return null;
   };

   const [activeCategoryId, setActiveCategoryId] = useState<number | null>(getInitialCategoryId());
   const [articles, setArticles] = useState<Article[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Fetch articles when category changes
   useEffect(() => {
      if (!activeCategoryId) return;

      setLoading(true);
      setError(null);

      fetch(`/api/articles?category_id=${activeCategoryId}&status=published&limit=4`)
         .then((response) => {
            if (!response.ok) {
               throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
         })
         .then((result) => {
            const articlesData = result.data || result.articles || [];
            if (Array.isArray(articlesData)) {
               setArticles(articlesData);
            } else {
               setArticles([]);
            }
         })
         .catch((err) => {
            setError(err.message || 'Gagal memuat artikel');
            setArticles([]);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [activeCategoryId]);

   // Don't render if no categories
   if (!categories || categories.length === 0) {
      return null;
   }

   return (
      <section className="mb-16">
         {/* Tabs Navigation */}
         <div className="border-b border-gray-200 mb-6 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 min-w-max pb-1">
               {categories.map((category) => (
                  <button
                     key={category.id}
                     onClick={() => setActiveCategoryId(category.id)}
                     className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeCategoryId === category.id
                           ? 'border-blue-600 text-blue-600 font-semibold'
                           : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                     }`}
                  >
                     {category.name}
                  </button>
               ))}
            </div>
         </div>

         {/* Articles Grid */}
         {loading ? (
            <div className="flex items-center justify-center py-12">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
               <p className="ml-3 text-gray-600 text-sm sm:text-base">Memuat artikel...</p>
            </div>
         ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 sm:p-12 text-center">
               <p className="text-yellow-800 text-sm sm:text-lg mb-2">Error memuat artikel</p>
               <p className="text-yellow-600 text-xs sm:text-sm">{error}</p>
            </div>
         ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               {articles.map((article) => (
                  <NewsCard
                     key={article.id}
                     id={article.id}
                     title={article.title}
                     slug={article.slug}
                     summary={article.summary || 'Tidak ada ringkasan tersedia...'}
                     thumbnail_url={article.thumbnail_url}
                     thumbnail_alt={article.thumbnail_alt}
                     published_at={article.published_at}
                     created_at={article.created_at}
                     categories={article.categories}
                  />
               ))}
            </div>
         ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
               <p className="text-gray-500 text-sm sm:text-lg">Belum ada artikel untuk kategori ini.</p>
            </div>
         )}
      </section>
   );
}
