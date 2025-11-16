/**
 * Script untuk bulk insert IPO listings ke Supabase
 *
 * Cara pakai:
 * 1. Convert Excel ke JSON (gunakan Excel/Google Sheets -> Export as JSON)
 * 2. Sesuaikan format JSON sesuai struktur di bawah
 * 3. Jalankan: node scripts/bulk-insert-ipo.js
 * 4. Copy output SQL dan jalankan di Supabase SQL Editor
 *
 * Format JSON yang diharapkan:
 * [
 *   {
 *     "ticker_symbol": "FAPA",
 *     "company_name": "PT FAP Agri Tbk",
 *     "ipo_date": "2021-01-04",
 *     "general_sector": "Consumer Non-Cyclicals",
 *     "specific_sector": "Agricultural Products",
 *     "shares_offered": 3629411800,
 *     "total_value": 1001718000000,
 *     "ipo_price": 1840,
 *     "underwriters": "PT BCA Sekuritas",
 *     "lead_underwriter": "PT BCA Sekuritas",
 *     "accounting_firm": "KAP Gani Sigiro & Handayani",
 *     "legal_consultant": "Irma & Solomon Law Firm",
 *     "assets_growth_1y": 9,
 *     "liabilities_growth_1y": 0,
 *     "revenue_growth_1y": 42,
 *     "net_income_growth_1y": 84,
 *     "performance_metrics": [
 *       { "metric_name": "return", "metric_value": 25, "period_days": 1 },
 *       { "metric_name": "return", "metric_value": 42, "period_days": 7 },
 *       { "metric_name": "return", "metric_value": 33, "period_days": 30 },
 *       { "metric_name": "return", "metric_value": 51, "period_days": 180 },
 *       { "metric_name": "return", "metric_value": 74, "period_days": 365 }
 *     ]
 *   }
 * ]
 */

const fs = require('fs');
const path = require('path');

// Helper functions
function escapeSQL(str) {
   if (str === null || str === undefined || str === '') return 'NULL';
   return `'${String(str).replace(/'/g, "''")}'`;
}

function formatDate(dateStr) {
   if (!dateStr) return 'NULL';
   // Handle various date formats
   // "4 Jan 2021" -> "2021-01-04"
   // "2021-01-04" -> "2021-01-04"
   if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return escapeSQL(dateStr);
   }

   // Try to parse "DD Mon YYYY" format
   const months = {
      jan: '01',
      feb: '02',
      mar: '03',
      apr: '04',
      may: '05',
      jun: '06',
      jul: '07',
      aug: '08',
      sep: '09',
      oct: '10',
      nov: '11',
      dec: '12',
   };

   const match = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/i);
   if (match) {
      const day = match[1].padStart(2, '0');
      const month = months[match[2].toLowerCase()] || '01';
      const year = match[3];
      return escapeSQL(`${year}-${month}-${day}`);
   }

   return escapeSQL(dateStr);
}

function parseNumber(value) {
   if (!value || value === '-' || value === '') return null;
   // Remove dots (thousands separator) and convert to number
   const cleaned = String(value).replace(/\./g, '').replace(/,/g, '');
   const num = parseFloat(cleaned);
   return isNaN(num) ? null : num;
}

function parsePercentage(value) {
   if (!value || value === '-' || value === '') return null;
   // Remove % sign and convert
   const cleaned = String(value).replace(/%/g, '').trim();
   const num = parseFloat(cleaned);
   return isNaN(num) ? null : num;
}

// Read JSON file
const jsonFilePath = path.join(__dirname, 'ipo-data.json');
let ipoData;

try {
   const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
   ipoData = JSON.parse(jsonContent);
} catch (error) {
   console.error('Error reading JSON file:', error.message);
   console.error('Please create ipo-data.json file in the scripts folder');
   process.exit(1);
}

if (!Array.isArray(ipoData)) {
   console.error('JSON file must contain an array of IPO listings');
   process.exit(1);
}

console.log(`Processing ${ipoData.length} IPO listings...\n`);

