/**
 * Helper script untuk convert Excel ke JSON
 * Butuh: npm install xlsx
 * 
 * Cara pakai:
 * node scripts/convert-excel-to-json.js path/to/excel-file.xlsx
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = process.argv[2];

if (!excelPath) {
   console.error('Usage: node convert-excel-to-json.js <excel-file.xlsx>');
   process.exit(1);
}

try {
   // Read Excel file
   const workbook = XLSX.readFile(excelPath);
   const sheetName = workbook.SheetNames[0]; // Use first sheet
   const worksheet = workbook.Sheets[sheetName];
   
   // Convert to JSON
   const data = XLSX.utils.sheet_to_json(worksheet);
   
   // Map Excel columns to JSON format
   const mappedData = data.map((row, index) => {
      // Helper to get value or null
      const get = (key) => {
         const val = row[key];
         if (val === undefined || val === null || val === '' || val === '-') return null;
         return String(val).trim();
      };
      
      // Helper to parse number (remove dots as thousands separator)
      const getNumber = (key) => {
         const val = get(key);
         if (!val) return null;
         const cleaned = val.replace(/\./g, '').replace(/,/g, '');
         const num = parseFloat(cleaned);
         return isNaN(num) ? null : num;
      };
      
      // Helper to parse percentage
      const getPercent = (key) => {
         const val = get(key);
         if (!val) return null;
         const cleaned = val.replace(/%/g, '').trim();
         const num = parseFloat(cleaned);
         return isNaN(num) ? null : num;
      };
      
      // Build performance metrics array
      const metrics = [];
      const day1 = getPercent('1D');
      const week1 = getPercent('1W');
      const month1 = getPercent('1M');
      const month6 = getPercent('6M');
      const year1 = getPercent('1Y');
      
      if (day1 !== null) metrics.push({ metric_name: 'return', metric_value: day1, period_days: 1 });
      if (week1 !== null) metrics.push({ metric_name: 'return', metric_value: week1, period_days: 7 });
      if (month1 !== null) metrics.push({ metric_name: 'return', metric_value: month1, period_days: 30 });
      if (month6 !== null) metrics.push({ metric_name: 'return', metric_value: month6, period_days: 180 });
      if (year1 !== null) metrics.push({ metric_name: 'return', metric_value: year1, period_days: 365 });
      
      return {
         ticker_symbol: get('Kode') || get('kode') || get('Ticker') || get('ticker_symbol'),
         company_name: get('Nama Perusahaan Tercatat') || get('Nama Perusahaan') || get('company_name'),
         ipo_date: get('Tanggal') || get('Tanggal Pencatatan') || get('ipo_date'),
         general_sector: get('Sektor Umum') || get('Sektor') || get('general_sector'),
         specific_sector: get('Sektor Khusus') || get('Industri') || get('specific_sector'),
         shares_offered: getNumber('Saham Ditawarkan') || getNumber('Jumlah Saham Dicatatkan') || getNumber('shares_offered'),
         total_value: getNumber('Total Nilai') || getNumber('Nilai Dana Dihimpun') || getNumber('total_value'),
         ipo_price: getNumber('Harga IPO') || getNumber('ipo_price'),
         underwriters: get('Penjamin Emisi') || get('Penjamin Pelaksana Emisi') || get('underwriters'),
         lead_underwriter: get('Penjamin Emisi') || get('Penjamin Pelaksana Emisi') || get('lead_underwriter'),
         accounting_firm: get('Akuntan Publik') || get('Kantor Akuntan Publik') || get('accounting_firm'),
         legal_consultant: get('Konsultan Hukum') || get('legal_consultant'),
         assets_growth_1y: getPercent('Aset') || getPercent('Aset (1Y)') || getPercent('assets_growth_1y'),
         liabilities_growth_1y: getPercent('Liabilitas') || getPercent('Liabilitas (1Y)') || getPercent('liabilities_growth_1y'),
         revenue_growth_1y: getPercent('Pendapatan') || getPercent('Pendapatan (1Y)') || getPercent('revenue_growth_1y'),
         net_income_growth_1y: getPercent('Laba') || getPercent('Laba Bersih') || getPercent('Laba (1Y)') || getPercent('net_income_growth_1y'),
         performance_metrics: metrics.length > 0 ? metrics : []
      };
   }).filter(item => item.ticker_symbol && item.company_name); // Filter out invalid rows
   
   // Write to JSON file
   const outputPath = path.join(__dirname, 'ipo-data.json');
   fs.writeFileSync(outputPath, JSON.stringify(mappedData, null, 2), 'utf8');
   
   console.log(`✅ Converted ${mappedData.length} rows to ${outputPath}`);
   console.log(`\n📝 Next step: Run 'node scripts/bulk-insert-ipo.js' to generate SQL`);
   
} catch (error) {
   console.error('Error:', error.message);
   console.error('\nMake sure you have xlsx installed: npm install xlsx');
   process.exit(1);
}

