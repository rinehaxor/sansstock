'use client';

import { useState, useEffect, useMemo } from 'react';
import NewsCard from './NewsCardWrapper';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

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
   // Parse categories - memoized untuk avoid re-parsing
   const categories: Category[] = useMemo(() => {
      try {
         if (typeof categoriesProp === 'string') {
            return JSON.parse(categoriesProp) || [];
         } else if (Array.isArray(categoriesProp)) {
            return categoriesProp;
         }
      } catch (error) {
         console.error('Error parsing categories:', error);
      }
      return [];
   }, [categoriesProp]);

   // Set initial active category - use slug for better compatibility
   const initialValue = useMemo(() => {
      if (initialCategoryId && categories.length > 0) {
         const category = categories.find(c => c.id === initialCategoryId);
         if (category) return category.slug;
      }
      if (categories.length > 0) {
         return categories[0].slug;
      }
      return '';
   }, [categories, initialCategoryId]);

   const [activeTab, setActiveTab] = useState<string>(initialValue);
   const [articles, setArticles] = useState<Article[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Get current category ID from active tab
   const activeCategoryId = useMemo(() => {
      const category = categories.find(c => c.slug === activeTab);
      return category?.id || null;
   }, [activeTab, categories]);

   // Fetch articles when category changes
   useEffect(() => {
      if (!activeCategoryId || !activeTab) return;

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
            console.error('Error fetching articles:', err);
            setError(err.message || 'Gagal memuat artikel');
            setArticles([]);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [activeCategoryId, activeTab]);

   // Update activeTab when initialValue changes (hydration fix)
   useEffect(() => {
      if (initialValue && !activeTab) {
         setActiveTab(initialValue);
      }
   }, [initialValue, activeTab]);

   // Don't render if no categories
   if (!categories || categories.length === 0) {
      return null;
   }

   return (
      <section className="mb-16">
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
               <TabsList className="inline-flex h-auto w-full justify-start bg-transparent p-0 space-x-1">
                  {categories.map((category) => (
                     <TabsTrigger
                        key={category.id}
                        value={category.slug}
                        className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                     >
                        {category.name}
                     </TabsTrigger>
                  ))}
               </TabsList>
            </div>

            {/* Articles Grid - One TabsContent per category */}
            {categories.map((category) => (
               <TabsContent key={category.id} value={category.slug} className="mt-0">
                  {loading && activeTab === category.slug ? (
                     <div className="flex items-center justify-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="ml-3 text-gray-600 text-sm sm:text-base">Memuat artikel...</p>
                     </div>
                  ) : error && activeTab === category.slug ? (
                     <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 sm:p-12 text-center">
                        <p className="text-yellow-800 text-sm sm:text-lg mb-2">Error memuat artikel</p>
                        <p className="text-yellow-600 text-xs sm:text-sm">{error}</p>
                     </div>
                  ) : articles.length > 0 && activeTab === category.slug ? (
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
                  ) : activeTab === category.slug ? (
                     <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                        <p className="text-gray-500 text-sm sm:text-lg">Belum ada artikel untuk kategori ini.</p>
                     </div>
                  ) : null}
               </TabsContent>
            ))}
         </Tabs>
      </section>
   );
}