// Generate SQL
const sqlStatements = [];
const underwriterInserts = [];
const ipoUnderwriterLinks = [];
const performanceMetricsInserts = [];

// Track underwriters to create
const underwriterMap = new Map(); // name -> id (temporary)
let underwriterCounter = 1000; // Start from 1000 to avoid conflicts

ipoData.forEach((ipo, index) => {
   const ipoId = index + 1; // Temporary ID, will be replaced with actual ID from sequence

   // Parse underwriters
   let underwriterNames = [];
   if (ipo.underwriters) {
      if (typeof ipo.underwriters === 'string') {
         underwriterNames = ipo.underwriters
            .split(/[;,]/)
            .map((n) => n.trim())
            .filter((n) => n);
      } else if (Array.isArray(ipo.underwriters)) {
         underwriterNames = ipo.underwriters.map((n) => String(n).trim()).filter((n) => n);
      }
   }

   // Add lead_underwriter if exists
   if (ipo.lead_underwriter && !underwriterNames.includes(ipo.lead_underwriter)) {
      underwriterNames.push(ipo.lead_underwriter);
   }

   // Remove duplicates (case-insensitive)
   const uniqueNames = [];
   const seen = new Set();
   underwriterNames.forEach((name) => {
      const lower = name.toLowerCase();
      if (!seen.has(lower)) {
         seen.add(lower);
         uniqueNames.push(name);
      }
   });
   underwriterNames = uniqueNames;

   // Track underwriters
   underwriterNames.forEach((name) => {
      if (!underwriterMap.has(name)) {
         underwriterMap.set(name, underwriterCounter++);
      }
   });

   // Build IPO INSERT
   const ipoInsert = `
INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   ${escapeSQL(ipo.ticker_symbol)},
   ${escapeSQL(ipo.company_name)},
   ${formatDate(ipo.ipo_date)},
   ${ipo.general_sector ? escapeSQL(ipo.general_sector) : 'NULL'},
   ${ipo.specific_sector ? escapeSQL(ipo.specific_sector) : 'NULL'},
   ${ipo.shares_offered ? parseNumber(ipo.shares_offered) : 'NULL'},
   ${ipo.total_value ? parseNumber(ipo.total_value) : 'NULL'},
   ${ipo.ipo_price ? parseNumber(ipo.ipo_price) : 'NULL'},
   ${ipo.assets_growth_1y !== undefined && ipo.assets_growth_1y !== null ? parsePercentage(ipo.assets_growth_1y) : 'NULL'},
   ${ipo.liabilities_growth_1y !== undefined && ipo.liabilities_growth_1y !== null ? parsePercentage(ipo.liabilities_growth_1y) : 'NULL'},
   ${ipo.revenue_growth_1y !== undefined && ipo.revenue_growth_1y !== null ? parsePercentage(ipo.revenue_growth_1y) : 'NULL'},
   ${ipo.net_income_growth_1y !== undefined && ipo.net_income_growth_1y !== null ? parsePercentage(ipo.net_income_growth_1y) : 'NULL'},
   ${ipo.lead_underwriter ? escapeSQL(ipo.lead_underwriter) : 'NULL'},
   ${ipo.accounting_firm ? escapeSQL(ipo.accounting_firm) : 'NULL'},
   ${ipo.legal_consultant ? escapeSQL(ipo.legal_consultant) : 'NULL'}
) ON CONFLICT (ticker_symbol) DO UPDATE SET
   company_name = EXCLUDED.company_name,
   ipo_date = EXCLUDED.ipo_date,
   general_sector = EXCLUDED.general_sector,
   specific_sector = EXCLUDED.specific_sector,
   shares_offered = EXCLUDED.shares_offered,
   total_value = EXCLUDED.total_value,
   ipo_price = EXCLUDED.ipo_price,
   assets_growth_1y = EXCLUDED.assets_growth_1y,
   liabilities_growth_1y = EXCLUDED.liabilities_growth_1y,
   revenue_growth_1y = EXCLUDED.revenue_growth_1y,
   net_income_growth_1y = EXCLUDED.net_income_growth_1y,
   lead_underwriter = EXCLUDED.lead_underwriter,
   accounting_firm = EXCLUDED.accounting_firm,
   legal_consultant = EXCLUDED.legal_consultant;`;

   sqlStatements.push(ipoInsert);

   // Store underwriter links (will be generated after we have IPO IDs)
   if (underwriterNames.length > 0) {
      ipoUnderwriterLinks.push({
         ticker: ipo.ticker_symbol,
         underwriterNames: underwriterNames,
      });
   }

   // Store performance metrics
   if (ipo.performance_metrics && Array.isArray(ipo.performance_metrics)) {
      ipo.performance_metrics.forEach((metric) => {
         if (metric.period_days && metric.metric_value !== null && metric.metric_value !== undefined) {
            performanceMetricsInserts.push({
               ticker: ipo.ticker_symbol,
               metric_name: metric.metric_name || 'return',
               metric_value: metric.metric_value,
               period_days: metric.period_days,
            });
         }
      });
   }
});

