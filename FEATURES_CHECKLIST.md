# Fitur CMS Artikel - Checklist Lengkap

## ✅ Yang Sudah Ada

-  ✅ Rich text editor (TipTap) dengan formatting lengkap
-  ✅ Image upload & Media Library
-  ✅ Thumbnail dengan alt text
-  ✅ Categories & Tags
-  ✅ Sources
-  ✅ Status (Draft/Published/Archived)
-  ✅ SEO Meta (Title, Description, Keywords)
-  ✅ URL Original
-  ✅ Slug auto-generate
-  ✅ Layout 2 kolom (content + sidebar)
-  ✅ Mass delete
-  ✅ Search & Filter
-  ✅ Sortable columns
-  ✅ Checkbox selection

## 🚀 Fitur yang Bisa Ditambahkan

### HIGH PRIORITY (Penting untuk CMS Modern)

#### 1. **Scheduled Publishing** ⏰

-  Jadwal publish artikel di waktu tertentu
-  Field: `scheduled_at` (TIMESTAMPTZ)
-  Auto-publish saat waktu tercapai (cron job/webhook)
-  Menampilkan jadwal publish di tabel artikel

#### 2. **Auto-Save Draft** 💾

-  Auto-save setiap beberapa detik
-  Notification saat ada perubahan yang belum disimpan
-  Restore dari auto-save terakhir
-  Menampilkan "Last saved: ..."

#### 3. **Article Preview** 👁️

-  Preview artikel sebelum publish
-  Preview dengan theme yang sama seperti frontend
-  Preview di new tab/window
-  Preview dengan URL preview khusus

#### 4. **Reading Time** ⏱️

-  Auto-calculate reading time dari content
-  Menampilkan di preview artikel
-  Field: `reading_time` (INT, dalam menit)
-  Formula: ~200 kata per menit

#### 5. **Word/Character Count** 📊

-  Real-time word count saat menulis
-  Character count untuk SEO optimization
-  Menampilkan di editor toolbar

#### 6. **Featured Article** ⭐

-  Pin artikel ke featured
-  Field: `featured` (BOOLEAN)
-  Menampilkan featured articles di homepage
-  Badge "Featured" di tabel artikel

#### 7. **Excerpt** 📝

-  Excerpt lebih pendek dari summary (untuk homepage)
-  Field: `excerpt` (TEXT, max 100-150 karakter)
-  Auto-generate dari summary jika kosong

### MEDIUM PRIORITY (Nice to Have)

#### 8. **Social Sharing Preview** 📱

-  Preview bagaimana artikel terlihat saat di-share di social media
-  Preview Open Graph image
-  Preview Twitter Card
-  Test share preview

#### 9. **Fullscreen Editor Mode** 🖥️

-  Toggle fullscreen untuk editor
-  Focus mode untuk writing
-  Hide sidebar saat fullscreen

#### 10. **Keyboard Shortcuts** ⌨️

-  Keyboard shortcuts indicator
-  Shortcuts untuk formatting (Ctrl+B, Ctrl+I, dll)
-  Command palette (Ctrl+K)

#### 11. **Article Duplication** 📋

-  Duplicate artikel existing
-  Copy semua field termasuk tags
-  Otomatis set status ke Draft

#### 12. **Bulk Actions** 🔄

-  Bulk edit (ubah kategori, status, dll)
-  Bulk tag assignment
-  Bulk delete (sudah ada ✅)

#### 13. **Article Templates** 📄

-  Template artikel untuk kategori tertentu
-  Pre-filled content berdasarkan template
-  Save current article as template

#### 14. **Content Analytics** 📈

-  View count per artikel
-  Popular articles based on views
-  Field: `views_count` (INT, default 0)

#### 15. **Better Validation** ✅

-  Real-time validation untuk slug uniqueness
-  Warning jika meta description terlalu panjang/pendek
-  Warning jika title terlalu panjang
-  Required field indicators yang lebih jelas

#### 16. **Undo/Redo History** ↶

-  History perubahan artikel
-  Rollback ke versi sebelumnya
-  Version comparison

### LOW PRIORITY (Optional)

#### 17. **Author Assignment** 👤

-  Assign author ke artikel
-  Multiple authors support
-  Author bio dan avatar

#### 18. **Article Series** 📚

-  Group artikel dalam series
-  Next/Previous article dalam series
-  Series navigation

#### 19. **Comments System** 💬

-  Enable/disable comments per artikel
-  Comment moderation

#### 20. **Related Articles** 🔗

-  Auto-suggest related articles
-  Manual related articles selection
-  Display di frontend

#### 21. **Export/Import** 📥📤

-  Export artikel ke Markdown/HTML
-  Import artikel dari file
-  Bulk import

#### 22. **Content Blocks** 🧩

-  Reusable content blocks
-  Gallery blocks
-  Quote blocks
-  Call-to-action blocks

#### 23. **A/B Testing** 🧪

-  Multiple title variations
-  Test which performs better

#### 24. **Revision History** 📜

-  Complete revision history
-  Compare versions
-  Restore to specific version

#### 25. **Rich Snippets** 🏷️

-  Recipe schema
-  FAQ schema
-  HowTo schema
-  Review schema
