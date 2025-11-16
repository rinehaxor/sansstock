import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { underwriterSchema, type UnderwriterFormData } from '../lib/validation';
import toast from 'react-hot-toast';

interface UnderwriterFormProps {
   mode?: 'create' | 'edit';
   underwriterId?: number;
   initialData?: {
      name: string;
   };
   onSuccess?: () => void;
}

export default function UnderwriterForm({ mode = 'create', underwriterId, initialData, onSuccess }: UnderwriterFormProps) {
   const [isSubmitting, setIsSubmitting] = React.useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<UnderwriterFormData>({
      resolver: zodResolver(underwriterSchema),
      defaultValues: initialData || {
         name: '',
      },
   });

   const onSubmit = async (data: UnderwriterFormData) => {
      setIsSubmitting(true);

      try {
         const url = mode === 'create' ? '/api/underwriters' : `/api/underwriters/${underwriterId}`;
         const method = mode === 'create' ? 'POST' : 'PUT';

         const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
         });

         if (response.ok) {
            toast.success(mode === 'create' ? 'Underwriter berhasil ditambahkan' : 'Underwriter berhasil diupdate');
            if (onSuccess) {
               onSuccess();
            } else {
               window.location.href = '/dashboard/underwriters';
            }
         } else {
            const error = await response.json().catch(() => null);
            toast.error(error?.error || `Gagal ${mode === 'create' ? 'menyimpan' : 'mengupdate'} underwriter`);
         }
      } catch (error) {
         toast.error(`Terjadi kesalahan saat ${mode === 'create' ? 'menyimpan' : 'mengupdate'} underwriter`);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 space-y-6">
         <section className="space-y-4">
            <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Underwriter <span className="text-red-500">*</span>
               </label>
               <input
                  id="name"
                  type="text"
                  placeholder="Contoh: Bank Mandiri Sekuritas"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                     errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('name')}
               />
               {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
               <p className="mt-1 text-xs text-gray-500">Masukkan nama lengkap underwriter</p>
            </div>
         </section>

         <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <a
               href="/dashboard/underwriters"
               className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
               Batal
            </a>
            <button
               type="submit"
               disabled={isSubmitting}
               className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan Underwriter' : 'Simpan Perubahan'}
            </button>
         </div>
      </form>
   );
}

