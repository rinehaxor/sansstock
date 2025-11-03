import React, { useEffect, useState } from 'react';
import ArticleEditor from './ArticleEditor';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ArticleFormProps {
   mode?: 'create' | 'edit';
   articleId?: number;
   initialArticle?: {
      title: string;
      slug: string;
      summary: string | null;
      content: string;
      thumbnail_url: string | null;
      thumbnail_alt?: string | null;
      category_id: number;
      source_id: number | null;
      status: string;
      url_original: string | null;
   };
   categories: Array<{ id: number; name: string }>;
   sources: Array<{ id: number; name: string }>;
   tags: Array<{ id: number; name: string }>;
   selectedTagIds?: number[];
}

export default function ArticleForm({
   mode = 'create',
   articleId,
   initialArticle,
   categories,
   sources,
   tags,
   selectedTagIds = [],
}: ArticleFormProps) {
   const [title, setTitle] = useState(initialArticle?.title || '');
   const [slug, setSlug] = useState(initialArticle?.slug || '');
   const [summary, setSummary] = useState(initialArticle?.summary || '');
   const [content, setContent] = useState(initialArticle?.content || '');
   const [thumbnailUrl, setThumbnailUrl] = useState(initialArticle?.thumbnail_url || '');
   const [thumbnailPreview, setThumbnailPreview] = useState(initialArticle?.thumbnail_url || '');
   const [thumbnailAlt, setThumbnailAlt] = useState(initialArticle?.thumbnail_alt || '');
   const [categoryId, setCategoryId] = useState(initialArticle?.category_id || 0);
   const [sourceId, setSourceId] = useState(initialArticle?.source_id || null);
   const [status, setStatus] = useState(initialArticle?.status || 'draft');
   const [selectedTags, setSelectedTags] = useState<number[]>(selectedTagIds);
   const [urlOriginal, setUrlOriginal] = useState(initialArticle?.url_original || '');
   const [isSubmitting, setIsSubmitting] = useState(false);

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
         content,
         thumbnail_url: thumbnailUrl || null,
         thumbnail_alt: thumbnailAlt || null,
         category_id: categoryId,
         source_id: sourceId || null,
         status,
         tag_ids: selectedTags,
         url_original: urlOriginal || null,
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
             alert(mode === 'edit' ? 'Artikel berhasil diperbarui!' : 'Artikel berhasil dibuat!');
             window.location.href = '/dashboard/articles';
          } else {
             const error = await response.json();
             alert('Error: ' + (error.error || (mode === 'edit' ? 'Gagal memperbarui artikel' : 'Gagal membuat artikel')));
             setIsSubmitting(false);
          }
       } catch (error) {
          alert('Error: ' + (mode === 'edit' ? 'Gagal memperbarui artikel' : 'Gagal membuat artikel'));
          setIsSubmitting(false);
       }
   };

   return (
      <Card className="border-2">
         <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl font-bold text-gray-900">{mode === 'edit' ? 'Edit Artikel' : 'Buat Artikel Baru'}</CardTitle>
         </CardHeader>
         <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Title */}
               <div className="space-y-2">
                  <Label htmlFor="title">
                     Judul Artikel <span className="text-red-500">*</span>
                  </Label>
                  <Input
                     id="title"
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     required
                     placeholder="Masukkan judul artikel"
                  />
               </div>

               {/* Slug */}
               <div className="space-y-2">
                  <Label htmlFor="slug">
                     Slug (URL) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                     id="slug"
                     type="text"
                     value={slug}
                     onChange={(e) => setSlug(e.target.value)}
                     required
                     placeholder="judul-artikel-url-friendly"
                  />
                  <p className="text-xs text-muted-foreground">URL-friendly version dari judul</p>
               </div>

               {/* Summary */}
               <div className="space-y-2">
                  <Label htmlFor="summary">Ringkasan</Label>
                  <Textarea
                     id="summary"
                     value={summary}
                     onChange={(e) => setSummary(e.target.value)}
                     rows={3}
                     placeholder="Ringkasan singkat artikel (akan muncul di preview)"
                  />
               </div>

               {/* Content */}
               <div className="space-y-2">
                  <Label htmlFor="content">
                     Konten <span className="text-red-500">*</span>
                  </Label>
                  <ArticleEditor content={content} onChange={setContent} />
               </div>

               {/* Category & Source */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="category_id">
                        Kategori <span className="text-red-500">*</span>
                     </Label>
                     <Select
                        value={categoryId > 0 ? categoryId.toString() : undefined}
                        onValueChange={(value) => setCategoryId(parseInt(value))}
                        required
                     >
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

                  <div className="space-y-2">
                     <Label htmlFor="source_id">Sumber</Label>
                     <Select
                        value={sourceId ? sourceId.toString() : undefined}
                        onValueChange={(value) => setSourceId(value ? parseInt(value) : null)}
                     >
                        <SelectTrigger id="source_id">
                           <SelectValue placeholder="Pilih Sumber (Opsional)" />
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
               </div>

               {/* Tags */}
               <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                     {tags.map((tag) => (
                        <label
                           key={tag.id}
                           className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200 p-2 rounded-md border border-transparent transition-all"
                        >
                           <input
                              type="checkbox"
                              checked={selectedTags.includes(tag.id)}
                              onChange={() => handleTagToggle(tag.id)}
                              className="rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 accent-blue-600"
                           />
                           <span className="text-sm text-gray-700">{tag.name}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {/* Thumbnail & Status */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="thumbnail_file">Thumbnail Gambar</Label>
                     <Input
                        type="file"
                        id="thumbnail_file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleThumbnailChange}
                        className="cursor-pointer"
                     />
                     <p className="text-xs text-muted-foreground">Max 5MB. Format: JPG, PNG, WebP, GIF</p>
                     {/* Alt Text Input */}
                     {(thumbnailPreview || thumbnailUrl) && (
                        <div className="space-y-2 mt-3">
                           <Label htmlFor="thumbnail_alt">
                              Deskripsi Gambar (Alt Text) <span className="text-muted-foreground text-xs font-normal">(untuk aksesibilitas & SEO)</span>
                           </Label>
                           <Input
                              id="thumbnail_alt"
                              type="text"
                              value={thumbnailAlt}
                              onChange={(e) => setThumbnailAlt(e.target.value)}
                              placeholder="Contoh: Grafik pertumbuhan IHSG bulan November 2024"
                              className="text-sm"
                           />
                           <p className="text-xs text-muted-foreground">
                              Jelaskan apa yang ada di gambar untuk pengguna yang menggunakan screen reader dan SEO
                           </p>
                        </div>
                     )}
                     {/* Preview */}
                     {thumbnailPreview && (
                        <div className="mt-3 space-y-2">
                           <img
                              src={thumbnailPreview}
                              alt={thumbnailAlt || 'Thumbnail preview'}
                              className="max-w-full h-48 object-cover rounded-lg border"
                           />
                           <Button type="button" variant="ghost" size="sm" onClick={handleRemoveThumbnail} className="text-destructive hover:text-destructive">
                              Hapus Gambar
                           </Button>
                        </div>
                     )}
                  </div>

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
               </div>

               {/* URL Original */}
               <div className="space-y-2">
                  <Label htmlFor="url_original">URL Original (jika disadur)</Label>
                  <Input
                     type="url"
                     id="url_original"
                     value={urlOriginal}
                     onChange={(e) => setUrlOriginal(e.target.value)}
                     placeholder="https://example.com/article"
                  />
               </div>

               {/* Actions */}
               <div className="flex items-center justify-end gap-4 pt-6 border-t">
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
   );
}
