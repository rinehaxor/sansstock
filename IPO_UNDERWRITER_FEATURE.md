# Fitur History Performa Underwriter IPO

Fitur ini memungkinkan Anda untuk melacak dan menganalisis performa IPO yang ditangani oleh berbagai underwriter.

## Instalasi Database

1. Buka Supabase SQL Editor
2. Jalankan file `CREATE_IPO_SCHEMA.sql` untuk membuat tabel-tabel yang diperlukan:
   -  `underwriters` - Daftar underwriter
   -  `ipo_listings` - Data IPO listings
   -  `ipo_underwriters` - Relasi many-to-many antara IPO dan underwriter
   -  `ipo_performance_metrics` - Metrik performa IPO

## Struktur Data

### IPO Listing

-  `ticker_symbol` - Kode saham (unik)
-  `company_name` - Nama perusahaan
-  `ipo_date` - Tanggal IPO
-  `general_sector` - Sektor umum
-  `specific_sector` - Sektor spesifik
-  `shares_offered` - Jumlah saham yang ditawarkan
-  `total_value` - Total nilai IPO
-  `ipo_price` - Harga IPO per saham

### Underwriter

-  `name` - Nama underwriter (unik)

### Performance Metrics

-  `metric_name` - Nama metrik (default: "return")
-  `metric_value` - Nilai performa dalam persentase
-  `period_days` - Periode dalam hari setelah IPO (1, 7, 30, 90, 180, 365, dll)

## Cara Menggunakan

### 1. Import Data dari Excel/JSON

1. Buka `/dashboard/ipo-listings/import`
2. Siapkan data dalam format JSON:

```json
[
   {
      "ticker_symbol": "FAPA",
      "company_name": "PT FAP Agri Tbk",
      "ipo_date": "2021-01-04",
      "general_sector": "Consumer Non-Cyclicals",
      "specific_sector": "Agricultural Products",
      "shares_offered": 1001718,
      "total_value": 3629411800,
      "ipo_price": 1840,
      "underwriters": "PT BCA Sekuritas",
      "performance_metrics": [
         { "metric_name": "return", "metric_value": 25, "period_days": 1 },
         { "metric_name": "return", "metric_value": 42, "period_days": 7 },
         { "metric_name": "return", "metric_value": 51, "period_days": 30 }
      ]
   }
]
```

3. Paste JSON data atau upload file JSON
4. Klik "Import Data"

**Catatan:**

-  Underwriters dapat berupa string (pisahkan dengan semicolon `;` atau comma `,`) atau array
-  Performance metrics adalah array dengan `metric_name`, `metric_value` (persentase), dan `period_days`
-  Data yang sudah ada akan diupdate berdasarkan `ticker_symbol`

### 2. Mengelola IPO Listings

1. Buka `/dashboard/ipo-listings`
2. Lihat daftar semua IPO listings
3. Gunakan search untuk mencari berdasarkan ticker atau nama perusahaan
4. Klik "Edit" untuk mengedit IPO listing
5. Klik "Hapus" untuk menghapus IPO listing
6. Klik "Tambah IPO" untuk menambahkan IPO baru secara manual

### 3. Melihat Performa Underwriter

1. Buka `/underwriters` (halaman publik)
2. Lihat daftar semua underwriter dengan statistik performa
3. Filter dan urutkan berdasarkan:
   -  Nama
   -  Total IPO
   -  Rata-rata Performa (dengan pilihan periode)
4. Klik card underwriter untuk melihat detail:
   -  Rata-rata performa per periode
   -  Min/Max performa
   -  Daftar IPO yang ditangani

## API Endpoints

### IPO Listings

-  `GET /api/ipo-listings` - Get semua IPO listings (public)
   -  Query params: `page`, `limit`, `search`, `ticker_symbol`
-  `POST /api/ipo-listings` - Create IPO listing (admin only)
-  `GET /api/ipo-listings/[id]` - Get IPO listing by ID (public)
-  `PUT /api/ipo-listings/[id]` - Update IPO listing (admin only)
-  `DELETE /api/ipo-listings/[id]` - Delete IPO listing (admin only)
-  `POST /api/ipo-listings/import` - Import data dari JSON (admin only)

### Underwriters

-  `GET /api/underwriters` - Get semua underwriters (public)
   -  Query params: `search`, `include_stats=true`
-  `POST /api/underwriters` - Create/upsert underwriter (admin only)

## Format Data Excel ke JSON

Jika Anda punya data di Excel, berikut contoh cara mengkonversinya ke JSON:

1. **Export Excel ke CSV**
2. **Konversi CSV ke JSON** menggunakan tool online atau script Python:

```python
import csv
import json

def csv_to_json(csv_file, json_file):
    data = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Parse underwriters (assuming they're in one column, separated by semicolon)
            underwriters = row.get('Underwriter(s)', '').strip()

            # Parse performance metrics (assuming columns like "Day 1", "Week 1", etc.)
            performance_metrics = []
            period_mapping = {
                'Day 1': 1,
                'Week 1': 7,
                'Month 1': 30,
                'Month 3': 90,
                'Month 6': 180,
                'Year 1': 365,
            }

            for col_name, period_days in period_mapping.items():
                if col_name in row and row[col_name]:
                    try:
                        value = float(row[col_name].replace('%', '').strip())
                        performance_metrics.append({
                            'metric_name': 'return',
                            'metric_value': value,
                            'period_days': period_days
                        })
                    except:
                        pass

            data.append({
                'ticker_symbol': row.get('Ticker Symbol', '').strip(),
                'company_name': row.get('Company Name', '').strip(),
                'ipo_date': row.get('IPO Date', '').strip(),
                'general_sector': row.get('General Sector/Industry', '').strip(),
                'specific_sector': row.get('Specific Sector/Industry', '').strip(),
                'shares_offered': int(row.get('Shares Offered', 0).replace('.', '').replace(',', '')) if row.get('Shares Offered') else None,
                'total_value': float(row.get('Total Value', 0).replace('.', '').replace(',', '')) if row.get('Total Value') else None,
                'ipo_price': float(row.get('IPO Price', 0).replace('.', '').replace(',', '')) if row.get('IPO Price') else None,
                'underwriters': underwriters,
                'performance_metrics': performance_metrics
            })

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Usage
csv_to_json('ipo_data.csv', 'ipo_data.json')
```

3. **Import JSON** melalui dashboard

## Troubleshooting

### Data tidak muncul setelah import

-  Pastikan format JSON benar
-  Periksa console browser untuk error
-  Pastikan semua field required (ticker_symbol, company_name, ipo_date) terisi

### Underwriter tidak muncul

-  Pastikan nama underwriter tidak duplikat
-  Periksa apakah underwriter sudah dibuat di database
-  Pastikan relasi antara IPO dan underwriter sudah dibuat

### Performance metrics tidak muncul

-  Pastikan `metric_value` adalah angka (bukan string)
-  Pastikan `period_days` adalah angka
-  Periksa apakah data sudah diimport dengan benar

## Fitur yang Akan Datang

-  [ ] Import langsung dari file Excel (xlsx)
-  [ ] Export data ke Excel
-  [ ] Grafik performa underwriter
-  [ ] Perbandingan performa antar underwriter
-  [ ] Filter berdasarkan sektor
-  [ ] Filter berdasarkan periode waktu
