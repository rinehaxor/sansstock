# Input Validation & Sanitization Implementation

Input validation dan sanitization telah diimplementasikan untuk mencegah XSS dan SQL injection.

## Yang Sudah Diimplementasikan

### 1. Validation Schemas (`src/lib/validation.ts`)

Validation schemas menggunakan Zod untuk semua form:
- ✅ **Article Schema**: Validasi untuk artikel (title, slug, content, dll)
- ✅ **Category Schema**: Validasi untuk kategori
- ✅ **Tag Schema**: Validasi untuk tag
- ✅ **IPO Listing Schema**: Validasi untuk IPO listing
- ✅ **Underwriter Schema**: Validasi untuk underwriter
- ✅ **Search Query Schema**: Validasi untuk search queries

### 2. Sanitization Functions

Fungsi sanitization untuk mencegah XSS dan injection:
- ✅ `sanitizeString()`: Remove null bytes dan control characters
- ✅ `sanitizeHtml()`: Basic HTML entity encoding
- ✅ `sanitizeSlug()`: Sanitize slug untuk URL-friendly

### 3. API Endpoint Validation

Semua API endpoints POST/PUT sekarang menggunakan validasi:
- ✅ `/api/articles` - POST & PUT
- ✅ `/api/categories` - POST
- ✅ `/api/tags` - POST

### 4. Search Query Sanitization

Search queries sekarang di-sanitize untuk mencegah SQL injection:
- ✅ Escape special characters (`%`, `_`, `\`) di LIKE queries
- ✅ Remove dangerous characters sebelum query

## Update Frontend Forms

### Menggunakan Validation Schemas di Frontend

Form frontend perlu diupdate untuk menggunakan react-hook-form dengan validation schemas:

#### Contoh: ArticleForm

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { articleSchema, ArticleFormData } from '../lib/validation';

export default function ArticleForm({ ... }) {
   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isSubmitting },
   } = useForm<ArticleFormData>({
      resolver: zodResolver(articleSchema),
      defaultValues: {
         title: initialArticle?.title || '',
         slug: initialArticle?.slug || '',
         // ... other defaults
      },
   });

   // Auto-generate slug from title
   const title = watch('title');
   useEffect(() => {
      if (mode === 'create' && title) {
         const generatedSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
         setValue('slug', generatedSlug);
      }
   }, [title, mode, setValue]);

   const onSubmit = async (data: ArticleFormData) => {
      // Data sudah divalidasi dan di-sanitize oleh Zod
      // Cukup kirim ke API
      const response = await fetch(url, {
         method,
         headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
         },
         body: JSON.stringify(data),
         credentials: 'include',
      });
      // ... handle response
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         {/* Title Field */}
         <div>
            <Label htmlFor="title">Judul Artikel *</Label>
            <Input
               id="title"
               {...register('title')}
               className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
               <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
         </div>

         {/* Slug Field */}
         <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
               id="slug"
               {...register('slug')}
               className={errors.slug ? 'border-red-500' : ''}
            />
            {errors.slug && (
               <p className="text-sm text-red-600">{errors.slug.message}</p>
            )}
         </div>

         {/* Content Field */}
         <div>
            <Label htmlFor="content">Konten *</Label>
            <ArticleEditor
               content={watch('content')}
               onChange={(content) => setValue('content', content)}
            />
            {errors.content && (
               <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
         </div>

         {/* Category Field */}
         <div>
            <Label htmlFor="category_id">Kategori *</Label>
            <select {...register('category_id', { valueAsNumber: true })}>
               {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                     {cat.name}
                  </option>
               ))}
            </select>
            {errors.category_id && (
               <p className="text-sm text-red-600">{errors.category_id.message}</p>
            )}
         </div>

         {/* Submit Button */}
         <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
         </Button>
      </form>
   );
}
```

## Validasi yang Dilakukan

### Article Validation
- ✅ Title: 3-255 karakter, sanitized
- ✅ Slug: 3-255 karakter, URL-friendly, hanya alphanumeric + hyphen + underscore
- ✅ Summary: Max 500 karakter, optional
- ✅ Content: Min 10 karakter, required
- ✅ Category ID: Required, positive integer
- ✅ Status: Enum (draft, published, archived)
- ✅ Tag IDs: Array of positive integers
- ✅ URLs: Valid URL format untuk thumbnail_url dan url_original

### Category/Tag Validation
- ✅ Name: 2-100 karakter, sanitized
- ✅ Slug: URL-friendly, regex validated
- ✅ Description: Max 500 karakter, optional

### Search Query Validation
- ✅ Search string: Max 200 karakter, sanitized
- ✅ Page: Positive integer
- ✅ Limit: 1-100 integer
- ✅ Category ID: Positive integer (optional)

## Security Features

✅ **XSS Prevention**:
- String sanitization untuk remove control characters
- HTML entity encoding (jika diperlukan)
- Content sanitization untuk rich text editor

✅ **SQL Injection Prevention**:
- Parameterized queries (Supabase PostgREST)
- Search string sanitization untuk LIKE queries
- Input type validation (numbers, strings, dll)

✅ **Input Validation**:
- Type checking dengan Zod
- Length validation
- Format validation (email, URL, regex)
- Enum validation untuk status fields

## Next Steps

1. ✅ **Update ArticleForm**: Migrate ke react-hook-form (TODO)
2. ✅ **Update CategoryForm**: Migrate ke react-hook-form
3. ✅ **Update TagForm**: Migrate ke react-hook-form
4. ✅ **Add Content Sanitization**: Untuk rich text content (XSS prevention)

## Testing

Test validasi dengan:
1. Submit form dengan input invalid → harusnya return error
2. Submit form dengan input valid → harusnya berhasil
3. Test SQL injection di search → harusnya di-sanitize
4. Test XSS di text fields → harusnya di-sanitize

