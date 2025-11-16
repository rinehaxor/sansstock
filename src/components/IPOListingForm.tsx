import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ipoListingSchema, type IPOListingFormData } from '../lib/validation';
import toast from 'react-hot-toast';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Button } from './ui/Button';
import UnderwriterSelectWrapper from './UnderwriterSelectWrapper';

interface PerformanceMetric {
   metric_name: string;
   period_days: number | null;
   metric_value: number | null;
}

interface Underwriter {
   id: number;
   name: string;
}

interface IPOListingFormProps {
   mode: 'create' | 'edit';
   listingId?: number;
   underwriters: Underwriter[];
   initialData?: Partial<IPOListingFormData> & {
      performance_metrics?: PerformanceMetric[];
   };
   onSuccess?: () => void;
}

export default function IPOListingForm({ mode, listingId, underwriters, initialData, onSuccess }: IPOListingFormProps) {
   const [metrics, setMetrics] = React.useState<PerformanceMetric[]>(initialData?.performance_metrics || []);
   const [selectedUnderwriterIds, setSelectedUnderwriterIds] = React.useState<number[]>(initialData?.underwriter_ids || []);
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [underwritersList, setUnderwritersList] = React.useState<Underwriter[]>(underwriters || []);
   const [showAddUnderwriterModal, setShowAddUnderwriterModal] = React.useState(false);
   const [newUnderwriterName, setNewUnderwriterName] = React.useState('');
   const [isAddingUnderwriter, setIsAddingUnderwriter] = React.useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm<IPOListingFormData>({
      resolver: zodResolver(ipoListingSchema),
      defaultValues: {
         ticker_symbol: initialData?.ticker_symbol || '',
         company_name: initialData?.company_name || '',
         ipo_date: initialData?.ipo_date || '',
         general_sector: initialData?.general_sector || '',
         specific_sector: initialData?.specific_sector || '',
         shares_offered: initialData?.shares_offered || null,
         total_value: initialData?.total_value || null,
         ipo_price: initialData?.ipo_price || null,
         assets_growth_1y: initialData?.assets_growth_1y || null,
         liabilities_growth_1y: initialData?.liabilities_growth_1y || null,
         revenue_growth_1y: initialData?.revenue_growth_1y || null,
         net_income_growth_1y: initialData?.net_income_growth_1y || null,
         lead_underwriter: initialData?.lead_underwriter || '',
         accounting_firm: initialData?.accounting_firm || '',
         legal_consultant: initialData?.legal_consultant || '',
         underwriter_ids: selectedUnderwriterIds,
         performance_metrics: [],
      },
   });

   React.useEffect(() => {
      setValue('underwriter_ids', selectedUnderwriterIds);
   }, [selectedUnderwriterIds, setValue]);

   React.useEffect(() => {
      setUnderwritersList(underwriters || []);
   }, [underwriters]);

   // Function to add new underwriter
   const handleAddUnderwriter = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newUnderwriterName.trim()) {
         toast.error('Nama underwriter wajib diisi');
         return;
      }

      setIsAddingUnderwriter(true);
      try {
         const response = await fetch('/api/underwriters', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name: newUnderwriterName.trim() }),
         });

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Gagal menambahkan underwriter' }));
            throw new Error(errorData.error || 'Gagal menambahkan underwriter');
         }

         const result = await response.json();
         const newUnderwriter: Underwriter = result.data;

         // Add to list
         const updatedList = [...underwritersList, newUnderwriter].sort((a, b) => a.name.localeCompare(b.name));
         setUnderwritersList(updatedList);

         // Auto-select the new underwriter
         setSelectedUnderwriterIds((prev) => [...prev, newUnderwriter.id]);

         // Close modal and reset
         setShowAddUnderwriterModal(false);
         setNewUnderwriterName('');
         toast.success(`Underwriter "${newUnderwriter.name}" berhasil ditambahkan dan dipilih`);
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Gagal menambahkan underwriter');
      } finally {
         setIsAddingUnderwriter(false);
      }
   };

   const addMetric = () => {
      setMetrics([
         ...metrics,
         {
            metric_name: 'return',
            period_days: null,
            metric_value: null,
         },
      ]);
   };

   const removeMetric = (index: number) => {
      setMetrics(metrics.filter((_, i) => i !== index));
   };

   const updateMetric = (index: number, field: keyof PerformanceMetric, value: string | number | null) => {
      const updated = [...metrics];
      updated[index] = {
         ...updated[index],
         [field]: value,
      };
      setMetrics(updated);
   };

   const onSubmit = async (data: IPOListingFormData) => {
      setIsSubmitting(true);

      // Get underwriter IDs from hidden input
      const underwriterInput = document.getElementById('underwriterIds') as HTMLInputElement;
      let underwriterIds: number[] = [];
      if (underwriterInput && underwriterInput.value) {
         try {
            underwriterIds = JSON.parse(underwriterInput.value);
         } catch (e) {
            console.error('Error parsing underwriter IDs:', e);
         }
      }

      // Prepare metrics (only include those with valid values)
      const performanceMetrics = metrics
         .filter((m) => m.period_days !== null && m.metric_value !== null)
         .map((m) => ({
            metric_name: m.metric_name || 'return',
            period_days: m.period_days!,
            metric_value: m.metric_value!,
         }));

      const payload = {
         ...data,
         underwriter_ids: underwriterIds,
         performance_metrics: performanceMetrics,
      };

      try {
         const url = mode === 'create' ? '/api/ipo-listings' : `/api/ipo-listings/${listingId}`;
         const method = mode === 'create' ? 'POST' : 'PUT';

         const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
         });

         if (response.ok) {
            toast.success(mode === 'create' ? 'IPO listing berhasil dibuat' : 'IPO listing berhasil diperbarui');
            if (onSuccess) {
               onSuccess();
            } else {
               window.location.href = '/dashboard/ipo-listings';
            }
         } else {
            const error = await response.json().catch(() => null);
            toast.error(error?.error || `Gagal ${mode === 'create' ? 'menyimpan' : 'memperbarui'} IPO listing`);
         }
      } catch (error) {
         toast.error('Terjadi kesalahan saat menyimpan IPO listing');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 space-y-8">
         {/* Informasi Dasar */}
         <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <Label htmlFor="ticker_symbol">
                     Ticker Symbol <span className="text-red-500">*</span>
                  </Label>
                  <Input id="ticker_symbol" {...register('ticker_symbol')} placeholder="Contoh: BBRI" className={errors.ticker_symbol ? 'border-red-500' : ''} style={{ textTransform: 'uppercase' }} />
                  {errors.ticker_symbol && <p className="text-sm text-red-600 mt-1">{errors.ticker_symbol.message}</p>}
               </div>
               <div>
                  <Label htmlFor="ipo_date">
                     Tanggal IPO <span className="text-red-500">*</span>
                  </Label>
                  <Input id="ipo_date" type="date" {...register('ipo_date')} className={errors.ipo_date ? 'border-red-500' : ''} />
                  {errors.ipo_date && <p className="text-sm text-red-600 mt-1">{errors.ipo_date.message}</p>}
               </div>
            </div>

            <div>
               <Label htmlFor="company_name">
                  Nama Perusahaan <span className="text-red-500">*</span>
               </Label>
               <Input id="company_name" {...register('company_name')} placeholder="Nama perusahaan" className={errors.company_name ? 'border-red-500' : ''} />
               {errors.company_name && <p className="text-sm text-red-600 mt-1">{errors.company_name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <Label htmlFor="general_sector">Sektor Umum</Label>
                  <Input id="general_sector" {...register('general_sector')} placeholder="Contoh: Consumer Non-Cyclicals" />
               </div>
               <div>
                  <Label htmlFor="specific_sector">Sektor Spesifik</Label>
                  <Input id="specific_sector" {...register('specific_sector')} placeholder="Contoh: Agricultural Products" />
               </div>
            </div>
         </section>

         {/* Detail Penawaran */}
         <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Detail Penawaran</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <Label htmlFor="shares_offered">Jumlah Saham Ditawarkan</Label>
                  <Input id="shares_offered" type="number" min="0" step="1" {...register('shares_offered', { valueAsNumber: true })} placeholder="Masukkan angka" />
               </div>
               <div>
                  <Label htmlFor="total_value">Total Nilai IPO</Label>
                  <Input id="total_value" type="number" min="0" step="1000" {...register('total_value', { valueAsNumber: true })} placeholder="Contoh: 3500000000" />
               </div>
               <div>
                  <Label htmlFor="ipo_price">Harga IPO per Saham</Label>
                  <Input id="ipo_price" type="number" min="0" step="1" {...register('ipo_price', { valueAsNumber: true })} placeholder="Contoh: 1200" />
               </div>
            </div>
         </section>

         {/* Pertumbuhan Kinerja Keuangan */}
         <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pertumbuhan Kinerja Keuangan (1 Tahun)</h2>
            <p className="text-sm text-gray-500">
               Isi dalam persen (contoh: masukkan <code>25</code> untuk 25%).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <Label htmlFor="assets_growth_1y">Aset (1Y)</Label>
                  <Input id="assets_growth_1y" type="number" step="0.01" {...register('assets_growth_1y', { valueAsNumber: true })} />
               </div>
               <div>
                  <Label htmlFor="liabilities_growth_1y">Liabilitas (1Y)</Label>
                  <Input id="liabilities_growth_1y" type="number" step="0.01" {...register('liabilities_growth_1y', { valueAsNumber: true })} />
               </div>
               <div>
                  <Label htmlFor="revenue_growth_1y">Pendapatan (1Y)</Label>
                  <Input id="revenue_growth_1y" type="number" step="0.01" {...register('revenue_growth_1y', { valueAsNumber: true })} />
               </div>
               <div>
                  <Label htmlFor="net_income_growth_1y">Laba Bersih (1Y)</Label>
                  <Input id="net_income_growth_1y" type="number" step="0.01" {...register('net_income_growth_1y', { valueAsNumber: true })} />
               </div>
            </div>
         </section>

         {/* Profesi Penunjang */}
         <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Profesi Penunjang</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <Label htmlFor="lead_underwriter">Penjamin Pelaksana Emisi</Label>
                  <Input id="lead_underwriter" {...register('lead_underwriter')} placeholder="Nama penjamin pelaksana" />
               </div>
               <div>
                  <Label htmlFor="accounting_firm">Kantor Akuntan Publik</Label>
                  <Input id="accounting_firm" {...register('accounting_firm')} placeholder="Nama KAP" />
               </div>
            </div>
         </section>

         {/* Underwriter */}
         <section className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-900">Underwriter</h2>
               <button type="button" onClick={() => setShowAddUnderwriterModal(true)} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Underwriter Baru
               </button>
            </div>
            <div>
               <Label htmlFor="underwriterIds">Pilih Underwriter (boleh lebih dari satu)</Label>
               <UnderwriterSelectWrapper underwriters={JSON.stringify(underwritersList)} selectedIds={selectedUnderwriterIds} inputId="underwriterIds" />
               <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">Klik dropdown untuk memilih underwriter. Pilih beberapa dengan klik checkbox.</p>
                  {(!underwritersList || underwritersList.length === 0) && (
                     <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                           <strong>Belum ada underwriter!</strong> Silakan tambahkan underwriter terlebih dahulu sebelum menambahkan IPO listing.
                        </p>
                        <button type="button" onClick={() => setShowAddUnderwriterModal(true)} className="mt-2 inline-flex items-center text-sm font-medium text-yellow-900 hover:text-yellow-950 underline">
                           Tambah Underwriter Baru →
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </section>

         {/* Metrik Performa IPO */}
         <section className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-900">Metrik Performa IPO</h2>
               <Button type="button" variant="outline" onClick={addMetric} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Metric
               </Button>
            </div>

            <div className="space-y-3">
               {metrics.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada metrik. Klik "Tambah Metric" untuk menambahkan periode performa.</p>
               ) : (
                  metrics.map((metric, index) => (
                     <div key={index} className="metric-row grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-gray-50 rounded-lg p-3">
                        <div>
                           <Label className="block text-xs font-medium text-gray-600 mb-1">Nama Metric</Label>
                           <Input type="text" value={metric.metric_name || ''} onChange={(e) => updateMetric(index, 'metric_name', e.target.value)} placeholder="return" className="w-full" />
                        </div>
                        <div>
                           <Label className="block text-xs font-medium text-gray-600 mb-1">Periode (hari)</Label>
                           <Input type="number" min="1" value={metric.period_days ?? ''} onChange={(e) => updateMetric(index, 'period_days', e.target.value ? parseInt(e.target.value, 10) : null)} placeholder="30" className="w-full" />
                        </div>
                        <div>
                           <Label className="block text-xs font-medium text-gray-600 mb-1">Nilai (%)</Label>
                           <div className="flex gap-2">
                              <Input
                                 type="number"
                                 step="0.01"
                                 value={metric.metric_value ?? ''}
                                 onChange={(e) => updateMetric(index, 'metric_value', e.target.value ? parseFloat(e.target.value) : null)}
                                 placeholder="0.00"
                                 className="flex-1"
                              />
                              <Button type="button" variant="outline" onClick={() => removeMetric(index)} className="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium">
                                 Hapus
                              </Button>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </section>

         {/* Action Buttons */}
         <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <a href="/dashboard/ipo-listings" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
               Batal
            </a>
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan IPO' : 'Simpan Perubahan'}
            </Button>
         </div>

         {/* Quick Add Underwriter Modal */}
         {showAddUnderwriterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => !isAddingUnderwriter && setShowAddUnderwriterModal(false)}>
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-gray-900">Tambah Underwriter Baru</h3>
                     <button type="button" onClick={() => !isAddingUnderwriter && setShowAddUnderwriterModal(false)} disabled={isAddingUnderwriter} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                  </div>

                  <form onSubmit={handleAddUnderwriter} className="space-y-4">
                     <div>
                        <Label htmlFor="newUnderwriterName">
                           Nama Underwriter <span className="text-red-500">*</span>
                        </Label>
                        <Input id="newUnderwriterName" value={newUnderwriterName} onChange={(e) => setNewUnderwriterName(e.target.value)} placeholder="Contoh: PT BCA Sekuritas" disabled={isAddingUnderwriter} autoFocus />
                        <p className="mt-1 text-xs text-gray-500">Underwriter akan otomatis dipilih setelah ditambahkan</p>
                     </div>

                     <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                           type="button"
                           onClick={() => setShowAddUnderwriterModal(false)}
                           disabled={isAddingUnderwriter}
                           className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Batal
                        </button>
                        <Button type="submit" disabled={isAddingUnderwriter || !newUnderwriterName.trim()}>
                           {isAddingUnderwriter ? 'Menambahkan...' : 'Tambah'}
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </form>
   );
}
