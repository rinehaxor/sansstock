import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ArticleEditor from './ArticleEditor';

interface ArticleFormProps {
   mode?: 'create' | 'edit';
   articleId?: number;
   initialArticle?: {
      title: string;
      slug: string;
      summary: string | null;
      content: string;
      thumbnail_url: string | null;
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

export default function ArticleForm({ mode = 'create', articleId, initialArticle, categories, sources, tags, selectedTagIds = [] }: ArticleFormProps) {
   const [title, setTitle] = useState(initialArticle?.title || '');
   const [slug, setSlug] = useState(initialArticle?.slug || '');
   const [summary, setSummary] = useState(initialArticle?.summary || '');
   const [content, setContent] = useState(initialArticle?.content || '');
   const [thumbnailUrl, setThumbnailUrl] = useState(initialArticle?.thumbnail_url || '');
   const [thumbnailPreview, setThumbnailPreview] = useState(initialArticle?.thumbnail_url || '');
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
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
         {/* Title */}
         <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
               Judul Artikel <span className="text-red-500">*</span>
            </label>
            <input
               type="text"
               id="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
         </div>

         {/* Slug */}
         <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
               Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
               type="text"
               id="slug"
               value={slug}
               onChange={(e) => setSlug(e.target.value)}
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">URL-friendly version dari judul</p>
         </div>

         {/* Summary */}
         <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
               Ringkasan
            </label>
            <textarea
               id="summary"
               value={summary}
               onChange={(e) => setSummary(e.target.value)}
               rows={3}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
         </div>

         {/* Content */}
         <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
               Konten <span className="text-red-500">*</span>
            </label>
            <ArticleEditor content={content} onChange={setContent} />
         </div>

         {/* Category & Source */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
               </label>
               <select
                  id="category_id"
                  value={categoryId}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                     <option key={cat.id} value={cat.id}>
                        {cat.name}
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label htmlFor="source_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Sumber
               </label>
               <select
                  id="source_id"
                  value={sourceId || ''}
                  onChange={(e) => setSourceId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                  <option value="">Pilih Sumber (Opsional)</option>
                  {sources.map((source) => (
                     <option key={source.id} value={source.id}>
                        {source.name}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         {/* Tags */}
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
               {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                     <input type="checkbox" checked={selectedTags.includes(tag.id)} onChange={() => handleTagToggle(tag.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                     <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
               ))}
            </div>
         </div>

         {/* Thumbnail & Status */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label htmlFor="thumbnail_file" className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Gambar
               </label>
               <input
                  type="file"
                  id="thumbnail_file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleThumbnailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
               />
               <p className="mt-1 text-xs text-gray-500">Max 5MB. Format: JPG, PNG, WebP, GIF</p>
               {/* Preview */}
               {thumbnailPreview && (
                  <div className="mt-3">
                     <img src={thumbnailPreview} alt="Thumbnail preview" className="max-w-full h-48 object-cover rounded-lg border border-gray-200" />
                     <button type="button" onClick={handleRemoveThumbnail} className="mt-2 text-sm text-red-600 hover:text-red-700">
                        Hapus Gambar
                     </button>
                  </div>
               )}
            </div>

            <div>
               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
               </label>
               <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
               </select>
            </div>
         </div>

         {/* URL Original */}
         <div>
            <label htmlFor="url_original" className="block text-sm font-medium text-gray-700 mb-2">
               URL Original (jika disadur)
            </label>
            <input
               type="url"
               id="url_original"
               value={urlOriginal}
               onChange={(e) => setUrlOriginal(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
         </div>

         {/* Actions */}
         <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <a href="/dashboard/articles" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
               Batal
            </a>
            <button
               type="submit"
               disabled={isSubmitting}
               className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isSubmitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Artikel'}
            </button>
         </div>
      </form>
   );
}
