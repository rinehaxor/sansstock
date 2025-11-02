-- Seed Articles with Categories and Tags
-- Pastikan categories dan tags sudah ada, jika belum akan dibuat

-- ============================================
-- 1. INSERT CATEGORIES (jika belum ada)
-- ============================================
INSERT INTO categories (name, slug, description)
VALUES 
   ('Ekonomi', 'ekonomi', 'Berita terkini seputar ekonomi Indonesia dan global'),
   ('Saham', 'saham', 'Analisis dan update pasar saham'),
   ('Kripto', 'kripto', 'Berita cryptocurrency dan blockchain'),
   ('Investasi', 'investasi', 'Tips dan strategi investasi')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. INSERT TAGS (jika belum ada)
-- ============================================
INSERT INTO tags (name, slug, description)
VALUES 
   ('Bank Indonesia', 'bank-indonesia', 'Kebijakan dan keputusan Bank Indonesia'),
   ('IHSG', 'ihsg', 'Indeks Harga Saham Gabungan'),
   ('Bitcoin', 'bitcoin', 'Berita seputar Bitcoin'),
   ('Investasi', 'investasi', 'Tips dan strategi investasi'),
   ('Pasar Saham', 'pasar-saham', 'Update pasar saham'),
   ('Kripto', 'kripto', 'Cryptocurrency'),
   ('Ekonomi Makro', 'ekonomi-makro', 'Analisis ekonomi makro'),
   ('Cryptocurrency', 'cryptocurrency', 'Mata uang kripto')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. INSERT SOURCES (jika belum ada)
-- ============================================
-- Schema: id, name, slug, rss_url, api_base_url, is_active, created_at, updated_at
INSERT INTO sources (name, slug, is_active)
VALUES 
   ('Tim Editorial SansStocks', 'tim-editorial-sansstocks', true),
   ('Reuters', 'reuters', true),
   ('Bloomberg', 'bloomberg', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 4. INSERT ARTICLES (Published)
-- ============================================
-- Note: created_by dan updated_by harus diganti dengan user_id yang valid di database
-- Ganti 'your-user-id-here' dengan user_id admin yang sebenarnya

-- Artikel 1: Bank Indonesia
INSERT INTO articles (
   title,
   slug,
   summary,
   content,
   thumbnail_url,
   status,
   category_id,
   source_id,
   created_by,
   updated_by,
   published_at,
   url_original
)
SELECT 
   'Bank Indonesia Pertahankan Suku Bunga Acuan di 6%',
   'bank-indonesia-pertahankan-suku-bunga-acuan-di-6',
   'BI memutuskan untuk mempertahankan BI 7-Day Reverse Repo Rate di level 6% untuk periode November 2024. Keputusan ini diambil setelah mempertimbangkan berbagai faktor ekonomi makro dan stabilitas rupiah.',
   '<p>Bank Indonesia (BI) dalam rapat Dewan Gubernur bulanan memutuskan untuk mempertahankan suku bunga acuan BI 7-Day Reverse Repo Rate di level 6,00%. Keputusan ini konsisten dengan kebijakan moneter yang berfokus pada stabilitas nilai tukar rupiah dan pengendalian inflasi.</p><p>Gubernur Bank Indonesia menyatakan bahwa keputusan ini didasarkan pada evaluasi kondisi ekonomi global dan domestik yang masih menghadapi ketidakpastian. Rupiah saat ini menunjukkan stabilitas yang lebih baik dibandingkan beberapa bulan sebelumnya, namun tetap perlu diwaspadai.</p><p>BI juga memproyeksikan inflasi akan berada di rentang target 2,5% - 4,5% pada akhir tahun 2024. Pertumbuhan ekonomi Indonesia diperkirakan tetap solid di kisaran 5,0% - 5,2% untuk tahun ini.</p>',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
   'published',
   (SELECT id FROM categories WHERE slug = 'ekonomi'),
   (SELECT id FROM sources WHERE slug = 'tim-editorial-sansstocks'),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   NOW() - INTERVAL '2 hours',
   'https://sansstocks.com/artikel/bank-indonesia-pertahankan-suku-bunga-acuan-di-6'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'bank-indonesia-pertahankan-suku-bunga-acuan-di-6');

