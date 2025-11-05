import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface MediaItem {
   id: string | number;
   name: string;
   url: string;
   size: number;
   alt_text?: string | null;
   description?: string | null;
   created_at: string;
   updated_at: string;
   file_path?: string;
}

export default function MediaLibrary() {
   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
   const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
   const [showPreview, setShowPreview] = useState(false);
   const [showEditDialog, setShowEditDialog] = useState(false);
   const [editAltText, setEditAltText] = useState('');
   const [editDescription, setEditDescription] = useState('');
   const [saving, setSaving] = useState(false);
   const [showUploadDialog, setShowUploadDialog] = useState(false);
   const [uploadFile, setUploadFile] = useState<File | null>(null);
   const [uploadPreview, setUploadPreview] = useState<string>('');
   const [uploadAltText, setUploadAltText] = useState('');
   const [uploading, setUploading] = useState(false);
   const [deleting, setDeleting] = useState(false);

   useEffect(() => {
      fetchMedia();
   }, [search]);

   const fetchMedia = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams();
         if (search) {
            params.append('search', search);
         }
         params.append('limit', '100');

         const response = await fetch(`/api/media?${params.toString()}`, {
            credentials: 'include',
         });

         if (response.ok) {
            const result = await response.json();
            setMediaItems(result.data || []);
         } else {
            console.error('Failed to fetch media');
         }
      } catch (error) {
         console.error('Error fetching media:', error);
      } finally {
         setLoading(false);
      }
   };

   const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
   };

   const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   const handleSelectItem = (id: string | number) => {
      const idStr = String(id);
      const newSelected = new Set(selectedItems);
      if (newSelected.has(idStr)) {
         newSelected.delete(idStr);
      } else {
         newSelected.add(idStr);
      }
      setSelectedItems(newSelected);
   };

   const handleSelectAll = () => {
      if (selectedItems.size === mediaItems.length) {
         setSelectedItems(new Set());
      } else {
         setSelectedItems(new Set(mediaItems.map((item) => String(item.id))));
      }
   };

   const handleMediaClick = (item: MediaItem) => {
      setSelectedMedia(item);
      setShowPreview(true);
      setEditAltText(item.alt_text || '');
      setEditDescription(item.description || '');
   };

   const handleSaveMetadata = async () => {
      if (!selectedMedia) return;

      setSaving(true);
      try {
         const response = await fetch(`/api/media/${selectedMedia.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               alt_text: editAltText || null,
               description: editDescription || null,
               file_path: selectedMedia.file_path || null,
            }),
            credentials: 'include',
         });

         if (response.ok) {
            const result = await response.json();
            // Update local state
            setMediaItems((prev) =>
               prev.map((item) =>
                  item.id === selectedMedia.id
                     ? { ...item, alt_text: editAltText, description: editDescription }
                     : item
               )
            );
            setSelectedMedia({
               ...selectedMedia,
               alt_text: editAltText,
               description: editDescription,
            });
            setShowEditDialog(false);
            alert('Metadata berhasil diperbarui!');
         } else {
            const error = await response.json();
            alert('Error: ' + (error.error || 'Gagal memperbarui metadata'));
         }
      } catch (error) {
         alert('Error: Gagal memperbarui metadata');
      } finally {
         setSaving(false);
      }
   };

   const copyUrlToClipboard = (url: string) => {
      navigator.clipboard.writeText(url);
      alert('URL berhasil disalin!');
   };

   const handleUpload = async () => {
      if (!uploadFile) {
         alert('Pilih file terlebih dahulu');
         return;
      }

      setUploading(true);
      try {
         const formData = new FormData();
         formData.append('file', uploadFile);
         if (uploadAltText.trim()) {
            formData.append('alt_text', uploadAltText.trim());
         }

         const response = await fetch('/api/upload/thumbnail', {
            method: 'POST',
            body: formData,
            credentials: 'include',
         });

         if (response.ok) {
            const result = await response.json();
            // Optimistically add or update the uploaded item in local list
            if (result.path) {
               setMediaItems((prev) => {
                  const exists = prev.some((i) => i.file_path === result.path);
                  if (exists) {
                     return prev.map((i) =>
                        i.file_path === result.path
                           ? { ...i, alt_text: uploadAltText.trim() || i.alt_text, url: result.url || i.url }
                           : i
                     );
                  }
                  // If not exists, let fetchMedia load it shortly; keep UI consistent meanwhile
                  return prev;
               });
            }

            // Reset form and refresh media list
            setUploadFile(null);
            setUploadPreview('');
            setUploadAltText('');
            setShowUploadDialog(false);
            fetchMedia();
            alert('Gambar berhasil diupload!');
         } else {
            const error = await response.json();
            alert('Error: ' + (error.error || 'Gagal mengupload gambar'));
         }
      } catch (error) {
         alert('Error: Gagal mengupload gambar');
      } finally {
         setUploading(false);
      }
   };

   const handleDelete = async (id: string | number) => {
      if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
         return;
      }

      setDeleting(true);
      try {
         const response = await fetch(`/api/media/${id}`, {
            method: 'DELETE',
            credentials: 'include',
         });

         if (response.ok) {
            // Remove from local state
            setMediaItems((prev) => prev.filter((item) => item.id !== id));
            setSelectedItems((prev) => {
               const newSet = new Set(prev);
               newSet.delete(String(id));
               return newSet;
            });
            
            // Close preview if deleted item is selected
            if (selectedMedia?.id === id) {
               setShowPreview(false);
               setSelectedMedia(null);
            }
            
            alert('Gambar berhasil dihapus!');
         } else {
            const error = await response.json();
            alert('Error: ' + (error.error || 'Gagal menghapus gambar'));
         }
      } catch (error) {
         alert('Error: Gagal menghapus gambar');
      } finally {
         setDeleting(false);
      }
   };

   const handleBulkDelete = async () => {
      if (selectedItems.size === 0) {
         alert('Pilih gambar terlebih dahulu');
         return;
      }

      if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.size} gambar?`)) {
         return;
      }

      setDeleting(true);
      try {
         // Delete all selected items
         const deletePromises = Array.from(selectedItems).map((id) =>
            fetch(`/api/media/${id}`, {
               method: 'DELETE',
               credentials: 'include',
            })
         );

         const results = await Promise.allSettled(deletePromises);
         
         // Count successes
         const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.ok).length;
         const failCount = selectedItems.size - successCount;

         // Remove from local state
         setMediaItems((prev) => prev.filter((item) => !selectedItems.has(String(item.id))));
         setSelectedItems(new Set());

         if (failCount === 0) {
            alert(`${successCount} gambar berhasil dihapus!`);
         } else {
            alert(`${successCount} gambar berhasil dihapus, ${failCount} gagal.`);
         }
      } catch (error) {
         alert('Error: Gagal menghapus gambar');
      } finally {
         setDeleting(false);
      }
   };

   return (
      <Card>
         <CardContent className="p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
               <div className="flex-1">
                  <Input
                     type="text"
                     placeholder="Cari media..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full"
                  />
               </div>
               <div className="flex gap-2">
                  <Button
                     variant="default"
                     size="sm"
                     onClick={() => setShowUploadDialog(true)}
                  >
                     Upload Gambar
                  </Button>
                  {selectedItems.size > 0 && (
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={deleting}
                     >
                        Hapus ({selectedItems.size})
                     </Button>
                  )}
                  <Button
                     variant={viewMode === 'grid' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => setViewMode('grid')}
                  >
                     Grid
                  </Button>
                  <Button
                     variant={viewMode === 'list' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => setViewMode('list')}
                  >
                     List
                  </Button>
               </div>
            </div>

            {/* Select All */}
            {mediaItems.length > 0 && (
               <div className="mb-4 flex items-center gap-2">
                  <input
                     type="checkbox"
                     checked={selectedItems.size === mediaItems.length && mediaItems.length > 0}
                     onChange={handleSelectAll}
                     className="rounded border-input"
                  />
                  <span className="text-sm text-gray-600">
                     {selectedItems.size > 0
                        ? `${selectedItems.size} item dipilih`
                        : 'Pilih semua'}
                  </span>
               </div>
            )}

            {/* Media Grid/List */}
            {loading ? (
               <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Memuat media...</div>
               </div>
            ) : mediaItems.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg
                     className="w-16 h-16 text-gray-400 mb-4"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                     />
                  </svg>
                  <p className="text-gray-500 text-lg">Belum ada media</p>
                  <p className="text-gray-400 text-sm mt-1">
                     Upload gambar pertama Anda melalui form artikel
                  </p>
               </div>
            ) : (
               <div
                  className={
                     viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
                        : 'space-y-2'
                  }
               >
                  {mediaItems.map((item) => (
                     <div
                        key={item.id}
                        className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                           selectedItems.has(String(item.id))
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-blue-300'
                        } ${viewMode === 'list' ? 'flex items-center gap-4 p-3' : ''}`}
                        onClick={() => handleMediaClick(item)}
                     >
                        {viewMode === 'grid' ? (
                           <>
                              {/* Checkbox */}
                              <div
                                 className="absolute top-2 left-2 z-10"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectItem(item.id);
                                 }}
                              >
                                 <input
                                    type="checkbox"
                                    checked={selectedItems.has(String(item.id))}
                                    onChange={() => {}}
                                    className="rounded border-input w-5 h-5 cursor-pointer"
                                 />
                              </div>

                              {/* Image */}
                              <div className="aspect-square bg-gray-100 overflow-hidden">
                                 <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    onError={(e) => {
                                       (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                 />
                              </div>

                              {/* File Info */}
                              <div className="p-2 bg-white">
                                 <p className="text-xs text-gray-700 truncate" title={item.name}>
                                    {item.name}
                                 </p>
                                 <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                              </div>
                           </>
                        ) : (
                           <>
                              <input
                                 type="checkbox"
                                 checked={selectedItems.has(String(item.id))}
                                 onChange={(e) => {
                                    e.stopPropagation();
                                    handleSelectItem(item.id);
                                 }}
                                 className="rounded border-input"
                              />
                              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                 <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                       (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                 />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.name}
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    {formatFileSize(item.size)} • {formatDate(item.created_at)}
                                 </p>
                              </div>
                           </>
                        )}
                     </div>
                  ))}
               </div>
            )}

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
               <DialogContent className="max-w-4xl">
                  <DialogHeader>
                     <DialogTitle>{selectedMedia?.name}</DialogTitle>
                     <DialogDescription>Detail Media</DialogDescription>
                  </DialogHeader>
                  {selectedMedia && (
                     <div className="space-y-4">
                        <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                           <img
                              src={selectedMedia.url}
                              alt={selectedMedia.name}
                              className="w-full h-auto max-h-96 object-contain mx-auto"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div>
                              <p className="font-medium text-gray-700">Ukuran File</p>
                              <p className="text-gray-600">{formatFileSize(selectedMedia.size)}</p>
                           </div>
                           <div>
                              <p className="font-medium text-gray-700">Tanggal Upload</p>
                              <p className="text-gray-600">{formatDate(selectedMedia.created_at)}</p>
                           </div>
                        </div>

                        {/* Alt Text & Description */}
                        <div className="space-y-3 pt-2 border-t">
                           <div>
                              <p className="font-medium text-gray-700 mb-1">
                                 Alt Text <span className="text-xs text-gray-500 font-normal">(untuk aksesibilitas & SEO)</span>
                              </p>
                              <p className="text-gray-600 text-sm">
                                 {selectedMedia.alt_text || <span className="text-gray-400 italic">Belum diatur</span>}
                              </p>
                           </div>
                           {selectedMedia.description && (
                              <div>
                                 <p className="font-medium text-gray-700 mb-1">Deskripsi</p>
                                 <p className="text-gray-600 text-sm">{selectedMedia.description}</p>
                              </div>
                           )}
                        </div>

                        <div>
                           <p className="font-medium text-gray-700 mb-2">URL</p>
                           <div className="flex gap-2">
                              <Input
                                 type="text"
                                 value={selectedMedia.url}
                                 readOnly
                                 className="flex-1 font-mono text-xs"
                              />
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => copyUrlToClipboard(selectedMedia.url)}
                              >
                                 Salin
                              </Button>
                           </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 onClick={() => {
                                    setShowEditDialog(true);
                                 }}
                              >
                                 Edit Metadata
                              </Button>
                              <Button
                                 variant="destructive"
                                 onClick={() => {
                                    if (selectedMedia) {
                                       handleDelete(selectedMedia.id);
                                    }
                                 }}
                                 disabled={deleting}
                              >
                                 Hapus
                              </Button>
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 onClick={() => {
                                    copyUrlToClipboard(selectedMedia.url);
                                 }}
                              >
                                 Salin URL
                              </Button>
                              <Button
                                 onClick={() => {
                                    // Copy URL to clipboard and dispatch event for editor
                                    copyUrlToClipboard(selectedMedia.url);
                                    // Dispatch event so editor can listen and insert image
                                    if (typeof window !== 'undefined') {
                                       window.dispatchEvent(
                                          new CustomEvent('mediaLibrarySelect', {
                                             detail: { url: selectedMedia.url },
                                          })
                                       );
                                    }
                                    setShowPreview(false);
                                 }}
                              >
                                 Gunakan Gambar
                              </Button>
                           </div>
                        </div>
                     </div>
                  )}
               </DialogContent>
            </Dialog>

            {/* Edit Metadata Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Edit Metadata</DialogTitle>
                     <DialogDescription>
                        Tambahkan atau edit alt text dan deskripsi untuk gambar ini
                     </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="edit_alt_text">
                           Alt Text <span className="text-xs text-gray-500 font-normal">(untuk aksesibilitas & SEO)</span>
                        </Label>
                        <Input
                           id="edit_alt_text"
                           type="text"
                           value={editAltText}
                           onChange={(e) => setEditAltText(e.target.value)}
                           placeholder="Contoh: Grafik pertumbuhan IHSG bulan November 2024"
                           className="text-sm"
                        />
                        <p className="text-xs text-gray-500">
                           Jelaskan apa yang ada di gambar untuk screen reader dan SEO
                        </p>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="edit_description">Deskripsi (Opsional)</Label>
                        <Textarea
                           id="edit_description"
                           value={editDescription}
                           onChange={(e) => setEditDescription(e.target.value)}
                           placeholder="Deskripsi tambahan tentang gambar ini"
                           rows={3}
                           className="text-sm"
                        />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button
                        variant="outline"
                        onClick={() => {
                           setShowEditDialog(false);
                           setEditAltText(selectedMedia?.alt_text || '');
                           setEditDescription(selectedMedia?.description || '');
                        }}
                        disabled={saving}
                     >
                        Batal
                     </Button>
                     <Button onClick={handleSaveMetadata} disabled={saving}>
                        {saving ? 'Menyimpan...' : 'Simpan'}
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>

            {/* Upload Dialog */}
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Upload Gambar</DialogTitle>
                     <DialogDescription>
                        Upload gambar baru ke media library
                     </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                     <div>
                        <Label htmlFor="upload_file">Pilih File Gambar</Label>
                        <Input
                           id="upload_file"
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 setUploadFile(file);
                                 // Create preview
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                    setUploadPreview(reader.result as string);
                                 };
                                 reader.readAsDataURL(file);
                              }
                           }}
                           className="mt-2 cursor-pointer"
                        />
                        {uploadPreview && (
                           <div className="mt-3">
                              <img
                                 src={uploadPreview}
                                 alt="Preview"
                                 className="max-w-full h-40 object-contain border border-gray-200 rounded-lg"
                              />
                              {uploadFile && (
                                 <p className="text-xs text-gray-500 mt-2">
                                    File: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(2)} KB)
                                 </p>
                              )}
                           </div>
                        )}
                     </div>
                     <div>
                        <Label htmlFor="upload_alt_text">
                           Deskripsi Gambar (Alt Text) <span className="text-xs text-gray-500 font-normal">(Opsional)</span>
                        </Label>
                        <Input
                           id="upload_alt_text"
                           type="text"
                           value={uploadAltText}
                           onChange={(e) => setUploadAltText(e.target.value)}
                           placeholder="Contoh: Grafik pertumbuhan ekonomi Q4 2024"
                           className="mt-2 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                           Jelaskan gambar untuk aksesibilitas dan SEO
                        </p>
                     </div>
                  </div>
                  <DialogFooter>
                     <Button
                        variant="outline"
                        onClick={() => {
                           setShowUploadDialog(false);
                           setUploadFile(null);
                           setUploadPreview('');
                           setUploadAltText('');
                        }}
                        disabled={uploading}
                     >
                        Batal
                     </Button>
                     <Button onClick={handleUpload} disabled={uploading || !uploadFile}>
                        {uploading ? 'Mengupload...' : 'Upload'}
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </CardContent>
      </Card>
   );
}

