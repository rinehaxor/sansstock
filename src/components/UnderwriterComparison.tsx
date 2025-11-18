'use client';

import { useState, useEffect, useMemo } from 'react';

interface Underwriter {
   id: number;
   name: string;
}

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
   underwriters?: Array<{
      id: number;
      name: string;
   }>;
}

interface CombinedPerformance {
   total_ipos: number;
   performance_by_period: Record<number, {
      avg: number;
      min: number;
      max: number;
      count: number;
   }>;
   ipo_listings: IPOListing[];
}

interface UnderwriterComparisonProps {
   underwriters: string; // JSON string from Astro
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

function getPerformanceRating(avg: number): { label: string; color: string; bgColor: string; description: string } {
   if (avg >= 30) {
      return {
         label: 'Sangat Bagus',
         color: 'text-green-700',
         bgColor: 'bg-green-100',
         description: 'Performa sangat baik, rata-rata return di atas 30%'
      };
   } else if (avg >= 15) {
      return {
         label: 'Bagus',
         color: 'text-green-600',
         bgColor: 'bg-green-50',
         description: 'Performa baik, rata-rata return di atas 15%'
      };
   } else if (avg >= 5) {
      return {
         label: 'Cukup',
         color: 'text-yellow-600',
         bgColor: 'bg-yellow-50',
         description: 'Performa cukup, rata-rata return di atas 5%'
      };
   } else if (avg >= 0) {
      return {
         label: 'Rendah',
         color: 'text-orange-600',
         bgColor: 'bg-orange-50',
         description: 'Performa rendah, rata-rata return positif tapi kecil'
      };
   } else {
      return {
         label: 'Buruk',
         color: 'text-red-600',
         bgColor: 'bg-red-50',
         description: 'Performa buruk, rata-rata return negatif'
      };
   }
}

export default function UnderwriterComparison({ underwriters: underwritersJson }: UnderwriterComparisonProps) {
   const [underwritersList, setUnderwritersList] = useState<Underwriter[]>([]);
   const [selectedUnderwriters, setSelectedUnderwriters] = useState<number[]>([]);
   const [numberOfSlots, setNumberOfSlots] = useState<number>(1); // Start with 1 slot
   const [loading, setLoading] = useState(false);
   const [combinedPerformance, setCombinedPerformance] = useState<CombinedPerformance | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [selectedIpoForModal, setSelectedIpoForModal] = useState<IPOListing | null>(null);

   useEffect(() => {
      try {
         const parsed = JSON.parse(underwritersJson);
         setUnderwritersList(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
         console.error('Error parsing underwriters:', error);
         setUnderwritersList([]);
      }
   }, [underwritersJson]);

   const fetchCombinedPerformance = async (underwriterIds: number[]) => {
      if (underwriterIds.length === 0) {
         setCombinedPerformance(null);
         return;
      }

      setLoading(true);
      setError(null);

      try {
         // Fetch all IPOs for each underwriter
         const ipoPromises = underwriterIds.map(async (id) => {
            const response = await fetch(`/api/underwriters/${id}?include_ipos=true`);
            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.error || 'Failed to fetch underwriter data');
            }
            const result = await response.json();
            return result.data;
         });

         const underwriterData = await Promise.all(ipoPromises);

         // Calculate average performance for each underwriter by period
         const performanceByUnderwriter: Array<Record<number, number>> = [];
         const allIpoListings: IPOListing[] = [];
         const ipoUnderwriterMap = new Map<number, Array<{ id: number; name: string }>>();

         underwriterData.forEach((uw: any) => {
            const ipoUnderwriters = uw.ipo_underwriters || [];
            const ipoListings = ipoUnderwriters
               .map((item: any) => item.ipo_listing)
               .filter((item: any) => item !== null);
            
            // Collect all IPO listings and map underwriters
            ipoListings.forEach((ipo: any) => {
               if (ipo && ipo.id) {
                  if (!ipoUnderwriterMap.has(ipo.id)) {
                     ipoUnderwriterMap.set(ipo.id, []);
                  }
                  // Add this underwriter to the IPO's underwriter list
                  const existing = ipoUnderwriterMap.get(ipo.id)!;
                  if (!existing.find(u => u.id === uw.id)) {
                     existing.push({ id: uw.id, name: uw.name });
                  }
               }
            });
            
            allIpoListings.push(...ipoListings);

            // Calculate average performance for this underwriter
            const allMetrics: PerformanceMetric[] = [];
            ipoListings.forEach((ipo: IPOListing) => {
               const metrics = ipo.ipo_performance_metrics || [];
               allMetrics.push(...metrics);
            });

            // Group metrics by period_days
            const metricsByPeriod: Record<number, number[]> = {};
            allMetrics.forEach((metric) => {
               if (metric.period_days && metric.metric_value !== null) {
                  if (!metricsByPeriod[metric.period_days]) {
                     metricsByPeriod[metric.period_days] = [];
                  }
                  metricsByPeriod[metric.period_days].push(metric.metric_value);
               }
            });

            // Calculate average for each period for this underwriter
            const avgByPeriod: Record<number, number> = {};
            Object.keys(metricsByPeriod).forEach((period) => {
               const values = metricsByPeriod[parseInt(period)];
               const avg = values.reduce((a, b) => a + b, 0) / values.length;
               avgByPeriod[parseInt(period)] = parseFloat(avg.toFixed(2));
            });

            performanceByUnderwriter.push(avgByPeriod);
         });

         // Combine performances: average of averages
         // Get all unique periods from all underwriters
         const allPeriods = new Set<number>();
         performanceByUnderwriter.forEach((perf) => {
            Object.keys(perf).forEach((period) => allPeriods.add(parseInt(period)));
         });

         // Calculate combined average: (avg1 + avg2 + ...) / count
         const combinedPerformanceByPeriod: Record<number, { avg: number; min: number; max: number; count: number }> = {};
         
         allPeriods.forEach((period) => {
            const averages: number[] = [];
            const allValues: number[] = [];

            // Get average for each underwriter for this period
            performanceByUnderwriter.forEach((perf) => {
               if (perf[period] !== undefined) {
                  averages.push(perf[period]);
               }
            });

            // Get all individual values for min/max calculation
            underwriterData.forEach((uw: any) => {
               const ipoUnderwriters = uw.ipo_underwriters || [];
               ipoUnderwriters.forEach((item: any) => {
                  const metrics = item.ipo_listing?.ipo_performance_metrics || [];
                  metrics.forEach((metric: PerformanceMetric) => {
                     if (metric.period_days === period && metric.metric_value !== null) {
                        allValues.push(metric.metric_value);
                     }
                  });
               });
            });

            if (averages.length > 0) {
               // Combined average = average of individual underwriter averages
               const combinedAvg = averages.reduce((a, b) => a + b, 0) / averages.length;
               
               combinedPerformanceByPeriod[period] = {
                  avg: parseFloat(combinedAvg.toFixed(2)),
                  min: allValues.length > 0 ? Math.min(...allValues) : 0,
                  max: allValues.length > 0 ? Math.max(...allValues) : 0,
                  count: allValues.length,
               };
            }
         });

         // Get unique IPO IDs
         const uniqueIpoIds = Array.from(new Set(allIpoListings.map((ipo) => ipo.id).filter(Boolean)));
         
         // Fetch complete IPO data with all underwriters
         let completeIpoListings: IPOListing[] = [];
         if (uniqueIpoIds.length > 0) {
            const ipoIdsString = uniqueIpoIds.join(',');
            const ipoResponse = await fetch(`/api/ipo-listings?ids=${ipoIdsString}`);
            if (ipoResponse.ok) {
               const ipoResult = await ipoResponse.json();
               completeIpoListings = (ipoResult.data || []).map((ipo: any) => ({
                  id: ipo.id,
                  ticker_symbol: ipo.ticker_symbol,
                  company_name: ipo.company_name,
                  ipo_date: ipo.ipo_date,
                  ipo_price: ipo.ipo_price,
                  ipo_performance_metrics: ipo.ipo_performance_metrics || [],
                  underwriters: (ipo.ipo_underwriters || [])
                     .map((item: any) => item.underwriter)
                     .filter((uw: any) => uw && uw.id && uw.name)
                     .map((uw: any) => ({ id: uw.id, name: uw.name }))
               }));
            }
         }
         
         // Fallback to original data if fetch failed
         const uniqueIpoListings = completeIpoListings.length > 0 
            ? completeIpoListings
            : Array.from(
                 new Map(allIpoListings.map((ipo) => [ipo.id, ipo])).values()
              ).map((ipo) => ({
                 ...ipo,
                 underwriters: ipoUnderwriterMap.get(ipo.id) || []
              }));

         setCombinedPerformance({
            total_ipos: uniqueIpoListings.length,
            performance_by_period: combinedPerformanceByPeriod,
            ipo_listings: uniqueIpoListings
         });
      } catch (err) {
         console.error('Error fetching combined performance:', err);
         setError('Gagal memuat data performa. Silakan coba lagi.');
      } finally {
         setLoading(false);
      }
   };