-- Artikel 2: IHSG Menguat
INSERT INTO articles (
   title,
   slug,
   summary,
   content,
   thumbnail_url,
   status,
   category_id,
   source_id,
   created_by,
   updated_by,
   published_at,
   url_original
)
SELECT 
   'IHSG Menguat 0.8% di Sesi Pagi',
   'ihsg-menguat-08-di-sesi-pagi',
   'Indeks Harga Saham Gabungan (IHSG) menguat 0.8% pada sesi pagi didukung oleh sentimen positif dari pasar global dan masuknya aliran dana asing.',
   '<p>Indeks Harga Saham Gabungan (IHSG) ditutup menguat 0,8% di level 7.245,67 pada sesi pagi perdagangan hari ini. Penguatan ini didorong oleh sentimen positif dari pasar global dan masuknya aliran dana asing ke pasar saham Indonesia.</p><p>Sektor perbankan dan teknologi menjadi penggerak utama penguatan IHSG hari ini. Saham-saham bank besar seperti BCA, Mandiri, dan BRI mengalami kenaikan signifikan di atas 1%.</p><p>Analis menilai penguatan ini masih akan berlanjut seiring dengan stabilitas ekonomi dan prospek pertumbuhan yang positif. Volume perdagangan juga meningkat dibandingkan hari sebelumnya.</p>',
   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
   'published',
   (SELECT id FROM categories WHERE slug = 'saham'),
   (SELECT id FROM sources WHERE slug = 'tim-editorial-sansstocks'),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   NOW() - INTERVAL '4 hours',
   'https://sansstocks.com/artikel/ihsg-menguat-08-di-sesi-pagi'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'ihsg-menguat-08-di-sesi-pagi');

-- Artikel 3: Bitcoin Stabil
INSERT INTO articles (
   title,
   slug,
   summary,
   content,
   thumbnail_url,
   status,
   category_id,
   source_id,
   created_by,
   updated_by,
   published_at,
   url_original
)
SELECT 
   'Bitcoin Stabil di Level $65,000',
   'bitcoin-stabil-di-level-65000',
   'Harga Bitcoin tetap stabil di kisaran $65,000 dengan volume perdagangan yang meningkat signifikan. Investor menunjukkan optimisme terhadap prospek jangka panjang cryptocurrency.',
   '<p>Harga Bitcoin (BTC) menunjukkan stabilitas di level $65.000 pada perdagangan hari ini. Volume perdagangan meningkat 15% dibandingkan hari sebelumnya, menunjukkan minat investor yang masih kuat terhadap aset kripto terbesar ini.</p><p>Analis kripto menyatakan bahwa stabilitas harga Bitcoin di level ini menunjukkan konsolidasi yang sehat setelah kenaikan signifikan beberapa pekan terakhir. Support kuat terlihat di level $63.000, sementara resistance berada di $68.000.</p><p>Faktor fundamental yang mendukung Bitcoin antara lain meningkatnya adopsi institusional dan ekspektasi approval ETF Bitcoin di berbagai negara. Namun, investor tetap perlu waspada terhadap volatilitas tinggi yang melekat pada aset kripto.</p>',
   'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
   'published',
   (SELECT id FROM categories WHERE slug = 'kripto'),
   (SELECT id FROM sources WHERE slug = 'tim-editorial-sansstocks'),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   NOW() - INTERVAL '6 hours',
   'https://sansstocks.com/artikel/bitcoin-stabil-di-level-65000'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'bitcoin-stabil-di-level-65000');

-- Artikel 4: Tips Investasi
INSERT INTO articles (
   title,
   slug,
   summary,
   content,
   thumbnail_url,
   status,
   category_id,
   source_id,
   created_by,
   updated_by,
   published_at,
   url_original
)
SELECT 
   '5 Tips Investasi Saham untuk Pemula',
   '5-tips-investasi-saham-untuk-pemula',
   'Panduan lengkap bagi investor pemula yang ingin memulai investasi saham. Pelajari strategi dasar, manajemen risiko, dan cara membangun portofolio yang sehat.',
   '<p>Investasi saham bisa menjadi cara yang efektif untuk meningkatkan kekayaan jangka panjang. Namun, bagi pemula, memulai investasi saham bisa terasa menakutkan. Berikut adalah 5 tips penting untuk memulai investasi saham:</p><p><strong>1. Mulai dengan Modal Kecil</strong><br>Jangan langsung menginvestasikan seluruh tabungan Anda. Mulailah dengan jumlah yang Anda sanggup kehilangan. Ini membantu Anda belajar tanpa tekanan finansial yang berlebihan.</p><p><strong>2. Pelajari Dasar-Dasar</strong><br>Pahami konsep dasar seperti P/E ratio, dividen, market cap, dan istilah-istilah penting lainnya. Baca buku, ikuti webinar, atau gunakan aplikasi edukasi investasi.</p><p><strong>3. Diversifikasi Portofolio</strong><br>Jangan meletakkan semua telur dalam satu keranjang. Investasikan di berbagai sektor dan perusahaan untuk mengurangi risiko.</p><p><strong>4. Investasi Jangka Panjang</strong><br>Saham bukan untuk trading jangka pendek jika Anda pemula. Fokus pada investasi jangka panjang dan biarkan compound interest bekerja untuk Anda.</p><p><strong>5. Tetap Disiplin</strong><br>Buatlah rencana investasi dan patuhi rencana tersebut. Jangan terpengaruh emosi atau berita jangka pendek. Consistency adalah kunci sukses investasi.</p>',
   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
   'published',
   (SELECT id FROM categories WHERE slug = 'investasi'),
   (SELECT id FROM sources WHERE slug = 'tim-editorial-sansstocks'),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   NOW() - INTERVAL '1 day',
   'https://sansstocks.com/artikel/5-tips-investasi-saham-untuk-pemula'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = '5-tips-investasi-saham-untuk-pemula');

