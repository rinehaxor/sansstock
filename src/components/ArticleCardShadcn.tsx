import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ArticleCardProps {
   title: string;
   excerpt: string;
   category: string;
   categoryColor: string;
   timeAgo: string;
   author?: string;
   authorInitials?: string;
   link: string;
   isLarge?: boolean;
   thumbnailUrl?: string | null;
}

export default function ArticleCardShadcn({ title, excerpt, category, categoryColor, timeAgo, author, authorInitials, link, isLarge = false, thumbnailUrl }: ArticleCardProps) {
   return (
      <Card className={`${isLarge ? 'lg:col-span-2' : ''} group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
         {/* Image Header */}
         <div className={`w-full ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'} bg-gradient-to-br ${categoryColor} relative overflow-hidden`}>
            {thumbnailUrl ? (
               <>
                  <img 
                     src={thumbnailUrl} 
                     alt={title}
                     width={isLarge ? 800 : 600}
                     height={isLarge ? 450 : 450}
                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                     loading={isLarge ? 'eager' : 'lazy'}
                     decoding="async"
                     fetchPriority={isLarge ? 'high' : 'low'}
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
               </>
            ) : (
               <>
                  <div className="absolute inset-0 bg-black/20"></div>
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <svg
                        width={isLarge ? '80' : '60'}
                        height={isLarge ? '80' : '60'}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={`text-white/80 ${isLarge ? 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32' : 'w-12 h-12'}`}
                     >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                     </svg>
                  </div>
               </>
            )}
            <div className="absolute top-4 left-4 z-10">
               <Badge className="bg-white text-gray-800 hover:bg-white">{category}</Badge>
            </div>
            <div className="absolute bottom-4 left-4 text-white z-10">
               <p className="text-sm opacity-90">{timeAgo}</p>
            </div>
         </div>

         {/* Content */}
         <CardHeader className={`${isLarge ? 'p-4 sm:p-5 md:p-6 lg:p-6' : 'p-4'}`}>
            <CardTitle className={`${isLarge ? 'text-xl sm:text-2xl md:text-3xl lg:text-3xl mb-3 sm:mb-4' : 'mb-2 text-lg'} leading-tight group-hover:text-blue-600 transition-colors`}>{title}</CardTitle>
            <CardDescription className={`${isLarge ? 'text-sm sm:text-base md:text-lg lg:text-lg' : 'text-sm'} leading-relaxed ${isLarge ? 'mb-4 sm:mb-5' : 'mb-3'}`}>{excerpt}</CardDescription>
         </CardHeader>

         <CardContent className={`${isLarge ? 'p-4 sm:p-5 md:p-6 lg:p-6 pt-0' : 'p-4 pt-0'}`}>
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className={`${isLarge ? 'h-8 w-8' : 'h-6 w-6'} rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600`}>
                     {authorInitials || 'A'}
                  </div>
                  <div>
                     <p className={`${isLarge ? 'text-sm' : 'text-xs'} font-medium`}>{author || 'Tim Editorial'}</p>
                     <p className={`${isLarge ? 'text-xs' : 'text-xs'} text-muted-foreground`}>EmitenHub</p>
                  </div>
               </div>
               <a href={link} className={`text-blue-600 hover:text-blue-700 font-medium ${isLarge ? 'flex items-center group text-sm sm:text-base' : 'text-sm'}`}>
                  {isLarge ? (
                     <>
                        <span className="hidden sm:inline">Baca Selengkapnya</span>
                        <span className="sm:hidden">Baca</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                     </>
                  ) : (
                     'Baca →'
                  )}
               </a>
            </div>
         </CardContent>
      </Card>
   );
}