   const handleUnderwriterChange = (index: number, value: string) => {
      const newSelected = [...selectedUnderwriters];
      const selectedId = value ? parseInt(value) : null;

      // Ensure array is long enough for all slots
      while (newSelected.length < numberOfSlots) {
         newSelected.push(0);
      }

      if (selectedId) {
         newSelected[index] = selectedId;
      } else {
         newSelected[index] = 0; // Use 0 as placeholder for empty
      }

      // Remove duplicates: if selectedId already exists elsewhere, clear that slot
      if (selectedId) {
         for (let i = 0; i < newSelected.length; i++) {
            if (i !== index && newSelected[i] === selectedId) {
               newSelected[i] = 0;
            }
         }
      }

      setSelectedUnderwriters(newSelected);
      
      // Get active (non-zero) selected underwriters for calculation
      const activeSelected = newSelected.filter(id => id > 0);
      
      if (activeSelected.length > 0) {
         fetchCombinedPerformance(activeSelected);
      } else {
         setCombinedPerformance(null);
      }
   };

   const addUnderwriterSlot = () => {
      setNumberOfSlots(prev => prev + 1);
   };

   const removeUnderwriterSlot = (index: number) => {
      // Create new array without the slot at this index
      const newSelected: number[] = [];
      for (let i = 0; i < selectedUnderwriters.length; i++) {
         if (i < index) {
            newSelected[i] = selectedUnderwriters[i] || 0;
         } else if (i > index) {
            newSelected[i - 1] = selectedUnderwriters[i] || 0;
         }
         // Skip index (the one being removed)
      }
      
      setSelectedUnderwriters(newSelected);
      
      // Reduce number of slots
      if (numberOfSlots > 1) {
         setNumberOfSlots(prev => prev - 1);
      }
      
      // Recalculate performance if there are still selected underwriters
      const activeSelected = newSelected.filter(id => id > 0);
      if (activeSelected.length > 0) {
         fetchCombinedPerformance(activeSelected);
      } else {
         setCombinedPerformance(null);
      }
   };

