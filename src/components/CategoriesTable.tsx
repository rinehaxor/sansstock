import * as React from 'react';
import { DataTable, type Column } from './DataTable';
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
   currentPage?: number;
   totalPages?: number;
   totalItems?: number;
   itemsPerPage?: number;
   paginationBaseUrl?: string;
   initialSearch?: string;
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

async function deleteCategories(ids: number[], categoryUsage: Record<number, number>) {
   // Check if any category is being used
   const categoriesInUse = ids.filter(id => (categoryUsage[id] || 0) > 0);
   if (categoriesInUse.length > 0) {
      const categoryNames = categoriesInUse.map(id => `Kategori ID ${id}`).join(', ');
      alert(`Beberapa kategori masih digunakan di artikel: ${categoryNames}. Hapus kategori dari artikel terlebih dahulu sebelum menghapus.`);
      return;
   }

   try {
      // Delete categories one by one
      const deletePromises = ids.map(id => 
         fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            credentials: 'include',
         })
      );

      const results = await Promise.all(deletePromises);
      const failed = results.filter(r => !r.ok);

      if (failed.length === 0) {
         alert(`${ids.length} kategori berhasil dihapus`);
         window.location.reload();
      } else {
         alert(`${failed.length} dari ${ids.length} kategori gagal dihapus`);
      }
   } catch (error) {
      alert('Error: Gagal menghapus kategori');
   }
}

export default function CategoriesTable({ 
   categories: categoriesJson, 
   categoryUsage: categoryUsageJson,
   currentPage,
   totalPages,
   totalItems,
   itemsPerPage,
   paginationBaseUrl,
   initialSearch = '',
}: CategoriesTableProps) {
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
         sortable: true,
         cell: (row) => <div className="font-semibold text-gray-900">{row.name}</div>,
      },
      {
         id: 'slug',
         header: 'Slug',
         accessorKey: 'slug',
         sortable: true,
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
         sortable: true,
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
         sortable: true,
         cell: (row) => (
            <div className="text-sm text-gray-500">{new Date(row.created_at).toLocaleDateString('id-ID')}</div>
         ),
      },
   ];

   const actionMenuItems = (row: Category) => {
      const usageCount = categoryUsage[row.id] || 0;
      return [
         {
            label: 'Edit',
            onClick: () => {
               window.location.href = `/dashboard/categories/${row.id}/edit`;
            },
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
               </svg>
            ),
         },
         {
            label: 'Delete',
            onClick: () => {
               deleteCategory(row.id, usageCount);
            },
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
            ),
         },
      ];
   };

   const handleMassDelete = async (selectedRows: Category[]) => {
      const ids = selectedRows.map(row => row.id);
      await deleteCategories(ids, categoryUsage);
   };

   const handleSearch = (value: string) => {
      if (paginationBaseUrl) {
         const url = new URL(window.location.href);
         if (value) {
            url.searchParams.set('search', value);
         } else {
            url.searchParams.delete('search');
         }
         url.searchParams.set('page', '1');
         window.location.href = url.toString();
      }
   };

   return (
      <DataTable 
         data={categories} 
         columns={columns} 
         enableSelection={true}
         actionMenuItems={actionMenuItems}
         onMassDelete={handleMassDelete}
         getRowId={(row) => row.id}
         onSearch={handleSearch}
         searchPlaceholder="Filter kategori..."
         emptyMessage="Belum ada kategori. Buat kategori pertama untuk memulai."
         defaultSort={{ key: 'created_at', direction: 'desc' }}
         currentPage={currentPage}
         totalPages={totalPages}
         totalItems={totalItems}
         itemsPerPage={itemsPerPage}
         paginationBaseUrl={paginationBaseUrl}
      />
   );
}
