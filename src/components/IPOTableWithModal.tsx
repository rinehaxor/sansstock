'use client';

import { useState } from 'react';
import IPODetailModal from './IPODetailModal';

interface IPOListing {
   id: number;
   ticker_symbol: string;
   company_name: string;
   ipo_date: string;
   ipo_price: number | null;
   general_sector: string | null;
   specific_sector: string | null;
   shares_offered: number | null;
   total_value: number | null;
   assets_growth_1y: number | null;
   liabilities_growth_1y: number | null;
   revenue_growth_1y: number | null;
   net_income_growth_1y: number | null;
   lead_underwriter: string | null;
   accounting_firm: string | null;
   ipo_performance_metrics?: Array<{
      metric_name: string;
      metric_value: number;
      period_days: number;
   }>;
}

interface IPOTableWithModalProps {
   ipoListings: IPOListing[] | string;
}

export default function IPOTableWithModal({ ipoListings }: IPOTableWithModalProps) {
   // Parse JSON string if needed (from Astro props)
   let parsedListings: IPOListing[] = [];

   try {
      if (typeof ipoListings === 'string') {
         parsedListings = JSON.parse(ipoListings);
      } else if (Array.isArray(ipoListings)) {
         parsedListings = ipoListings;
      }

      // Ensure parsedListings is an array
      if (!Array.isArray(parsedListings)) {
         console.error('ipoListings is not an array:', parsedListings);
         parsedListings = [];
      }
   } catch (error) {
      console.error('Error parsing ipoListings:', error);
      parsedListings = [];
   }

   const [selectedIPO, setSelectedIPO] = useState<IPOListing | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const formatCurrency = (num: number | null | undefined): string => {
      if (num === null || num === undefined) return '-';
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
         maximumFractionDigits: 0,
      }).format(num);
   };

   const formatPercent = (value: number | null | undefined): string => {
      if (value === null || value === undefined || Number.isNaN(value)) {
         return '-';
      }
      return `${Number(value).toFixed(2)}%`;
   };

   const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const handleTickerClick = (ipo: IPOListing) => {
      setSelectedIPO(ipo);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedIPO(null);
   };

   return (
      <>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Perusahaan</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal IPO</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sektor</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga IPO</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performa</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {parsedListings && Array.isArray(parsedListings) && parsedListings.length > 0 ? (
                     parsedListings.map((ipo) => {
                        const metrics = ipo.ipo_performance_metrics || [];
                        const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;

                        return (
                           <tr key={ipo.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                 <button
                                    onClick={() => handleTickerClick(ipo)}
                                    className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg px-3 py-1.5 transition-all duration-200 transform hover:scale-105"
                                    title={`Klik untuk melihat detail ${ipo.ticker_symbol}`}
                                 >
                                    {ipo.ticker_symbol}
                                 </button>
                              </td>
                              <td className="px-4 py-3">
                                 <div className="text-sm font-medium text-gray-900 max-w-xs">{ipo.company_name}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{formatDate(ipo.ipo_date)}</div>
                              </td>
                              <td className="px-4 py-3">
                                 <div className="text-sm text-gray-900">{ipo.general_sector || '-'}</div>
                                 {ipo.specific_sector && <div className="text-xs text-gray-500">{ipo.specific_sector}</div>}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                 <div className="text-sm text-gray-900">{formatCurrency(ipo.ipo_price)}</div>
                              </td>
                              <td className="px-4 py-3">
                                 {latestMetric ? (
                                    <div className="text-sm">
                                       <div className={`font-semibold ${latestMetric.metric_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {latestMetric.metric_value >= 0 ? '+' : ''}
                                          {latestMetric.metric_value.toFixed(2)}%
                                       </div>
                                       <div className="text-xs text-gray-500">
                                          {latestMetric.period_days === 1
                                             ? 'Hari 1'
                                             : latestMetric.period_days === 7
                                             ? 'Minggu 1'
                                             : latestMetric.period_days === 30
                                             ? 'Bulan 1'
                                             : latestMetric.period_days === 365
                                             ? 'Tahun 1'
                                             : `${latestMetric.period_days} hari`}
                                       </div>
                                    </div>
                                 ) : (
                                    <span className="text-sm text-gray-400">-</span>
                                 )}
                              </td>
                           </tr>
                        );
                     })
                  ) : (
                     <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                           Tidak ada data IPO
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         <IPODetailModal ipo={selectedIPO} isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
   );
}