   const removeUnderwriter = (index: number) => {
      const newSelected = [...selectedUnderwriters];
      // Ensure array is long enough
      while (newSelected.length <= index) {
         newSelected.push(0);
      }
      newSelected[index] = 0; // Clear this slot
      
      setSelectedUnderwriters(newSelected);
      
      // Get active selected underwriters
      const activeSelected = newSelected.filter(id => id > 0);
      
      // If no more selected, reset to 1 slot
      if (activeSelected.length === 0 && numberOfSlots > 1) {
         setNumberOfSlots(1);
         setSelectedUnderwriters([]);
      }
      
      if (activeSelected.length > 0) {
         fetchCombinedPerformance(activeSelected);
      } else {
         setCombinedPerformance(null);
      }
   };

   const availablePeriods = useMemo(() => {
      if (!combinedPerformance) return [];
      return Object.keys(combinedPerformance.performance_by_period)
         .map(p => parseInt(p))
         .sort((a, b) => a - b);
   }, [combinedPerformance]);

   const overallRating = useMemo(() => {
      if (!combinedPerformance || availablePeriods.length === 0) return null;
      
      // Use first available period for overall rating (usually day 1 or week 1)
      const firstPeriod = availablePeriods[0];
      const perf = combinedPerformance.performance_by_period[firstPeriod];
      if (!perf) return null;
      
      return getPerformanceRating(perf.avg);
   }, [combinedPerformance, availablePeriods]);

