# Bulk Import IPO Listings ke Supabase

Script ini untuk import banyak IPO listings sekaligus langsung ke Supabase (sekali pakai).

## Cara Pakai

### 1. Siapkan Data JSON

Convert Excel Anda ke JSON dengan format berikut:

```json
[
   {
      "ticker_symbol": "FAPA",
      "company_name": "PT FAP Agri Tbk",
      "ipo_date": "4 Jan 2021",
      "general_sector": "Consumer Non-Cyclicals",
      "specific_sector": "Agricultural Products",
      "shares_offered": "3.629.411.800",
      "total_value": "1.001.718",
      "ipo_price": "1.840",
      "underwriters": "PT BCA Sekuritas",
      "lead_underwriter": "PT BCA Sekuritas",
      "accounting_firm": "KAP Gani Sigiro & Handayani",
      "legal_consultant": "Irma & Solomon Law Firm",
      "assets_growth_1y": "9%",
      "liabilities_growth_1y": "0%",
      "revenue_growth_1y": "42%",
      "net_income_growth_1y": "84%",
      "performance_metrics": [
         { "metric_name": "return", "metric_value": 25, "period_days": 1 },
         { "metric_name": "return", "metric_value": 42, "period_days": 7 },
         { "metric_name": "return", "metric_value": 33, "period_days": 30 },
         { "metric_name": "return", "metric_value": 51, "period_days": 180 },
         { "metric_value": 74, "period_days": 365 }
      ]
   }
]
```

### 2. Simpan sebagai `ipo-data.json`

Simpan file JSON di folder `scripts/ipo-data.json`

### 3. Jalankan Script

```bash
node scripts/bulk-insert-ipo.js
```

### 4. Copy SQL ke Supabase

Script akan generate file `scripts/bulk-insert-ipo.sql`. Copy isinya dan jalankan di Supabase SQL Editor.

## Mapping Kolom Excel

| Excel Column             | JSON Field               | Notes                                             |
| ------------------------ | ------------------------ | ------------------------------------------------- |
| Kode                     | `ticker_symbol`          | Required                                          |
| Nama Perusahaan Tercatat | `company_name`           | Required                                          |
| Tanggal                  | `ipo_date`               | Format: "4 Jan 2021" atau "2021-01-04"            |
| Sektor Umum              | `general_sector`         | Optional                                          |
| Sektor Khusus            | `specific_sector`        | Optional                                          |
| Saham Ditawarkan         | `shares_offered`         | Number (akan remove dots)                         |
| Total Nilai              | `total_value`            | Number (akan remove dots)                         |
| Harga IPO                | `ipo_price`              | Number (akan remove dots)                         |
| Penjamin Emisi           | `underwriters`           | String, bisa multiple (pisah dengan `;` atau `,`) |
| Penjamin Emisi           | `lead_underwriter`       | String                                            |
| Akuntan Publik           | `accounting_firm`        | String                                            |
| Konsultan Hukum          | `legal_consultant`       | String                                            |
| Aset (1Y)                | `assets_growth_1y`       | Percentage (akan remove `%`)                      |
| Liabilitas (1Y)          | `liabilities_growth_1y`  | Percentage                                        |
| Pendapatan (1Y)          | `revenue_growth_1y`      | Percentage                                        |
| Laba (1Y)                | `net_income_growth_1y`   | Percentage                                        |
| 1D                       | `performance_metrics[0]` | `{metric_value: X, period_days: 1}`               |
| 1W                       | `performance_metrics[1]` | `{metric_value: X, period_days: 7}`               |
| 1M                       | `performance_metrics[2]` | `{metric_value: X, period_days: 30}`              |
| 6M                       | `performance_metrics[3]` | `{metric_value: X, period_days: 180}`             |
| 1Y                       | `performance_metrics[4]` | `{metric_value: X, period_days: 365}`             |

## Tips Convert Excel ke JSON

### Opsi 1: Manual (untuk data kecil)

1. Copy data dari Excel
2. Paste ke [JSON Formatter](https://jsonformatter.org/)
3. Manual edit sesuai format

### Opsi 2: Excel Formula (untuk data banyak)

Gunakan formula Excel untuk generate JSON:

```excel
="{"&CHAR(34)&"ticker_symbol"&CHAR(34)&":"&CHAR(34)&A2&CHAR(34)&","&CHAR(34)&"company_name"&CHAR(34)&":"&CHAR(34)&B2&CHAR(34)&"...}"
```

### Opsi 3: Python Script (Recommended)

Buat script Python untuk convert Excel langsung:

```python
import pandas as pd
import json

df = pd.read_excel('ipo-data.xlsx')

# Convert to JSON format
data = []
for _, row in df.iterrows():
    item = {
        "ticker_symbol": str(row['Kode']),
        "company_name": str(row['Nama Perusahaan Tercatat']),
        "ipo_date": str(row['Tanggal']),
        # ... mapping lainnya
    }
    data.append(item)

with open('ipo-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

## Catatan Penting

-  Script menggunakan `ON CONFLICT`, jadi aman dijalankan berkali-kali
-  Data yang sudah ada akan di-update
-  Underwriter akan auto-create jika belum ada
-  Performance metrics akan di-replace (delete old, insert new)
-  Nilai `-` atau kosong akan di-convert jadi `NULL`

## Troubleshooting

### Error: File tidak ditemukan

Pastikan file `ipo-data.json` ada di folder `scripts/`

### Error: Invalid JSON

Validasi JSON di [JSONLint](https://jsonlint.com/)

### Error di Supabase: Duplicate key

Normal, karena menggunakan `ON CONFLICT`. Data akan di-update.
