import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ArticleEditor from './ArticleEditor';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import MediaLibrary from './MediaLibrary';
import { cn } from '../lib/utils';

interface ArticleFormProps {
   mode?: 'create' | 'edit';
   articleId?: number;
   initialArticle?: {
      title: string;
      slug: string;
      summary: string | null;
      meta_title?: string | null;
      meta_description?: string | null;
      meta_keywords?: string | null;
      content: string;
      thumbnail_url: string | null;
      thumbnail_alt?: string | null;
      category_id: number;
      source_id: number | null;
      status: string;
      url_original: string | null;
      featured?: boolean;
   };
   categories: Array<{ id: number; name: string }>;
   sources: Array<{ id: number; name: string }>;
   tags: Array<{ id: number; name: string }>;
   selectedTagIds?: number[];
}

export default function ArticleForm({ mode = 'create', articleId, initialArticle, categories, sources, tags, selectedTagIds = [] }: ArticleFormProps) {
   const [title, setTitle] = useState(initialArticle?.title || '');
   const [slug, setSlug] = useState(initialArticle?.slug || '');
   const [summary, setSummary] = useState(initialArticle?.summary || '');
   const [metaTitle, setMetaTitle] = useState(initialArticle?.meta_title || '');
   const [metaDescription, setMetaDescription] = useState(initialArticle?.meta_description || '');
   const [metaKeywords, setMetaKeywords] = useState(initialArticle?.meta_keywords || '');
   const [content, setContent] = useState(initialArticle?.content || '');
   const [thumbnailUrl, setThumbnailUrl] = useState(initialArticle?.thumbnail_url || '');
   const [thumbnailPreview, setThumbnailPreview] = useState(initialArticle?.thumbnail_url || '');
   const [thumbnailAlt, setThumbnailAlt] = useState(initialArticle?.thumbnail_alt || '');
   const [categoryId, setCategoryId] = useState(initialArticle?.category_id || 0);
   const [sourceId, setSourceId] = useState(initialArticle?.source_id || null);
   const [status, setStatus] = useState(initialArticle?.status || 'draft');
   const [selectedTags, setSelectedTags] = useState<number[]>(selectedTagIds);
   const [urlOriginal, setUrlOriginal] = useState(initialArticle?.url_original || '');
   const [featured, setFeatured] = useState(initialArticle?.featured || false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showMediaLibrary, setShowMediaLibrary] = useState(false);

   // Auto-generate slug from title (only for create mode)
   useEffect(() => {
      if (mode === 'create') {
         const timer = setTimeout(() => {
            const generatedSlug = title
               .toLowerCase()
               .replace(/[^a-z0-9]+/g, '-')
               .replace(/(^-|-$)/g, '');
            setSlug(generatedSlug);
         }, 300);
         return () => clearTimeout(timer);
      }
   }, [title, mode]);

   // Handle thumbnail file upload
   const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
         if (e.target?.result) {
            setThumbnailPreview(e.target.result as string);
         }
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      try {
         const uploadFormData = new FormData();
         uploadFormData.append('file', file);
         // Send alt text if already filled
         if (thumbnailAlt.trim()) {
            uploadFormData.append('alt_text', thumbnailAlt.trim());
         }

         const uploadResponse = await fetch('/api/upload/thumbnail', {
            method: 'POST',
            body: uploadFormData,
            credentials: 'include',
         });

         if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            setThumbnailUrl(uploadResult.url);
            setThumbnailPreview(uploadResult.url);
         } else {
            const error = await uploadResponse.json();
            alert('Error uploading image: ' + (error.error || 'Upload failed'));
            e.target.value = '';
            setThumbnailPreview(initialArticle?.thumbnail_url || '');
         }
      } catch (error) {
         alert('Error: Gagal mengupload gambar');
         e.target.value = '';
         setThumbnailPreview(initialArticle?.thumbnail_url || '');
      }
   };

   // Listen to MediaLibrary selection to set thumbnail
   useEffect(() => {
      const handler = (e: Event) => {
         const custom = e as CustomEvent<{ url: string }>;
         const url = custom.detail?.url;
         if (!url) return;
         setThumbnailUrl(url);
         setThumbnailPreview(url);
         setShowMediaLibrary(false);
      };
      if (typeof window !== 'undefined') {
         window.addEventListener('mediaLibrarySelect', handler as EventListener);
      }
      return () => {
         if (typeof window !== 'undefined') {
            window.removeEventListener('mediaLibrarySelect', handler as EventListener);
         }
      };
   }, []);

   const handleRemoveThumbnail = () => {
      setThumbnailUrl('');
      setThumbnailPreview('');
      setThumbnailAlt('');
   };

   const handleTagToggle = (tagId: number) => {
      setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const data = {
         title,
         slug,
         summary: summary || null,
         meta_title: metaTitle || null,
         meta_description: metaDescription || null,
         meta_keywords: metaKeywords || null,
         content,
         thumbnail_url: thumbnailUrl || null,
         thumbnail_alt: thumbnailAlt.trim() || null,
         category_id: categoryId,
         source_id: sourceId || null,
         status,
         tag_ids: selectedTags,
         url_original: urlOriginal || null,
         featured,
      };

      try {
         const url = mode === 'edit' && articleId ? `/api/articles/${articleId}` : '/api/articles';
         const method = mode === 'edit' ? 'PUT' : 'POST';

         const response = await fetch(url, {
            method,
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
         });

         if (response.ok) {
            toast.success(mode === 'edit' ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dibuat!');
            setTimeout(() => {
               window.location.href = '/dashboard/articles';
            }, 500);
         } else {
            const error = await response.json();
            toast.error(error.error || (mode === 'edit' ? 'Gagal memperbarui artikel' : 'Gagal membuat artikel'));
            setIsSubmitting(false);
         }
      } catch (error) {
         toast.error(mode === 'edit' ? 'Gagal memperbarui artikel' : 'Gagal membuat artikel');
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <Card className="border-2 w-full">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
               <CardTitle className="text-2xl font-bold text-gray-900">{mode === 'edit' ? 'Edit Artikel' : 'Buat Artikel Baru'}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                     {/* Main Content - Left Column (7/12 width) */}
                     <div className="lg:col-span-7 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                           <Label htmlFor="title">
                              Judul Artikel <span className="text-red-500">*</span>
                           </Label>
                           <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Masukkan judul artikel" />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                           <Label htmlFor="slug">
                              Slug (URL) <span className="text-red-500">*</span>
                           </Label>
                           <Input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="judul-artikel-url-friendly" />
                           <p className="text-xs text-muted-foreground">URL-friendly version dari judul</p>
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                           <Label htmlFor="summary">Ringkasan</Label>
                           <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Ringkasan singkat artikel (akan muncul di preview)" />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                           <Label htmlFor="content">
                              Konten <span className="text-red-500">*</span>
                           </Label>
                           <ArticleEditor content={content} onChange={setContent} />
                        </div>

                        {/* URL Original */}
                        <div className="space-y-2">
                           <Label htmlFor="url_original">URL Original (jika disadur)</Label>
                           <Input type="url" id="url_original" value={urlOriginal} onChange={(e) => setUrlOriginal(e.target.value)} placeholder="https://example.com/article" />
                        </div>
                     </div>

                     {/* Sidebar - Right Column (5/12 width) */}
                     <div className="lg:col-span-5 space-y-6">
                        {/* Publishing Settings */}
                        <Card className="border border-gray-200">
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base font-semibold">Publishing</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              {/* Status */}
                              <div className="space-y-2">
                                 <Label htmlFor="status">Status</Label>
                                 <Select value={status} onValueChange={(value) => setStatus(value)}>
                                    <SelectTrigger id="status">
                                       <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="draft">Draft</SelectItem>
                                       <SelectItem value="published">Published</SelectItem>
                                       <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>

                              {/* Category */}
                              <div className="space-y-2">
                                 <Label htmlFor="category_id">
                                    Kategori <span className="text-red-500">*</span>
                                 </Label>
                                 <Select value={categoryId > 0 ? categoryId.toString() : undefined} onValueChange={(value) => setCategoryId(parseInt(value))} required>
                                    <SelectTrigger id="category_id">
                                       <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {categories.map((cat) => (
                                          <SelectItem key={cat.id} value={cat.id.toString()}>
                                             {cat.name}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </div>

                              {/* Source */}
                              <div className="space-y-2">
                                 <Label htmlFor="source_id">Sumber</Label>
                                 <Select value={sourceId ? sourceId.toString() : undefined} onValueChange={(value) => setSourceId(value ? parseInt(value) : null)}>
                                    <SelectTrigger id="source_id">
                                       <SelectValue placeholder="Pilih Sumber" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {sources.map((source) => (
                                          <SelectItem key={source.id} value={source.id.toString()}>
                                             {source.name}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </div>

                              {/* Featured */}
                              <div className="flex items-center space-x-2 pt-2">
                                 <input
                                    type="checkbox"
                                    id="featured"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                 />
                                 <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                                    Featured Article ⭐
                                 </Label>
                              </div>
                           </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card className="border border-gray-200">
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base font-semibold">Tags</CardTitle>
                           </CardHeader>
                           <CardContent>
                              <div className="relative" id="tags">
                                 {/* Selected chips */}
                                 <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
                                    {selectedTags.map((id) => {
                                       const t = tags.find((x) => x.id === id);
                                       if (!t) return null;
                                       return (
                                          <span key={id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-xs">
                                             {t.name}
                                             <button type="button" onClick={() => handleTagToggle(id)} className="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-100" aria-label={`Hapus tag ${t.name}`}>
                                                ×
                                             </button>
                                          </span>
                                       );
                                    })}
                                    {selectedTags.length === 0 && <span className="text-xs text-muted-foreground">Belum ada tag</span>}
                                 </div>

                                 {/* Trigger and dropdown */}
                                 <TagMultiSelect allTags={tags} selected={selectedTags} onToggle={handleTagToggle} />
                              </div>
                           </CardContent>
                        </Card>

                        {/* Thumbnail */}
                        <Card className="border border-gray-200">
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base font-semibold">Featured Image</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-3">
                              <Input type="file" id="thumbnail_file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleThumbnailChange} className="cursor-pointer text-sm" />
                              <Button type="button" variant="secondary" size="sm" onClick={() => setShowMediaLibrary(true)} className="w-full">
                                 Pilih dari Media Library
                              </Button>
                              <p className="text-xs text-muted-foreground">Max 5MB. Format: JPG, PNG, WebP, GIF</p>
                              
                              {/* Preview */}
                              {thumbnailPreview && (
                                 <div className="space-y-2">
                                    <img src={thumbnailPreview} alt={thumbnailAlt || 'Thumbnail preview'} className="w-full h-32 object-cover rounded-lg border" />
                                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveThumbnail} className="w-full text-destructive hover:text-destructive">
                                       Hapus Gambar
                                    </Button>
                                 </div>
                              )}

                              {/* Alt Text Input */}
                              {(thumbnailPreview || thumbnailUrl) && (
                                 <div className="space-y-2">
                                    <Label htmlFor="thumbnail_alt" className="text-sm">
                                       Alt Text <span className="text-muted-foreground text-xs font-normal">(SEO)</span>
                                    </Label>
                                    <Input id="thumbnail_alt" type="text" value={thumbnailAlt} onChange={(e) => setThumbnailAlt(e.target.value)} placeholder="Deskripsi gambar" className="text-sm" />
                                 </div>
                              )}
                           </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card className="border border-gray-200">
                           <CardHeader className="pb-3">
                              <CardTitle className="text-base font-semibold">SEO Settings</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              {/* Meta Title */}
                              <div className="space-y-2">
                                 <Label htmlFor="meta_title" className="text-sm">
                                    Meta Title
                                 </Label>
                                 <Input 
                                    id="meta_title" 
                                    type="text" 
                                    value={metaTitle} 
                                    onChange={(e) => setMetaTitle(e.target.value)} 
                                    placeholder={title || "Judul SEO"}
                                    maxLength={60}
                                    className="text-sm"
                                 />
                                 <p className="text-xs text-gray-500">
                                    {metaTitle.length || title.length}/60
                                 </p>
                              </div>

                              {/* Meta Description */}
                              <div className="space-y-2">
                                 <Label htmlFor="meta_description" className="text-sm">
                                    Meta Description
                                 </Label>
                                 <Textarea 
                                    id="meta_description" 
                                    value={metaDescription} 
                                    onChange={(e) => setMetaDescription(e.target.value)} 
                                    rows={3} 
                                    placeholder="Deskripsi untuk SEO (150-160 karakter)" 
                                    maxLength={160}
                                    className="text-sm"
                                 />
                                 <p className="text-xs text-gray-500">
                                    {metaDescription.length}/160
                                 </p>
                              </div>

                              {/* Meta Keywords */}
                              <div className="space-y-2">
                                 <Label htmlFor="meta_keywords" className="text-sm">
                                    Meta Keywords
                                 </Label>
                                 <Input 
                                    id="meta_keywords" 
                                    type="text" 
                                    value={metaKeywords} 
                                    onChange={(e) => setMetaKeywords(e.target.value)} 
                                    placeholder="keyword1, keyword2"
                                    className="text-sm"
                                 />
                                 <p className="text-xs text-gray-500">
                                    Pisahkan dengan koma
                                 </p>
                              </div>
                           </CardContent>
                        </Card>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t">
                     <Button type="button" variant="outline" asChild>
                        <a href="/dashboard/articles">Batal</a>
                     </Button>
                     <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Artikel'}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>

         {/* Media Library Modal for Thumbnail selection */}
         <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
            <DialogContent className="max-w-5xl">
               <DialogHeader>
                  <DialogTitle>Pilih Thumbnail dari Media Library</DialogTitle>
                  <DialogDescription>Gunakan gambar yang sudah diupload atau upload baru</DialogDescription>
               </DialogHeader>
               <div className="mt-2">
                  <MediaLibrary />
               </div>
               <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowMediaLibrary(false)}>
                     Tutup
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}

function TagMultiSelect({ allTags, selected, onToggle }: { allTags: Array<{ id: number; name: string }>; selected: number[]; onToggle: (id: number) => void }) {
   const [open, setOpen] = useState(false);
   const [query, setQuery] = useState('');

   const filtered = query ? allTags.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())) : allTags;

   useEffect(() => {
      const onEsc = (e: KeyboardEvent) => {
         if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', onEsc);
      return () => document.removeEventListener('keydown', onEsc);
   }, []);

   return (
      <div className="relative">
         <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm hover:border-input/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-expanded={open}
         >
            <span className={cn('truncate', selected.length ? 'text-foreground' : 'text-muted-foreground')}>{selected.length > 0 ? `${selected.length} tag dipilih` : 'Pilih tags...'}</span>
            <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
         </button>

         {open && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
               <div className="p-2 border-b bg-gray-50">
                  <Input placeholder="Cari tag..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-9" autoFocus />
               </div>
               <div className="max-h-56 overflow-auto py-1">
                  {filtered.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Tidak ada hasil</div>}
                  {filtered.map((tag) => {
                     const checked = selected.includes(tag.id);
                     return (
                        <button key={tag.id} type="button" onClick={() => onToggle(tag.id)} className={cn('flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50', checked ? 'bg-blue-50/60' : '')}>
                           <input type="checkbox" readOnly checked={checked} className="h-4 w-4 rounded border-input text-primary" />
                           <span className="truncate">{tag.name}</span>
                        </button>
                     );
                  })}
               </div>
               <div className="flex items-center justify-between border-t bg-gray-50 px-2 py-2">
                  <span className="text-xs text-muted-foreground">{selected.length} dipilih</span>
                  <div className="flex gap-2">
                     <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                        Tutup
                     </Button>
                     <Button type="button" size="sm" onClick={() => setOpen(false)}>
                        Selesai
                     </Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
