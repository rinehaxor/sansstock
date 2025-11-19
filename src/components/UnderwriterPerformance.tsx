'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface PerformanceMetric {
   metric_name: string;
   metric_value: number;
   period_days: number;
}

interface IPOListing {
   id: number;
   ticker_symbol: string;
   company_name: string;
   ipo_date: string;
   ipo_price?: number;
   ipo_performance_metrics?: PerformanceMetric[];
}

interface Underwriter {
   id: number;
   name: string;
   total_ipos: number;
   performance_by_period: Record<number, { avg: number; min: number; max: number; count: number }>;
   ipo_listings: IPOListing[];
}

interface UnderwriterPerformanceProps {
   underwriters: string; // JSON string from Astro
}

function formatPercentage(value: number): string {
   const sign = value >= 0 ? '+' : '';
   return `${sign}${value.toFixed(2)}%`;
}

function getPeriodLabel(periodDays: number): string {
   if (periodDays === 1) return 'Hari 1';
   if (periodDays === 7) return 'Minggu 1';
   if (periodDays === 30) return 'Bulan 1';
   if (periodDays === 90) return 'Bulan 3';
   if (periodDays === 180) return 'Bulan 6';
   if (periodDays === 365) return 'Tahun 1';
   return `${periodDays} hari`;
}

export default function UnderwriterPerformance({ underwriters: underwritersJson }: UnderwriterPerformanceProps) {
   // Parse underwriters - memoized untuk avoid re-parsing
   const underwriters: Underwriter[] = useMemo(() => {
      try {
         if (typeof underwritersJson === 'string') {
            return JSON.parse(underwritersJson) || [];
         } else if (Array.isArray(underwritersJson)) {
            return underwritersJson;
         }
      } catch (error) {
         console.error('Error parsing underwriters:', error);
      }
      return [];
   }, [underwritersJson]);

   const [sortBy, setSortBy] = useState<'name' | 'total_ipos' | 'avg_performance'>('total_ipos');
   const [periodFilter, setPeriodFilter] = useState<number | null>(null);
   const [searchQuery, setSearchQuery] = useState('');

   // Get available periods from all underwriters - memoized
   const availablePeriods: number[] = useMemo(() => {
      const periodSet = new Set<number>();
      underwriters.forEach((u) => {
         Object.keys(u.performance_by_period).forEach((p) => periodSet.add(parseInt(p)));
      });
      return Array.from(periodSet).sort((a, b) => a - b);
   }, [underwriters]);

   // Filter and sort underwriters - memoized
   const sortedUnderwriters = useMemo(() => {
      let filtered = [...underwriters];

      // Filter by search query
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase().trim();
         filtered = filtered.filter((u) => u.name.toLowerCase().includes(query));
      }

      // Sort
      if (sortBy === 'total_ipos') {
         filtered.sort((a, b) => b.total_ipos - a.total_ipos);
      } else if (sortBy === 'avg_performance') {
         const period = periodFilter || 30;
         filtered.sort((a, b) => {
            const aAvg = a.performance_by_period[period]?.avg || 0;
            const bAvg = b.performance_by_period[period]?.avg || 0;
            return bAvg - aAvg;
         });
      } else {
         filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      return filtered;
   }, [underwriters, searchQuery, sortBy, periodFilter]);

   // Calculate column span for table cells
   const colSpan = 2 + Math.min(availablePeriods.length, 4) + 1;

   // Render period cells for a row
   const renderPeriodCells = (underwriter: Underwriter) => {
      if (availablePeriods.length === 0) return null;

      return availablePeriods.slice(0, 4).map((period) => {
         const perf = underwriter.performance_by_period[period];
         if (!perf) {
            return (
               <TableCell key={period} className="px-2 sm:px-3 py-4 text-center">
                  <span className="text-xs sm:text-sm text-gray-400">-</span>
               </TableCell>
            );
         }
         const avgColor = perf.avg >= 0 ? 'text-green-600' : 'text-red-600';
         const minColor = perf.min >= 0 ? 'text-green-600' : 'text-red-600';
         const maxColor = perf.max >= 0 ? 'text-green-600' : 'text-red-600';

         return (
            <TableCell key={period} className="px-2 sm:px-3 py-4 text-center">
               <div className="flex flex-col gap-0.5">
                  <div className={`text-sm sm:text-base font-semibold ${avgColor} whitespace-nowrap`}>{formatPercentage(perf.avg)}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
                     <span className={minColor}>Min: {formatPercentage(perf.min)}</span>
                     <span className="mx-1 text-gray-400">|</span>
                     <span className={maxColor}>Max: {formatPercentage(perf.max)}</span>
                  </div>
               </div>
            </TableCell>
         );
      });
   };

   return (
      <div className="space-y-6">
         {/* Filters */}
         <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
               {/* Search */}
               <div className="flex-1 w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cari Underwriter</label>
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Cari nama underwriter..."
                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
               </div>
               {/* Sort */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan berdasarkan</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white">
                     <option value="name">Nama</option>
                     <option value="total_ipos">Total IPO</option>
                     <option value="avg_performance">Rata-rata Performa</option>
                  </select>
               </div>
               {sortBy === 'avg_performance' && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                     <select
                        value={periodFilter || ''}
                        onChange={(e) => setPeriodFilter(e.target.value ? parseInt(e.target.value) : null)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                     >
                        <option value="">Semua Periode</option>
                        {availablePeriods.map((period) => (
                           <option key={period} value={period}>
                              {getPeriodLabel(period)}
                           </option>
                        ))}
                     </select>
                  </div>
               )}
            </div>
            {searchQuery && (
               <div className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                     Menampilkan <span className="font-semibold">{sortedUnderwriters.length}</span> dari <span className="font-semibold">{underwriters.length}</span> underwriter
                  </div>
               </div>
            )}
         </div>

         {/* Underwriters Table */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Underwriter</TableHead>
                     <TableHead className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Total IPO</TableHead>
                     {availablePeriods.length > 0 &&
                        availablePeriods.slice(0, 4).map((period) => (
                           <TableHead key={period} className="px-2 sm:px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                              {getPeriodLabel(period)}
                           </TableHead>
                        ))}
                     <TableHead className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {sortedUnderwriters.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={colSpan} className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
                           {searchQuery ? 'Tidak ada underwriter yang ditemukan' : 'Belum ada data underwriter'}
                        </TableCell>
                     </TableRow>
                  ) : (
                     sortedUnderwriters.map((underwriter) => (
                        <TableRow key={underwriter.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => (window.location.href = `/underwriters/${underwriter.id}`)}>
                           <TableCell className="px-3 sm:px-4 py-4">
                              <div className="text-sm sm:text-base font-semibold text-gray-900">{underwriter.name}</div>
                           </TableCell>
                           <TableCell className="px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800">{underwriter.total_ipos} IPO</span>
                           </TableCell>
                           {renderPeriodCells(underwriter)}
                           <TableCell className="px-3 sm:px-4 py-4 whitespace-nowrap text-center">
                              <a href={`/underwriters/${underwriter.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800">
                                 <span className="hidden sm:inline">Lihat Detail</span>
                                 <span className="sm:hidden">Detail</span>
                                 <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                 </svg>
                              </a>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