-- Artikel 5: Ekonomi Global
INSERT INTO articles (
   title,
   slug,
   summary,
   content,
   thumbnail_url,
   status,
   category_id,
   source_id,
   created_by,
   updated_by,
   published_at,
   url_original
)
SELECT 
   'Ekonomi Global Menunjukkan Tanda Pemulihan',
   'ekonomi-global-menunjukkan-tanda-pemulihan',
   'Data ekonomi terbaru menunjukkan tanda-tanda pemulihan ekonomi global setelah periode ketidakpastian. Pertumbuhan ekonomi di negara-negara maju mulai menunjukkan momentum positif.',
   '<p>Data ekonomi global terbaru menunjukkan tanda-tanda pemulihan yang menggembirakan. Pertumbuhan ekonomi di Amerika Serikat, Eropa, dan Asia mulai menunjukkan momentum positif setelah periode ketidakpastian yang panjang.</p><p>IMF (International Monetary Fund) memproyeksikan pertumbuhan ekonomi global akan mencapai 3,2% tahun ini, lebih tinggi dari perkiraan sebelumnya. Pemulihan ini didorong oleh stabilitas sektor manufaktur dan peningkatan konsumsi masyarakat.</p><p>Namun, para ekonom tetap waspada terhadap risiko inflasi dan kebijakan moneter yang lebih ketat di berbagai negara. Pemulihan ekonomi juga tidak merata di semua negara, dengan beberapa negara berkembang masih menghadapi tantangan.</p>',
   'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
   'published',
   (SELECT id FROM categories WHERE slug = 'ekonomi'),
   (SELECT id FROM sources WHERE slug = 'tim-editorial-sansstocks'),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   (SELECT id FROM auth.users WHERE email = 'ajivudi@gmail.com' LIMIT 1),
   NOW() - INTERVAL '2 days',
   'https://sansstocks.com/artikel/ekonomi-global-menunjukkan-tanda-pemulihan'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'ekonomi-global-menunjukkan-tanda-pemulihan');

-- ============================================
-- 5. INSERT ARTICLE_TAGS (Relasi Artikel dengan Tags)
-- ============================================

-- Tag untuk Artikel 1: Bank Indonesia
INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'bank-indonesia-pertahankan-suku-bunga-acuan-di-6'),
   (SELECT id FROM tags WHERE slug = 'bank-indonesia')
ON CONFLICT (article_id, tag_id) DO NOTHING;

INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'bank-indonesia-pertahankan-suku-bunga-acuan-di-6'),
   (SELECT id FROM tags WHERE slug = 'ekonomi-makro')
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- Tag untuk Artikel 2: IHSG
INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'ihsg-menguat-08-di-sesi-pagi'),
   (SELECT id FROM tags WHERE slug = 'ihsg')
ON CONFLICT (article_id, tag_id) DO NOTHING;

INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'ihsg-menguat-08-di-sesi-pagi'),
   (SELECT id FROM tags WHERE slug = 'pasar-saham')
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- Tag untuk Artikel 3: Bitcoin
INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'bitcoin-stabil-di-level-65000'),
   (SELECT id FROM tags WHERE slug = 'bitcoin')
ON CONFLICT (article_id, tag_id) DO NOTHING;

INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'bitcoin-stabil-di-level-65000'),
   (SELECT id FROM tags WHERE slug = 'kripto')
ON CONFLICT (article_id, tag_id) DO NOTHING;

INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'bitcoin-stabil-di-level-65000'),
   (SELECT id FROM tags WHERE slug = 'cryptocurrency')
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- Tag untuk Artikel 4: Tips Investasi
INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = '5-tips-investasi-saham-untuk-pemula'),
   (SELECT id FROM tags WHERE slug = 'investasi')
ON CONFLICT (article_id, tag_id) DO NOTHING;

INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = '5-tips-investasi-saham-untuk-pemula'),
   (SELECT id FROM tags WHERE slug = 'pasar-saham')
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- Tag untuk Artikel 5: Ekonomi Global
INSERT INTO article_tags (article_id, tag_id)
SELECT 
   (SELECT id FROM articles WHERE slug = 'ekonomi-global-menunjukkan-tanda-pemulihan'),
   (SELECT id FROM tags WHERE slug = 'ekonomi-makro')
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- ============================================
-- VERIFIKASI DATA
-- ============================================
-- Query untuk memverifikasi artikel yang sudah dibuat:
-- SELECT 
--    a.id,
--    a.title,
--    a.slug,
--    a.status,
--    a.published_at,
--    c.name as category_name,
--    COUNT(DISTINCT at.tag_id) as tag_count
-- FROM articles a
-- LEFT JOIN categories c ON a.category_id = c.id
-- LEFT JOIN article_tags at ON a.id = at.article_id
-- WHERE a.status = 'published'
-- GROUP BY a.id, a.title, a.slug, a.status, a.published_at, c.name
-- ORDER BY a.published_at DESC;

