import * as React from 'react';
import { Card } from './ui/Card';

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
   const [underwriters, setUnderwriters] = React.useState<Underwriter[]>([]);
   const [selectedUnderwriter, setSelectedUnderwriter] = React.useState<Underwriter | null>(null);
   const [sortBy, setSortBy] = React.useState<'name' | 'total_ipos' | 'avg_performance'>('name');
   const [periodFilter, setPeriodFilter] = React.useState<number | null>(null);

   React.useEffect(() => {
      try {
         const parsed = JSON.parse(underwritersJson);
         setUnderwriters(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
         console.error('Error parsing underwriters:', error);
         setUnderwriters([]);
      }
   }, [underwritersJson]);

   // Sort underwriters
   const sortedUnderwriters = React.useMemo(() => {
      const sorted = [...underwriters];
      switch (sortBy) {
         case 'total_ipos':
            return sorted.sort((a, b) => b.total_ipos - a.total_ipos);
         case 'avg_performance':
            const period = periodFilter || 30;
            return sorted.sort((a, b) => {
               const aAvg = a.performance_by_period[period]?.avg || 0;
               const bAvg = b.performance_by_period[period]?.avg || 0;
               return bAvg - aAvg;
            });
         default:
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
      }
   }, [underwriters, sortBy, periodFilter]);

   // Get available periods from all underwriters
   const availablePeriods = React.useMemo(() => {
      const periods = new Set<number>();
      underwriters.forEach((u) => {
         Object.keys(u.performance_by_period).forEach((p) => periods.add(parseInt(p)));
      });
      return Array.from(periods).sort((a, b) => a - b);
   }, [underwriters]);

   return (
      <div className="space-y-6">
         {/* Filters */}
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan berdasarkan</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                     <option value="name">Nama</option>
                     <option value="total_ipos">Total IPO</option>
                     <option value="avg_performance">Rata-rata Performa</option>
                  </select>
               </div>
               {sortBy === 'avg_performance' && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
                     <select
                        value={periodFilter || ''}
                        onChange={(e) => setPeriodFilter(e.target.value ? parseInt(e.target.value) : null)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
         </div>

         {/* Underwriters Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedUnderwriters.map((underwriter) => (
               <Card key={underwriter.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedUnderwriter(underwriter)}>
                  <div className="space-y-3">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900">{underwriter.name}</h3>
                        <p className="text-sm text-gray-500">Total IPO: {underwriter.total_ipos}</p>
                     </div>

                     {/* Performance Summary */}
                     <div className="space-y-2">
                        {availablePeriods.slice(0, 3).map((period) => {
                           const perf = underwriter.performance_by_period[period];
                           if (!perf) return null;

                           return (
                              <div key={period} className="flex justify-between items-center text-sm">
                                 <span className="text-gray-600">{getPeriodLabel(period)}:</span>
                                 <span className={`font-medium ${perf.avg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentage(perf.avg)}</span>
                              </div>
                           );
                        })}
                     </div>

                     <button className="w-full mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">Lihat Detail →</button>
                  </div>
               </Card>
            ))}
         </div>

         {/* Detail Modal */}
         {selectedUnderwriter && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h2 className="text-2xl font-bold text-gray-900">{selectedUnderwriter.name}</h2>
                           <p className="text-sm text-gray-500 mt-1">Total IPO: {selectedUnderwriter.total_ipos}</p>
                        </div>
                        <button onClick={() => setSelectedUnderwriter(null)} className="text-gray-400 hover:text-gray-600">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                        </button>
                     </div>

                     {/* Performance Table */}
                     <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Rata-rata Performa</h3>
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                 <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rata-rata</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                 </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                 {availablePeriods.map((period) => {
                                    const perf = selectedUnderwriter.performance_by_period[period];
                                    if (!perf) return null;

                                    return (
                                       <tr key={period}>
                                          <td className="px-4 py-3 text-sm text-gray-900">{getPeriodLabel(period)}</td>
                                          <td className={`px-4 py-3 text-sm font-medium ${perf.avg >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentage(perf.avg)}</td>
                                          <td className={`px-4 py-3 text-sm ${perf.min >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentage(perf.min)}</td>
                                          <td className={`px-4 py-3 text-sm ${perf.max >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentage(perf.max)}</td>
                                          <td className="px-4 py-3 text-sm text-gray-500">{perf.count}</td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     {/* IPO Listings */}
                     <div>
                        <h3 className="text-lg font-semibold mb-3">Daftar IPO</h3>
                        <div className="space-y-2">
                           {selectedUnderwriter.ipo_listings.map((ipo) => (
                              <div key={ipo.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <div className="font-medium text-gray-900">
                                          {ipo.ticker_symbol} - {ipo.company_name}
                                       </div>
                                       <div className="text-sm text-gray-500">
                                          {new Date(ipo.ipo_date).toLocaleDateString('id-ID', {
                                             year: 'numeric',
                                             month: 'long',
                                             day: 'numeric',
                                          })}
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       {ipo.ipo_performance_metrics && ipo.ipo_performance_metrics.length > 0 && (
                                          <div className="space-y-1">
                                             {ipo.ipo_performance_metrics.slice(0, 3).map((metric, idx) => (
                                                <div key={idx} className={`text-xs ${metric.metric_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                   {getPeriodLabel(metric.period_days)}: {formatPercentage(metric.metric_value)}
                                                </div>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