   return (
      <div className="space-y-6">
         {/* Underwriter Selection */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-gray-900">Pilih Underwriter</h2>
               <button
                  onClick={addUnderwriterSlot}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                  disabled={loading}
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Underwriter
               </button>
            </div>
            
            <div className="space-y-4">
               {Array.from({ length: numberOfSlots }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                     <label className="w-32 text-sm font-medium text-gray-700">
                        Underwriter {index + 1}:
                     </label>
                     <select
                        value={selectedUnderwriters[index] || ''}
                        onChange={(e) => handleUnderwriterChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                     >
                        <option value="">-- Pilih Underwriter --</option>
                        {underwritersList
                           .filter(uw => !selectedUnderwriters.includes(uw.id) || selectedUnderwriters[index] === uw.id)
                           .map((uw) => (
                              <option key={uw.id} value={uw.id}>
                                 {uw.name}
                              </option>
                           ))}
                     </select>
                     {selectedUnderwriters[index] ? (
                        <button
                           onClick={() => removeUnderwriter(index)}
                           className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                           title="Hapus underwriter ini"
                        >
                           Hapus
                        </button>
                     ) : numberOfSlots > 1 ? (
                        <button
                           onClick={() => removeUnderwriterSlot(index)}
                           className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                           title="Hapus slot ini"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     ) : null}
                  </div>
               ))}
            </div>

            {selectedUnderwriters.length > 0 && (
               <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                     <strong>Underwriter yang dipilih:</strong>{' '}
                     {selectedUnderwriters.map((id) => {
                        const uw = underwritersList.find(u => u.id === id);
                        return uw?.name;
                     }).filter(Boolean).join(', ')}
                  </p>
               </div>
            )}
         </div>

         {/* Loading State */}
         {loading && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               <p className="text-gray-600 text-lg mt-4">Memuat data performa...</p>
            </div>
         )}

         {/* Error State */}
         {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
               <p className="text-red-800">{error}</p>
            </div>
         )}

