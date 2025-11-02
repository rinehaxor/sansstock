import * as React from 'react';
import { DataTable, type Column } from './DataTable';
import { Button } from './ui/Button';
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

export default function TagsTable({ tags: tagsJson, tagUsage: tagUsageJson, onDelete }: TagsTableProps) {
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
         cell: (row) => (
            <div className="font-semibold text-gray-900">{row.name}</div>
         ),
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
            <div className="text-sm text-gray-600 max-w-md truncate">
               {row.description || '-'}
            </div>
         ),
      },
      {
         id: 'usage',
         header: 'Usage',
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
         cell: (row) => (
            <div className="text-sm text-gray-500">
               {new Date(row.created_at).toLocaleDateString('id-ID')}
            </div>
         ),
      },
   ];

   const actions = (row: Tag) => {
      const usageCount = tagUsage[row.id] || 0;
      return (
         <div className="flex items-center gap-2">
            <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                  window.location.href = `/dashboard/tags/${row.id}/edit`;
               }}
            >
               Edit
            </Button>
            <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                  deleteTag(row.id, usageCount);
               }}
               className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
               Delete
            </Button>
         </div>
      );
   };

   return (
      <DataTable
         data={tags}
         columns={columns}
         actions={actions}
         emptyMessage="Belum ada tags. Buat tag pertama untuk memulai."
      />
   );
}

