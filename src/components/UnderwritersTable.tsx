import * as React from 'react';
import { DataTable, type Column } from './DataTable';
import { Badge } from './ui/Badge';

interface Underwriter {
   id: number;
   name: string;
   created_at: string;
   updated_at: string;
}

interface UnderwritersTableProps {
   underwriters: string;
   ipoCounts: string;
   currentPage?: number;
   totalPages?: number;
   totalItems?: number;
   itemsPerPage?: number;
   paginationBaseUrl?: string;
}

async function deleteUnderwriter(id: number, ipoCount: number) {
   if (ipoCount > 0) {
      alert('Underwriter ini masih terhubung dengan data IPO. Hapus relasi IPO terlebih dahulu.');
      return;
   }

   if (!confirm('Yakin ingin menghapus underwriter ini?')) {
      return;
   }

   try {
      const response = await fetch(`/api/underwriters/${id}`, {
         method: 'DELETE',
         credentials: 'include',
      });

      if (response.ok) {
         alert('Underwriter berhasil dihapus');
         window.location.reload();
      } else {
         const error = await response.json();
         alert('Gagal menghapus underwriter: ' + (error.error || 'Terjadi kesalahan'));
      }
   } catch (error) {
      alert('Gagal menghapus underwriter');
   }
}

async function deleteUnderwriters(ids: number[], ipoCounts: Record<number, number>) {
   const inUse = ids.filter((id) => (ipoCounts[id] || 0) > 0);
   if (inUse.length > 0) {
      alert('Sebagian underwriter masih terhubung dengan IPO. Hapus relasi IPO terlebih dahulu.');
      return;
   }

   if (!confirm(`Hapus ${ids.length} underwriter terpilih?`)) {
      return;
   }

   try {
      const responses = await Promise.all(
         ids.map((id) =>
            fetch(`/api/underwriters/${id}`, {
               method: 'DELETE',
               credentials: 'include',
            })
         )
      );

      const failed = responses.filter((res) => !res.ok);
      if (failed.length === 0) {
         alert('Underwriter terpilih berhasil dihapus');
      } else {
         alert(`${failed.length} underwriter gagal dihapus`);
      }
      window.location.reload();
   } catch (error) {
      alert('Gagal menghapus underwriter');
   }
}

export default function UnderwritersTable({
   underwriters: underwritersJson,
   ipoCounts: ipoCountsJson,
   currentPage,
   totalPages,
   totalItems,
   itemsPerPage,
   paginationBaseUrl,
}: UnderwritersTableProps) {
   const underwriters: Underwriter[] = React.useMemo(() => {
      try {
         return JSON.parse(underwritersJson || '[]');
      } catch {
         return [];
      }
   }, [underwritersJson]);

   const ipoCounts: Record<number, number> = React.useMemo(() => {
      try {
         return JSON.parse(ipoCountsJson || '{}');
      } catch {
         return {};
      }
   }, [ipoCountsJson]);

   const columns: Column<Underwriter>[] = [
      {
         id: 'name',
         header: 'Nama Underwriter',
         accessorKey: 'name',
         sortable: true,
         cell: (row) => <div className="font-semibold text-gray-900">{row.name}</div>,
      },
      {
         id: 'ipo_total',
         header: 'Total IPO',
         sortable: true,
         cell: (row) => {
            const total = ipoCounts[row.id] || 0;
            return (
               <Badge variant={total > 0 ? 'default' : 'secondary'} className="font-semibold">
                  {total}
               </Badge>
            );
         },
         sortAccessor: (row) => ipoCounts[row.id] || 0,
      },
      {
         id: 'created_at',
         header: 'Dibuat',
         accessorKey: 'created_at',
         sortable: true,
         cell: (row) => (
            <div className="text-sm text-gray-500">{new Date(row.created_at).toLocaleDateString('id-ID')}</div>
         ),
      },
      {
         id: 'updated_at',
         header: 'Diupdate',
         accessorKey: 'updated_at',
         sortable: true,
         cell: (row) => (
            <div className="text-sm text-gray-500">{new Date(row.updated_at).toLocaleDateString('id-ID')}</div>
         ),
      },
   ];

   const actionMenuItems = (row: Underwriter) => {
      const total = ipoCounts[row.id] || 0;
      return [
         {
            label: 'Edit',
            onClick: () => {
               window.location.href = `/dashboard/underwriters/${row.id}/edit`;
            },
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
               </svg>
            ),
         },
         {
            label: 'Delete',
            onClick: () => deleteUnderwriter(row.id, total),
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
               </svg>
            ),
         },
      ];
   };

   const handleMassDelete = async (rows: Underwriter[]) => {
      const ids = rows.map((row) => row.id);
      await deleteUnderwriters(ids, ipoCounts);
   };

   const handleSearch = (value: string) => {
      if (!paginationBaseUrl) {
         return;
      }

      const url = new URL(window.location.href);
      if (value) {
         url.searchParams.set('search', value);
      } else {
         url.searchParams.delete('search');
      }
      url.searchParams.set('page', '1');
      window.location.href = url.toString();
   };

   return (
      <DataTable
         data={underwriters}
         columns={columns}
         enableSelection
         actionMenuItems={actionMenuItems}
         onMassDelete={handleMassDelete}
         getRowId={(row) => row.id}
         onSearch={handleSearch}
         searchPlaceholder="Cari underwriter..."
         emptyMessage="Belum ada underwriter. Tambahkan dari menu di atas."
         defaultSort={{ key: 'created_at', direction: 'desc' }}
         currentPage={currentPage}
         totalPages={totalPages}
         totalItems={totalItems}
         itemsPerPage={itemsPerPage}
         paginationBaseUrl={paginationBaseUrl}
      />
   );
}