         {/* Results */}
         {!loading && !error && combinedPerformance && (
            <>
               {/* Summary Cards */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                     <div className="text-sm font-medium text-gray-500 mb-1">Total IPO</div>
                     <div className="text-3xl font-bold text-gray-900">{combinedPerformance.total_ipos}</div>
                     <div className="text-xs text-gray-500 mt-1">Semua IPO dari underwriter yang dipilih</div>
                  </div>

                  {availablePeriods.length > 0 && (() => {
                     const firstPeriod = availablePeriods[0];
                     const firstPerf = combinedPerformance.performance_by_period[firstPeriod];
                     return firstPerf ? (
                        <>
                           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                              <div className="text-sm font-medium text-gray-500 mb-1">Rata-rata Performa</div>
                              <div className={`text-3xl font-bold ${firstPerf.avg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                 {firstPerf.avg >= 0 ? '+' : ''}{firstPerf.avg.toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                 {getPeriodLabel(firstPeriod)}
                              </div>
                           </div>

                           {overallRating && (
                              <div className={`rounded-xl p-6 border-2 ${overallRating.bgColor} border-gray-200 shadow-sm`}>
                                 <div className="text-sm font-medium text-gray-500 mb-1">Rating Performa</div>
                                 <div className={`text-2xl font-bold ${overallRating.color} mb-1`}>
                                    {overallRating.label}
                                 </div>
                                 <div className="text-xs text-gray-600">
                                    {overallRating.description}
                                 </div>
                              </div>
                           )}

                           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                              <div className="text-sm font-medium text-gray-500 mb-1">Periode Tersedia</div>
                              <div className="text-3xl font-bold text-gray-900">{availablePeriods.length}</div>
                              <div className="text-xs text-gray-500 mt-1">Periode analisis</div>
                           </div>
                        </>
                     ) : null;
                  })()}
               </div>

               {/* Performance Table */}
               {availablePeriods.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                     <h2 className="text-xl font-bold text-gray-900 mb-4">Rincian Performa per Periode</h2>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maksimum</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Data</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                              {availablePeriods.map((period) => {
                                 const perf = combinedPerformance.performance_by_period[period];
                                 if (!perf) return null;

                                 const rating = getPerformanceRating(perf.avg);

                                 return (
                                    <tr key={period} className="hover:bg-gray-50">
                                       <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {getPeriodLabel(period)}
                                       </td>
                                       <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${perf.avg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {perf.avg >= 0 ? '+' : ''}{perf.avg.toFixed(2)}%
                                       </td>
                                       <td className={`px-4 py-3 whitespace-nowrap text-sm ${perf.min >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {perf.min >= 0 ? '+' : ''}{perf.min.toFixed(2)}%
                                       </td>
                                       <td className={`px-4 py-3 whitespace-nowrap text-sm ${perf.max >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {perf.max >= 0 ? '+' : ''}{perf.max.toFixed(2)}%
                                       </td>
                                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                          {perf.count} IPO
                                       </td>
                                       <td className="px-4 py-3 whitespace-nowrap">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rating.bgColor} ${rating.color}`}>
                                             {rating.label}
                                          </span>
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* IPO Listings */}
               {combinedPerformance.ipo_listings.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                     <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Daftar IPO dari Semua Underwriter ({combinedPerformance.ipo_listings.length})
                     </h2>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Perusahaan</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal IPO</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga IPO</th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Underwriter</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                              {combinedPerformance.ipo_listings
                                 .sort((a, b) => new Date(b.ipo_date).getTime() - new Date(a.ipo_date).getTime())
                                 .map((ipo) => {
                                    const underwriters = ipo.underwriters || [];
                                    const hasMultipleUnderwriters = underwriters.length > 1;
                                    
                                    return (
                                       <tr key={ipo.id} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                             {ipo.ticker_symbol}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900">{ipo.company_name}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                             {new Date(ipo.ipo_date).toLocaleDateString('id-ID')}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                             {ipo.ipo_price ? `Rp ${ipo.ipo_price.toLocaleString('id-ID')}` : '-'}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-600">
                                             {underwriters.length === 0 ? (
                                                <span className="text-gray-400">-</span>
                                             ) : underwriters.length === 1 ? (
                                                <span>{underwriters[0].name}</span>
                                             ) : (
                                                <div className="flex items-center gap-2">
                                                   <span>{underwriters[0].name}</span>
                                                   <button
                                                      onClick={() => setSelectedIpoForModal(ipo)}
                                                      className="text-blue-600 hover:text-blue-700 text-xs font-medium underline"
                                                   >
                                                      +{underwriters.length - 1} lainnya
                                                   </button>
                                                </div>
                                             )}
                                          </td>
                                       </tr>
                                    );
                                 })}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {combinedPerformance.total_ipos === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                     <p className="text-yellow-800">
                        Tidak ada data IPO untuk underwriter yang dipilih.
                     </p>
                  </div>
               )}
            </>
         )}

         {/* Empty State */}
         {!loading && !error && !combinedPerformance && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
               <p className="mt-4 text-gray-600">Klik "Tambah Underwriter" dan pilih underwriter untuk melihat analisis performa gabungan</p>
            </div>
         )}

         {/* Modal for Underwriter Details */}
         {selectedIpoForModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedIpoForModal(null)}>
               <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-bold text-gray-900">
                        Underwriter - {selectedIpoForModal.ticker_symbol}
                     </h3>
                     <button
                        onClick={() => setSelectedIpoForModal(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                     >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  </div>
                  
                  <div className="mb-4">
                     <p className="text-sm text-gray-600 mb-2">{selectedIpoForModal.company_name}</p>
                     <p className="text-xs text-gray-500">
                        Tanggal IPO: {new Date(selectedIpoForModal.ipo_date).toLocaleDateString('id-ID')}
                     </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                     <h4 className="text-sm font-semibold text-gray-700 mb-3">Daftar Underwriter:</h4>
                     <ul className="space-y-2">
                        {selectedIpoForModal.underwriters && selectedIpoForModal.underwriters.length > 0 ? (
                           selectedIpoForModal.underwriters.map((uw, index) => (
                              <li key={uw.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                                 </div>
                                 <span className="text-sm text-gray-900">{uw.name}</span>
                              </li>
                           ))
                        ) : (
                           <li className="text-sm text-gray-400">Tidak ada data underwriter</li>
                        )}
                     </ul>
                  </div>

                  <div className="mt-6 flex justify-end">
                     <button
                        onClick={() => setSelectedIpoForModal(null)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                     >
                        Tutup
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

