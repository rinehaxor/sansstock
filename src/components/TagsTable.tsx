import * as React from 'react';
import { DataTable, type Column } from './DataTable';
import { Badge } from './ui/Badge';

interface Tag {
   id: number;
   name: string;
   slug: string;
   description?: string;
   created_at: string;
}

interface TagsTableProps {
   tags: string; // JSON string from Astro
   tagUsage: string; // JSON string from Astro
   onDelete?: (id: number, usageCount: number) => void;
   currentPage?: number;
   totalPages?: number;
   totalItems?: number;
   itemsPerPage?: number;
   paginationBaseUrl?: string;
   initialSearch?: string;
}

async function deleteTag(id: number, usageCount: number) {
   if (usageCount > 0) {
      alert(`Tag ini digunakan di ${usageCount} artikel. Hapus tag dari artikel terlebih dahulu sebelum menghapus tag.`);
      return;
   }

   if (!confirm('Apakah Anda yakin ingin menghapus tag ini?')) {
      return;
   }

   try {
      const response = await fetch(`/api/tags/${id}`, {
         method: 'DELETE',
         credentials: 'include',
      });

      if (response.ok) {
         alert('Tag berhasil dihapus');
         window.location.reload();
      } else {
         const error = await response.json();
         alert('Error: ' + (error.error || 'Gagal menghapus tag'));
      }
   } catch (error) {
      alert('Error: Gagal menghapus tag');
   }
}

async function deleteTags(ids: number[], tagUsage: Record<number, number>) {
   // Check if any tag is being used
   const tagsInUse = ids.filter(id => (tagUsage[id] || 0) > 0);
   if (tagsInUse.length > 0) {
      const tagNames = tagsInUse.map(id => `Tag ID ${id}`).join(', ');
      alert(`Beberapa tag masih digunakan di artikel: ${tagNames}. Hapus tag dari artikel terlebih dahulu sebelum menghapus.`);
      return;
   }

   try {
      // Delete tags one by one
      const deletePromises = ids.map(id => 
         fetch(`/api/tags/${id}`, {
            method: 'DELETE',
            credentials: 'include',
         })
      );

      const results = await Promise.all(deletePromises);
      const failed = results.filter(r => !r.ok);

      if (failed.length === 0) {
         alert(`${ids.length} tag berhasil dihapus`);
         window.location.reload();
      } else {
         alert(`${failed.length} dari ${ids.length} tag gagal dihapus`);
      }
   } catch (error) {
      alert('Error: Gagal menghapus tags');
   }
}

export default function TagsTable({ 
   tags: tagsJson, 
   tagUsage: tagUsageJson, 
   onDelete,
   currentPage,
   totalPages,
   totalItems,
   itemsPerPage,
   paginationBaseUrl,
   initialSearch = '',
}: TagsTableProps) {
   // Parse JSON strings from Astro props
   const tags: Tag[] = React.useMemo(() => {
      try {
         return JSON.parse(tagsJson || '[]');
      } catch {
         return [];
      }
   }, [tagsJson]);

   const tagUsage: Record<number, number> = React.useMemo(() => {
      try {
         return JSON.parse(tagUsageJson || '{}');
      } catch {
         return {};
      }
   }, [tagUsageJson]);

   const columns: Column<Tag>[] = [
      {
         id: 'name',
         header: 'Name',
         accessorKey: 'name',
         sortable: true,
         cell: (row) => (
            <div className="font-semibold text-gray-900">{row.name}</div>
         ),
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
            <div className="text-sm text-gray-600 max-w-md truncate">
               {row.description || '-'}
            </div>
         ),
      },
      {
         id: 'usage',
         header: 'Usage',
         sortable: true,
         cell: (row) => {
            const count = tagUsage[row.id] || 0;
            return (
               <Badge
                  variant={count > 0 ? 'default' : 'secondary'}
                  className={count > 0 ? 'bg-blue-100 text-blue-700' : ''}
               >
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
            <div className="text-sm text-gray-500">
               {new Date(row.created_at).toLocaleDateString('id-ID')}
            </div>
         ),
      },
   ];

   const actionMenuItems = (row: Tag) => {
      const usageCount = tagUsage[row.id] || 0;
      return [
         {
            label: 'Edit',
            onClick: () => {
               window.location.href = `/dashboard/tags/${row.id}/edit`;
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
               deleteTag(row.id, usageCount);
            },
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
            ),
         },
      ];
   };

   const handleMassDelete = async (selectedRows: Tag[]) => {
      const ids = selectedRows.map(row => row.id);
      await deleteTags(ids, tagUsage);
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
         data={tags}
         columns={columns}
         enableSelection={true}
         actionMenuItems={actionMenuItems}
         onMassDelete={handleMassDelete}
         getRowId={(row) => row.id}
         onSearch={handleSearch}
         searchPlaceholder="Filter tags..."
         emptyMessage="Belum ada tags. Buat tag pertama untuk memulai."
         defaultSort={{ key: 'created_at', direction: 'desc' }}
         currentPage={currentPage}
         totalPages={totalPages}
         totalItems={totalItems}
         itemsPerPage={itemsPerPage}
         paginationBaseUrl={paginationBaseUrl}
      />
   );
}
