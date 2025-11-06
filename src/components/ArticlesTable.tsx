import * as React from 'react';
import { DataTable, type Column } from './DataTable';
import { Badge } from './ui/Badge';
import QuickEditModal from './QuickEditModal';
import toast from 'react-hot-toast';

interface Article {
   id: number;
   title: string;
   slug: string;
   summary?: string;
   status: string;
   published_at?: string;
   created_at: string;
   featured?: boolean;
   views_count?: number;
   category_id?: number;
   categories?: {
      id: number;
      name: string;
   };
}

interface Category {
   id: number;
   name: string;
}

interface ArticlesTableProps {
   articles: string; // JSON string from Astro
   categories?: string; // JSON string from Astro
   currentPage?: number;
   totalPages?: number;
   totalItems?: number;
   itemsPerPage?: number;
   paginationBaseUrl?: string;
   statusFilter?: string;
}

async function deleteArticle(id: number) {
   if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      return;
   }

   try {
      const response = await fetch(`/api/articles/${id}`, {
         method: 'DELETE',
         credentials: 'include',
      });

      if (response.ok) {
         alert('Artikel berhasil dihapus');
         window.location.reload();
      } else {
         const error = await response.json();
         alert('Error: ' + (error.error || 'Gagal menghapus artikel'));
      }
   } catch (error) {
      alert('Error: Gagal menghapus artikel');
   }
}

async function deleteArticles(ids: number[]) {
   if (!confirm(`Apakah Anda yakin ingin menghapus ${ids.length} artikel yang dipilih?`)) {
      return;
   }

   try {
      const deletePromises = ids.map(id => 
         fetch(`/api/articles/${id}`, {
            method: 'DELETE',
            credentials: 'include',
         })
      );

      const results = await Promise.all(deletePromises);
      const failed = results.filter(r => !r.ok);

      if (failed.length === 0) {
         alert(`${ids.length} artikel berhasil dihapus`);
         window.location.reload();
      } else {
         alert(`${failed.length} dari ${ids.length} artikel gagal dihapus`);
      }
   } catch (error) {
      alert('Error: Gagal menghapus artikel');
   }
}

