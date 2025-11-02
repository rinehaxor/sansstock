# Saran Kolom Tambahan untuk Database Articles

Berdasarkan skema database yang ada, berikut adalah saran kolom tambahan yang mungkin berguna untuk meningkatkan fungsionalitas sistem artikel:

## ✅ Kolom yang Sudah Ada (Sudah Baik)

Skema database Anda sudah cukup lengkap dengan:
- ✅ `id`, `title`, `slug`, `summary`, `content`
- ✅ `thumbnail_url`, `status`, `published_at`
- ✅ `category_id`, `source_id`
- ✅ `created_by`, `updated_by`, `created_at`, `updated_at`
- ✅ `fts` (Full-Text Search)
- ✅ Relasi dengan `tags`, `categories`, `sources`

## 💡 Kolom yang Disarankan Ditambahkan

### 1. **Tracking & Analytics**
```sql
-- Di tabel `articles`
views_count INT DEFAULT 0,           -- Jumlah views artikel
likes_count INT DEFAULT 0,          -- Jumlah likes (jika ada fitur like)
reading_time INT,                    -- Estimasi waktu baca (dalam menit)
```

### 2. **SEO Optimization**
```sql
-- Di tabel `articles`
meta_title TEXT,                     -- Custom meta title untuk SEO
meta_description TEXT,                -- Meta description untuk SEO
meta_keywords TEXT[],                 -- Array keywords untuk SEO
og_image_url TEXT,                   -- Open Graph image untuk social sharing
```

### 3. **Content Management**
```sql
-- Di tabel `articles`
excerpt TEXT,                        -- Excerpt/pendahuluan yang lebih pendek dari summary
featured BOOLEAN DEFAULT FALSE,      -- Artikel featured/pinned
priority INT DEFAULT 0,              -- Priority untuk sorting
deleted_at TIMESTAMPTZ,              -- Soft delete (jika mau implement soft delete)
```

### 4. **User Engagement**
```sql
-- Buat tabel baru `article_reactions` (jika perlu)
-- Atau gunakan existing `likes_count` di atas
```

### 5. **Workflow & Publishing**
```sql
-- Di tabel `articles`
scheduled_at TIMESTAMPTZ,            -- Jadwal publish (jika ada scheduler)
expires_at TIMESTAMPTZ,              -- Tanggal kadaluarsa artikel
author_name TEXT,                    -- Nama penulis (backup jika user dihapus)
```

### 6. **Content Metadata**
```sql
-- Di tabel `articles`
language VARCHAR(10) DEFAULT 'id',   -- Bahasa artikel
word_count INT,                      -- Jumlah kata
is_featured_image BOOLEAN DEFAULT FALSE,  -- Apakah thumbnail adalah featured image
```

### 7. **Relationships**
```sql
-- Tabel `article_authors` (jika satu artikel bisa punya multiple authors)
article_id INT8 REFERENCES articles(id),
user_id UUID REFERENCES users(id),
role TEXT, -- 'author', 'co-author', 'editor'

-- Tabel `article_revisions` (jika perlu history/versioning)
id INT8 PRIMARY KEY,
article_id INT8 REFERENCES articles(id),
content TEXT,
revision_number INT,
created_by UUID,
created_at TIMESTAMPTZ
```

## 🎯 Prioritas Kolom Tambahan

### **High Priority (Sangat Direkomendasikan)**
1. `views_count` - Untuk tracking popularitas
2. `meta_description` - Penting untuk SEO
3. `featured` - Untuk artikel unggulan
4. `reading_time` - UX yang baik

### **Medium Priority**
5. `meta_title` - SEO optimization
6. `excerpt` - Untuk preview yang lebih baik
7. `scheduled_at` - Untuk scheduled publishing

### **Low Priority (Nice to Have)**
8. `likes_count` - Jika ada fitur engagement
9. `deleted_at` - Soft delete
10. `word_count` - Analytics

## 📝 Contoh Query untuk Menambahkan Kolom

```sql
-- High Priority Columns
ALTER TABLE articles 
  ADD COLUMN views_count INT DEFAULT 0,
  ADD COLUMN meta_description TEXT,
  ADD COLUMN featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN reading_time INT;

-- Update reading_time berdasarkan word_count
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := CEIL(LENGTH(NEW.content) / 200); -- ~200 chars per minute
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reading_time
  BEFORE INSERT OR UPDATE OF content ON articles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_reading_time();
```

## ✅ Kesimpulan

Skema database Anda sudah sangat baik dan lengkap untuk kebutuhan dasar. Kolom tambahan di atas adalah **opsional** dan bisa ditambahkan sesuai kebutuhan fitur yang ingin dikembangkan.

**Minimum yang disarankan**: `views_count`, `meta_description`, dan `featured` akan sangat membantu untuk fungsionalitas admin dashboard dan SEO.


