import * as React from 'react';
import { DataTable, type Column } from './DataTable';
import { Badge } from './ui/Badge';
import toast from 'react-hot-toast';

interface Underwriter {
   id: number;
   name: string;
}

interface IPOListing {
   id: number;
   ticker_symbol: string;
   company_name: string;
   ipo_date: string;
   general_sector?: string;
   specific_sector?: string;
   shares_offered?: number;
   total_value?: number;
   ipo_price?: number;
   created_at: string;
   updated_at: string;
   ipo_underwriters?: Array<{
      underwriter: Underwriter;
   }>;
   ipo_performance_metrics?: Array<{
      id: number;
      metric_name: string;
      metric_value: number;
      period_days: number;
   }>;
}

interface IPOListingsTableProps {
   ipoListings: string; // JSON string from Astro
   currentPage?: number;
   totalPages?: number;
   totalItems?: number;
   itemsPerPage?: number;
   paginationBaseUrl?: string;
}

async function deleteIPOListing(id: number) {
   if (!confirm('Apakah Anda yakin ingin menghapus IPO listing ini?')) {
      return;
   }

   try {
      const response = await fetch(`/api/ipo-listings/${id}`, {
         method: 'DELETE',
         credentials: 'include',
      });

      if (response.ok) {
         toast.success('IPO listing berhasil dihapus');
         window.location.reload();
      } else {
         const error = await response.json();
         toast.error('Error: ' + (error.error || 'Gagal menghapus IPO listing'));
      }
   } catch (error) {
      toast.error('Error: Gagal menghapus IPO listing');
   }
}

function formatNumber(num: number | null | undefined): string {
   if (num === null || num === undefined) return '-';
   return new Intl.NumberFormat('id-ID').format(num);
}

function formatCurrency(num: number | null | undefined): string {
   if (num === null || num === undefined) return '-';
   return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(num);
}

export default function IPOListingsTable({
   ipoListings: ipoListingsJson,
   currentPage = 1,
   totalPages = 1,
   totalItems = 0,
   itemsPerPage = 10,
   paginationBaseUrl = '/dashboard/ipo-listings',
}: IPOListingsTableProps) {
   const [ipoListings, setIpoListings] = React.useState<IPOListing[]>([]);
   const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

   React.useEffect(() => {
      try {
         const parsed = JSON.parse(ipoListingsJson);
         setIpoListings(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
         console.error('Error parsing IPO listings:', error);
         setIpoListings([]);
      }
   }, [ipoListingsJson]);

   const columns: Column<IPOListing>[] = [
      {
         id: 'ticker_symbol',
         header: 'Ticker',
         accessorKey: 'ticker_symbol',
         cell: ({ row }) => (
            <div className="font-medium text-blue-600">{row.original.ticker_symbol}</div>
         ),
      },
      {
         id: 'company_name',
         header: 'Nama Perusahaan',
         accessorKey: 'company_name',
         cell: ({ row }) => <div className="max-w-xs truncate">{row.original.company_name}</div>,
      },
      {
         id: 'ipo_date',
         header: 'Tanggal IPO',
         accessorKey: 'ipo_date',
         cell: ({ row }) => {
            const date = new Date(row.original.ipo_date);
            return <div>{date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</div>;
         },
      },
      {
         id: 'general_sector',
         header: 'Sektor',
         accessorKey: 'general_sector',
         cell: ({ row }) => (
            <div className="max-w-xs">
               <div className="text-sm font-medium">{row.original.general_sector || '-'}</div>
               {row.original.specific_sector && (
                  <div className="text-xs text-gray-500">{row.original.specific_sector}</div>
               )}
            </div>
         ),
      },
      {
         id: 'ipo_price',
         header: 'Harga IPO',
         accessorKey: 'ipo_price',
         cell: ({ row }) => <div>{formatCurrency(row.original.ipo_price)}</div>,
      },
      {
         id: 'underwriters',
         header: 'Underwriter',
         accessorKey: 'ipo_underwriters',
         cell: ({ row }) => {
            const underwriters = row.original.ipo_underwriters || [];
            if (underwriters.length === 0) return <div className="text-gray-400">-</div>;
            
            return (
               <div className="flex flex-wrap gap-1 max-w-xs">
                  {underwriters.slice(0, 2).map((item, idx) => (
                     <Badge key={idx} variant="secondary" className="text-xs">
                        {item.underwriter.name}
                     </Badge>
                  ))}
                  {underwriters.length > 2 && (
                     <Badge variant="outline" className="text-xs">
                        +{underwriters.length - 2}
                     </Badge>
                  )}
               </div>
            );
         },
      },
      {
         id: 'actions',
         header: 'Aksi',
         cell: ({ row }) => (
            <div className="flex items-center gap-2">
               <a
                  href={`/dashboard/ipo-listings/${row.original.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
               >
                  Edit
               </a>
               <button
                  onClick={() => deleteIPOListing(row.original.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
               >
                  Hapus
               </button>
            </div>
         ),
      },
   ];

   return (
      <div className="space-y-4">
         <DataTable
            columns={columns}
            data={ipoListings}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            paginationBaseUrl={paginationBaseUrl}
         />
      </div>
   );
}