export default function ArticlesTable({ 
   articles: articlesJson,
   categories: categoriesJson,
   currentPage,
   totalPages,
   totalItems,
   itemsPerPage,
   paginationBaseUrl,
   statusFilter = 'all',
}: ArticlesTableProps) {
   // Parse JSON strings from Astro props
   const [articlesState, setArticlesState] = React.useState<Article[]>(() => {
      try {
         return JSON.parse(articlesJson || '[]');
      } catch {
         return [];
      }
   });

   const categories: Category[] = React.useMemo(() => {
      try {
         return JSON.parse(categoriesJson || '[]');
      } catch {
         return [];
      }
   }, [categoriesJson]);

   const [quickEditArticle, setQuickEditArticle] = React.useState<Article | null>(null);

   // Update articles when props change
   React.useEffect(() => {
      try {
         const parsed = JSON.parse(articlesJson || '[]');
         setArticlesState(parsed);
      } catch {
         // Ignore parse errors
      }
   }, [articlesJson]);

   // Quick update function
   const handleQuickUpdate = async (articleId: number, updates: { status?: string; category_id?: number }) => {
      try {
         const response = await fetch(`/api/articles/${articleId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updates),
         });

         if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Gagal mengupdate artikel');
         }

         // Update local state
         setArticlesState((prev) =>
            prev.map((article) => {
               if (article.id === articleId) {
                  const updated = { ...article };
                  if (updates.status) {
                     updated.status = updates.status;
                     if (updates.status === 'published' && article.status !== 'published') {
                        updated.published_at = new Date().toISOString();
                     }
                  }
                  if (updates.category_id !== undefined) {
                     updated.category_id = updates.category_id;
                     const category = categories.find((c) => c.id === updates.category_id);
                     if (category) {
                        updated.categories = { id: category.id, name: category.name };
                     }
                  }
                  return updated;
               }
               return article;
            })
         );

         toast.success('Artikel berhasil diupdate');
         return true;
      } catch (error) {
         console.error('Error updating article:', error);
         toast.error(error instanceof Error ? error.message : 'Gagal mengupdate artikel');
         return false;
      }
   };

   const columns: Column<Article>[] = [
      {
         id: 'title',
         header: 'Judul',
         sortable: true,
         cell: (row) => (
            <div>
               <div className="flex items-center gap-2">
                  <div className="font-semibold text-gray-900">{row.title}</div>
                  {row.featured && (
                     <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        ⭐ Featured
                     </Badge>
                  )}
               </div>
               <div className="text-sm text-gray-500 font-mono">{row.slug}</div>
               {row.summary && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">{row.summary}</div>
               )}
            </div>
         ),
      },
      {
         id: 'category',
         header: 'Kategori',
         sortable: true,
         cell: (row) => (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
               {row.categories?.name || '-'}
            </Badge>
         ),
      },
      {
         id: 'status',
         header: 'Status',
         sortable: true,
         cell: (row) => (
            <Badge
               className={
                  row.status === 'published'
                     ? 'bg-green-100 text-green-800'
                     : row.status === 'draft'
                     ? 'bg-yellow-100 text-yellow-800'
                     : 'bg-gray-100 text-gray-800'
               }
            >
               {row.status}
            </Badge>
         ),
      },
      {
         id: 'views',
         header: 'Views',
         sortable: true,
         cell: (row) => (
            <div className="text-sm text-gray-600">
               {row.views_count !== undefined && row.views_count !== null ? row.views_count.toLocaleString('id-ID') : '0'}
            </div>
         ),
      },
      {
         id: 'date',
         header: 'Tanggal',
         accessorKey: 'created_at',
         sortable: true,
         cell: (row) => (
            <div className="text-sm text-gray-500">
               {row.published_at
                  ? new Date(row.published_at).toLocaleDateString('id-ID')
                  : new Date(row.created_at).toLocaleDateString('id-ID')}
            </div>
         ),
      },
   ];

   const actionMenuItems = (row: Article) => {
      return [
         {
            label: 'Quick Edit',
            onClick: () => {
               setQuickEditArticle(row);
            },
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
               </svg>
            ),
         },
         {
            label: 'Edit Full',
            onClick: () => {
               window.location.href = `/dashboard/articles/${row.id}/edit`;
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
               deleteArticle(row.id);
            },
            icon: (
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
            ),
         },
      ];
   };

   const handleMassDelete = async (selectedRows: Article[]) => {
      const ids = selectedRows.map(row => row.id);
      await deleteArticles(ids);
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
         // Preserve status filter
         if (statusFilter && statusFilter !== 'all') {
            url.searchParams.set('status', statusFilter);
         } else {
            url.searchParams.delete('status');
         }
         window.location.href = url.toString();
      }
   };

   // Build URL with status filter preserved
   const buildUrl = (page: number, search?: string) => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') {
         params.set('status', statusFilter);
      }
      if (search) {
         params.set('search', search);
      }
      params.set('page', page.toString());
      return `${paginationBaseUrl}?${params.toString()}`;
   };

   return (
      <div className="space-y-4">
         {/* Status Tabs */}
         <div className="flex gap-2 border-b border-gray-200">
            <a
               href={paginationBaseUrl ? `${paginationBaseUrl}?status=all&page=1` : '?status=all&page=1'}
               className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === 'all'
                     ? 'border-blue-600 text-blue-600'
                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
               }`}
            >
               Semua
            </a>
            <a
               href={paginationBaseUrl ? `${paginationBaseUrl}?status=published&page=1` : '?status=published&page=1'}
               className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === 'published'
                     ? 'border-green-600 text-green-600'
                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
               }`}
            >
               Published
            </a>
            <a
               href={paginationBaseUrl ? `${paginationBaseUrl}?status=draft&page=1` : '?status=draft&page=1'}
               className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === 'draft'
                     ? 'border-yellow-600 text-yellow-600'
                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
               }`}
            >
               Draft
            </a>
         </div>

         {/* Data Table */}
         <DataTable
            data={articlesState}
            columns={columns}
            enableSelection={true}
            actionMenuItems={actionMenuItems}
            onMassDelete={handleMassDelete}
            getRowId={(row) => row.id}
            onSearch={handleSearch}
            searchPlaceholder="Filter artikel..."
            emptyMessage="Belum ada artikel. Buat artikel pertama untuk memulai."
            defaultSort={{ key: 'date', direction: 'desc' }}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            paginationBaseUrl={paginationBaseUrl}
            buildPaginationUrl={buildUrl}
         />

         {/* Quick Edit Modal */}
         {quickEditArticle && (
            <QuickEditModal
               open={!!quickEditArticle}
               onOpenChange={(open) => {
                  if (!open) {
                     setQuickEditArticle(null);
                  }
               }}
               article={quickEditArticle}
               categories={categories}
               onSuccess={() => {
                  // Refresh the article in state
                  if (quickEditArticle) {
                     // Fetch updated article data
                     fetch(`/api/articles/${quickEditArticle.id}`, {
                        credentials: 'include',
                     })
                        .then((res) => res.json())
                        .then((data) => {
                           if (data.data) {
                              setArticlesState((prev) =>
                                 prev.map((article) =>
                                    article.id === quickEditArticle.id ? { ...article, ...data.data } : article
                                 )
                              );
                           }
                        })
                        .catch(console.error);
                  }
                  setQuickEditArticle(null);
               }}
            />
         )}
      </div>
   );
}

