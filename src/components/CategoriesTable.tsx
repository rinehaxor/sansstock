import * as React from 'react';
import { DataTable, type Column } from './DataTable';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Category {
   id: number;
   name: string;
   slug: string;
   description?: string;
   created_at: string;
   updated_at: string;
}

interface CategoriesTableProps {
   categories: string; // JSON string from Astro
   categoryUsage: string; // JSON string from Astro
}

async function deleteCategory(id: number, usageCount: number) {
   if (usageCount > 0) {
      alert(`Kategori ini digunakan di ${usageCount} artikel. Hapus kategori dari artikel terlebih dahulu sebelum menghapus kategori.`);
      return;
   }

   if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
   }

   try {
      const response = await fetch(`/api/categories/${id}`, {
         method: 'DELETE',
         credentials: 'include',
      });

      if (response.ok) {
         alert('Kategori berhasil dihapus');
         window.location.reload();
      } else {
         const error = await response.json();
         alert('Error: ' + (error.error || 'Gagal menghapus kategori'));
      }
   } catch (error) {
      alert('Error: Gagal menghapus kategori');
   }
}

export default function CategoriesTable({ categories: categoriesJson, categoryUsage: categoryUsageJson }: CategoriesTableProps) {
   // Parse JSON strings from Astro props
   const categories: Category[] = React.useMemo(() => {
      try {
         return JSON.parse(categoriesJson || '[]');
      } catch {
         return [];
      }
   }, [categoriesJson]);

   const categoryUsage: Record<number, number> = React.useMemo(() => {
      try {
         return JSON.parse(categoryUsageJson || '{}');
      } catch {
         return {};
      }
   }, [categoryUsageJson]);

   const columns: Column<Category>[] = [
      {
         id: 'name',
         header: 'Name',
         accessorKey: 'name',
         cell: (row) => <div className="font-semibold text-gray-900">{row.name}</div>,
      },
      {
         id: 'slug',
         header: 'Slug',
         accessorKey: 'slug',
         cell: (row) => (
            <Badge variant="secondary" className="font-mono text-xs">
               {row.slug}
            </Badge>
         ),
      },
      {
         id: 'description',
         header: 'Description',
         accessorKey: 'description',
         cell: (row) => (
            <div className="text-sm text-gray-600 max-w-md truncate">{row.description || '-'}</div>
         ),
      },
      {
         id: 'usage',
         header: 'Usage',
         cell: (row) => {
            const count = categoryUsage[row.id] || 0;
            return (
               <Badge variant={count > 0 ? 'default' : 'secondary'} className={count > 0 ? 'bg-blue-100 text-blue-700' : ''}>
                  {count} artikel
               </Badge>
            );
         },
      },
      {
         id: 'created_at',
         header: 'Created',
         accessorKey: 'created_at',
         cell: (row) => (
            <div className="text-sm text-gray-500">{new Date(row.created_at).toLocaleDateString('id-ID')}</div>
         ),
      },
   ];

   const actions = (row: Category) => {
      const usageCount = categoryUsage[row.id] || 0;
      return (
         <div className="flex items-center gap-2">
            <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                  window.location.href = `/dashboard/categories/${row.id}/edit`;
               }}
            >
               Edit
            </Button>
            <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                  deleteCategory(row.id, usageCount);
               }}
               className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
               Delete
            </Button>
         </div>
      );
   };

   return <DataTable data={categories} columns={columns} actions={actions} emptyMessage="Belum ada kategori. Buat kategori pertama untuk memulai." />;
}