// Generate underwriter INSERTs (with ON CONFLICT)
underwriterMap.forEach((tempId, name) => {
   const insert = `
INSERT INTO underwriters (name) 
VALUES (${escapeSQL(name)}) 
ON CONFLICT (name) DO NOTHING;`;
   underwriterInserts.push(insert);
});

// Generate final SQL script
const finalSQL = `
-- ============================================
-- BULK INSERT IPO LISTINGS
-- Generated: ${new Date().toISOString()}
-- Total: ${ipoData.length} listings
-- ============================================

-- Step 1: Insert/Update Underwriters
${underwriterInserts.join('\n')}

-- Step 2: Insert/Update IPO Listings
${sqlStatements.join('\n')}

-- Step 3: Link IPO to Underwriters
-- Note: This uses a subquery to get IDs, so it's safe to run multiple times
${ipoUnderwriterLinks
   .map((link) => {
      const ticker = link.ticker;
      // Remove duplicates from array before generating SQL
      const uniqueNames = Array.from(new Set(link.underwriterNames.map((n) => n.trim()))).filter((n) => n);
      const names = uniqueNames.map((n) => escapeSQL(n)).join(',');
      if (!names) return ''; // Skip if no underwriters

      return `
-- Link underwriters for ${ticker}
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = ${escapeSQL(ticker)});

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY[${names}]::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = ${escapeSQL(ticker)}
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;`;
   })
   .filter((s) => s)
   .join('\n')}

-- Step 4: Insert Performance Metrics
-- Note: Delete existing metrics first, then insert new ones
${ipoData
   .map((ipo) => {
      const metrics = ipo.performance_metrics || [];
      if (metrics.length === 0) return '';

      return `
-- Metrics for ${ipo.ticker_symbol}
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = ${escapeSQL(ipo.ticker_symbol)});

${metrics
   .filter((m) => m.period_days && m.metric_value !== null && m.metric_value !== undefined)
   .map((metric) => {
      return `INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, ${escapeSQL(metric.metric_name || 'return')}, ${metric.metric_value}, ${metric.period_days}
FROM ipo_listings WHERE ticker_symbol = ${escapeSQL(ipo.ticker_symbol)};`;
   })
   .join('\n')}`;
   })
   .filter((s) => s)
   .join('\n')}

-- Done!
SELECT 'Import completed successfully!' as status;
`;

// Write to file
const outputPath = path.join(__dirname, 'bulk-insert-ipo.sql');
fs.writeFileSync(outputPath, finalSQL, 'utf8');

console.log(`✅ SQL script generated: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`   - IPO Listings: ${ipoData.length}`);
console.log(`   - Unique Underwriters: ${underwriterMap.size}`);
console.log(`   - Performance Metrics: ${performanceMetricsInserts.length}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Review the SQL file: ${outputPath}`);
console.log(`   2. Open Supabase SQL Editor`);
console.log(`   3. Copy and paste the SQL content`);
console.log(`   4. Run the script`);
console.log(`\n⚠️  Note: This script uses ON CONFLICT, so it's safe to run multiple times.`);
