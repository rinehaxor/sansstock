
-- ============================================
-- BULK INSERT IPO LISTINGS
-- Generated: 2025-11-16T10:37:41.441Z
-- Total: 17 listings
-- ============================================

-- Step 1: Insert/Update Underwriters

INSERT INTO underwriters (name) 
VALUES ('PT MNC Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT KB Valbury Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Shinhan Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Elit Sukses Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT UOB Kay Hian Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Panca Global Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT BNI Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT NH Korindo Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Artha Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT KGI Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Waterfront Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Korea Investment and Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Erdikha Elit Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Indo Premier Sekuritas') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT Maybank Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO underwriters (name) 
VALUES ('PT OCBC Sekuritas Indonesia') 
ON CONFLICT (name) DO NOTHING;

-- Step 2: Insert/Update IPO Listings

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'MSIE',
   'PT Multisarana Intan Eduka Tbk',
   '2023-08-10',
   'Properties & Real Estate',
   'Real Estate Management & Development',
   1460000000,
   36000,
   100,
   -4,
   -16,
   23,
   -260,
   'PT MNC Sekuritas',
   'KAP Kanaka Puradiredja, Suhartono',
   'Imran Mumtaz & Co.'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'RSCH',
   'PT Charlie Hospital Semarang Tbk',
   '2023-08-28',
   'Healthcare',
   'Healthcare Providers',
   2650000000,
   60950,
   115,
   25,
   1046,
   15,
   216,
   'PT Shinhan Sekuritas Indonesia',
   'KAP Dra. Suhartati & Rekan',
   'Wardhana Kristanto'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'BABY',
   'PT Multitrend Indo Tbk',
   '2023-09-07',
   'Consumer Cyclicals',
   'Specialty Retail',
   2668586400,
   142044,
   266,
   -13,
   -13,
   4,
   174,
   'PT UOB Kay Hian Sekuritas',
   'KAP Kanaka Puradiredja, Suhartono',
   'Konsultan Tumbuan & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'AEGS',
   'PT Anugerah Spareparts Sejahtera Tbk',
   '2023-09-11',
   'Consumer Cyclicals',
   'Auto Components',
   1006000000,
   40000,
   100,
   2,
   7,
   -5,
   7,
   'PT Shinhan Sekuritas Indonesia',
   'KAP Maurice Ganda Nainggolan dan Rekan',
   'Kantor Hukum Bambang Sugeng'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'KOCI',
   'PT Kokoh Exa Nusantara Tbk',
   '2023-10-06',
   'Properties & Real Estate',
   'Real Estate Management & Development',
   4415590000,
   54000,
   120,
   6,
   0,
   -6,
   -5,
   'PT Panca Global Sekuritas',
   'HLB HADORI SUGIARTO ADI DAN REKAN',
   'WARDHANA KRISTANTO LAWYERS'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'IOTF',
   'PT Sumber Sinergi Makmur Tbk',
   '2023-10-06',
   'Technology',
   'Electronic Equipment, Instruments & Components',
   5280000000,
   110000,
   100,
   3,
   21,
   -11,
   -92,
   'PT KB Valbury Sekuritas',
   'KAP Doli, Bambang, Sulistiyanto, Dadang & Ali',
   'Imran Muntaz & Co (“IMCO”)'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'BREN',
   'PT Barito Renewables Energy Tbk',
   '2023-10-09',
   'Infrastructures',
   'Electric Utilities',
   133786220000,
   3131700,
   780,
   8,
   7,
   0,
   7,
   'PT BNI Sekuritas',
   'KAP Tanudiredja, Wibisana, Rintis & Rekan (firma anggota jaringan global PwC)',
   'Assegaf, Hamzah & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'PTPS',
   'PT Pulau Subur Tbk',
   '2023-10-09',
   'Consumer Cyclicals',
   'Agricultural Products',
   2167500000,
   89100,
   198,
   13,
   -12,
   3,
   4,
   'PT NH Korindo Sekuritas Indonesia',
   'KAP Jimmy Budhi & Rekan',
   'Nugroho, Panjaitan & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'STRK',
   'PT Lovina Beach Brewery Tbk',
   '2023-10-10',
   'Consumer Non-Cyclicals',
   'Beverages',
   10721709000,
   118000,
   100,
   -10,
   11,
   -52,
   -264,
   'PT Artha Sekuritas Indonesia',
   'KAP Tjahjadi & Tamara',
   'Imran Muntaz & Co Law Firm'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'KOKA',
   'PT Koka Indonesia Tbk',
   '2023-10-11',
   'Infrastructures',
   'Heavy Constructions & Civil Engineering',
   2861333000,
   91563,
   128,
   1,
   -14,
   -66,
   -53,
   'PT KGI Sekuritas Indonesia',
   'KAP Hadori Sugiarto Adi & Rekan',
   'Warens & Partners Law Firm'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'LOPI',
   'PT Logisticsplus International Tbk',
   '2023-10-11',
   'Transportation & Logistic',
   'Logistics & Deliveries',
   1100000000,
   30000,
   100,
   -3,
   -20,
   5,
   53,
   'PT Elit Sukses Sekuritas',
   'KAP Jamaludin, Ardi, Sukimto & Rekan',
   'ASNP Law Office'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'UDNG',
   'PT Agro Bahari Nusantara Tbk',
   '2023-10-31',
   'Consumer Non-Cyclicals',
   'Agricultural Products',
   1750000000,
   50000,
   100,
   -4,
   79,
   -62,
   -2299,
   'PT MNC Sekuritas',
   'KAP Gideon Adi & Rekan',
   'Genio Atyanto & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'RGAS',
   'PT Kian Santang Muliatama Tbk',
   '2023-11-08',
   'Energy',
   'Oil, Gas & Coal Supports',
   1459200000,
   40104,
   120,
   94,
   1714,
   13,
   -59,
   'PT Erdikha Elit Sekuritas',
   'Mennix & Rekan',
   'ASET Law Firm'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'MSTI',
   'PT Mastersystem Infotama Tbk',
   '2023-11-08',
   'Technology',
   'Networking Equipment',
   3138823600,
   637966,
   1355,
   1,
   -16,
   28,
   18,
   'PT Indo Premier Sekuritas',
   'KAP Mirawati Sensi Idris',
   'Assegaf Hamzah & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'IKPM',
   'PT Ikapharmindo Putramas Tbk',
   '2023-11-08',
   'Healthcare',
   'Pharmaceuticals',
   1684662500,
   55594,
   165,
   6,
   12,
   -7,
   -67,
   'PT OCBC Sekuritas Indonesia',
   'KAP Kanaka Puradiredja, Suhartono',
   'Armand Yapsunto Muharamsyah & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'AYAM',
   'PT Janu Putra Sejahtera Tbk',
   '2023-11-30',
   'Consumer Non-Cyclicals',
   'Agricultural Products',
   4000000000,
   80000,
   100,
   31,
   68,
   3,
   -20,
   'PT UOB Kay Hian Sekuritas',
   'KAP Jamaludin, Ardi, Sukimto & Rekan',
   'ANRA & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

INSERT INTO ipo_listings (
   ticker_symbol, company_name, ipo_date,
   general_sector, specific_sector,
   shares_offered, total_value, ipo_price,
   assets_growth_1y, liabilities_growth_1y, revenue_growth_1y, net_income_growth_1y,
   lead_underwriter, accounting_firm, legal_consultant
) VALUES (
   'SURI',
   'PT Maja Agung Latexindo Tbk',
   '2023-12-07',
   'Healthcare',
   'Healthcare Equipment & Supplies',
   6334375000,
   215369,
   170,
   -2,
   -10,
   43,
   -171,
   'PT Shinhan Sekuritas Indonesia',
   'KAP Morhan dan Rekan',
   'Hanafiah Ponggawa & Partners'
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
   legal_consultant = EXCLUDED.legal_consultant;

-- Step 3: Link IPO to Underwriters
-- Note: This uses a subquery to get IDs, so it's safe to run multiple times

-- Link underwriters for MSIE
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'MSIE');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT MNC Sekuritas','PT KB Valbury Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'MSIE'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for RSCH
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'RSCH');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Shinhan Sekuritas Indonesia','PT Elit Sukses Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'RSCH'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for BABY
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'BABY');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT UOB Kay Hian Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'BABY'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for AEGS
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'AEGS');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Shinhan Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'AEGS'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for KOCI
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'KOCI');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Panca Global Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'KOCI'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for IOTF
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'IOTF');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT KB Valbury Sekuritas','PT Shinhan Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'IOTF'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for BREN
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'BREN');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT BNI Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'BREN'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for PTPS
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'PTPS');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT NH Korindo Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'PTPS'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for STRK
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'STRK');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Artha Sekuritas Indonesia','PT Panca Global Sekuritas','PT KGI Sekuritas Indonesia','PT Waterfront Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'STRK'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for KOKA
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'KOKA');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT KGI Sekuritas Indonesia','PT UOB Kay Hian Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'KOKA'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for LOPI
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'LOPI');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Elit Sukses Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'LOPI'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for UDNG
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'UDNG');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT MNC Sekuritas','PT Korea Investment and Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'UDNG'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for RGAS
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'RGAS');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Erdikha Elit Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'RGAS'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for MSTI
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'MSTI');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Indo Premier Sekuritas','PT Maybank Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'MSTI'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for IKPM
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'IKPM');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT OCBC Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'IKPM'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for AYAM
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'AYAM');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT UOB Kay Hian Sekuritas']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'AYAM'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Link underwriters for SURI
DELETE FROM ipo_underwriters 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'SURI');

INSERT INTO ipo_underwriters (ipo_listing_id, underwriter_id)
SELECT DISTINCT
   i.id as ipo_listing_id,
   u.id as underwriter_id
FROM ipo_listings i
CROSS JOIN LATERAL unnest(ARRAY['PT Shinhan Sekuritas Indonesia']::text[]) AS uw_name
JOIN underwriters u ON u.name = uw_name
WHERE i.ticker_symbol = 'SURI'
ON CONFLICT (ipo_listing_id, underwriter_id) DO NOTHING;

-- Step 4: Insert Performance Metrics
-- Note: Delete existing metrics first, then insert new ones

-- Metrics for MSIE
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'MSIE');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -10, 1
FROM ipo_listings WHERE ticker_symbol = 'MSIE';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -40, 7
FROM ipo_listings WHERE ticker_symbol = 'MSIE';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -58, 30
FROM ipo_listings WHERE ticker_symbol = 'MSIE';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -76, 180
FROM ipo_listings WHERE ticker_symbol = 'MSIE';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -85, 365
FROM ipo_listings WHERE ticker_symbol = 'MSIE';

-- Metrics for RSCH
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'RSCH');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 14, 1
FROM ipo_listings WHERE ticker_symbol = 'RSCH';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 16, 7
FROM ipo_listings WHERE ticker_symbol = 'RSCH';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 5, 30
FROM ipo_listings WHERE ticker_symbol = 'RSCH';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 30, 180
FROM ipo_listings WHERE ticker_symbol = 'RSCH';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 178, 365
FROM ipo_listings WHERE ticker_symbol = 'RSCH';

-- Metrics for BABY
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'BABY');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 9, 1
FROM ipo_listings WHERE ticker_symbol = 'BABY';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -2, 7
FROM ipo_listings WHERE ticker_symbol = 'BABY';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 2, 30
FROM ipo_listings WHERE ticker_symbol = 'BABY';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -43, 180
FROM ipo_listings WHERE ticker_symbol = 'BABY';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -22, 365
FROM ipo_listings WHERE ticker_symbol = 'BABY';

-- Metrics for AEGS
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'AEGS');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -5, 1
FROM ipo_listings WHERE ticker_symbol = 'AEGS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -32, 7
FROM ipo_listings WHERE ticker_symbol = 'AEGS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -41, 30
FROM ipo_listings WHERE ticker_symbol = 'AEGS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -10, 180
FROM ipo_listings WHERE ticker_symbol = 'AEGS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -62, 365
FROM ipo_listings WHERE ticker_symbol = 'AEGS';

-- Metrics for KOCI
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'KOCI');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -30, 1
FROM ipo_listings WHERE ticker_symbol = 'KOCI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -43, 7
FROM ipo_listings WHERE ticker_symbol = 'KOCI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -58, 30
FROM ipo_listings WHERE ticker_symbol = 'KOCI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -52, 180
FROM ipo_listings WHERE ticker_symbol = 'KOCI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -57, 365
FROM ipo_listings WHERE ticker_symbol = 'KOCI';

-- Metrics for IOTF
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'IOTF');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 35, 1
FROM ipo_listings WHERE ticker_symbol = 'IOTF';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 5, 7
FROM ipo_listings WHERE ticker_symbol = 'IOTF';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 9, 30
FROM ipo_listings WHERE ticker_symbol = 'IOTF';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 37, 180
FROM ipo_listings WHERE ticker_symbol = 'IOTF';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 35, 365
FROM ipo_listings WHERE ticker_symbol = 'IOTF';

-- Metrics for BREN
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'BREN');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 25, 1
FROM ipo_listings WHERE ticker_symbol = 'BREN';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 203, 7
FROM ipo_listings WHERE ticker_symbol = 'BREN';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 464, 30
FROM ipo_listings WHERE ticker_symbol = 'BREN';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 788, 180
FROM ipo_listings WHERE ticker_symbol = 'BREN';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 759, 365
FROM ipo_listings WHERE ticker_symbol = 'BREN';

-- Metrics for PTPS
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'PTPS');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -35, 1
FROM ipo_listings WHERE ticker_symbol = 'PTPS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -47, 7
FROM ipo_listings WHERE ticker_symbol = 'PTPS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -30, 30
FROM ipo_listings WHERE ticker_symbol = 'PTPS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -10, 180
FROM ipo_listings WHERE ticker_symbol = 'PTPS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -59, 365
FROM ipo_listings WHERE ticker_symbol = 'PTPS';

-- Metrics for STRK
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'STRK');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 35, 1
FROM ipo_listings WHERE ticker_symbol = 'STRK';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 128, 7
FROM ipo_listings WHERE ticker_symbol = 'STRK';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 210, 30
FROM ipo_listings WHERE ticker_symbol = 'STRK';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -50, 180
FROM ipo_listings WHERE ticker_symbol = 'STRK';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -50, 365
FROM ipo_listings WHERE ticker_symbol = 'STRK';

-- Metrics for KOKA
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'KOKA');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 33, 1
FROM ipo_listings WHERE ticker_symbol = 'KOKA';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -13, 7
FROM ipo_listings WHERE ticker_symbol = 'KOKA';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -52, 30
FROM ipo_listings WHERE ticker_symbol = 'KOKA';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -47, 180
FROM ipo_listings WHERE ticker_symbol = 'KOKA';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -52, 365
FROM ipo_listings WHERE ticker_symbol = 'KOKA';

-- Metrics for LOPI
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'LOPI');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -10, 1
FROM ipo_listings WHERE ticker_symbol = 'LOPI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -14, 7
FROM ipo_listings WHERE ticker_symbol = 'LOPI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -30, 30
FROM ipo_listings WHERE ticker_symbol = 'LOPI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -47, 180
FROM ipo_listings WHERE ticker_symbol = 'LOPI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -76, 365
FROM ipo_listings WHERE ticker_symbol = 'LOPI';

-- Metrics for UDNG
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'UDNG');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 10, 1
FROM ipo_listings WHERE ticker_symbol = 'UDNG';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -5, 7
FROM ipo_listings WHERE ticker_symbol = 'UDNG';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 20, 30
FROM ipo_listings WHERE ticker_symbol = 'UDNG';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -36, 180
FROM ipo_listings WHERE ticker_symbol = 'UDNG';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -50, 365
FROM ipo_listings WHERE ticker_symbol = 'UDNG';

-- Metrics for RGAS
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'RGAS');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 4, 1
FROM ipo_listings WHERE ticker_symbol = 'RGAS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -8, 7
FROM ipo_listings WHERE ticker_symbol = 'RGAS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -13, 30
FROM ipo_listings WHERE ticker_symbol = 'RGAS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -21, 180
FROM ipo_listings WHERE ticker_symbol = 'RGAS';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -13, 365
FROM ipo_listings WHERE ticker_symbol = 'RGAS';

-- Metrics for MSTI
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'MSTI');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 7, 1
FROM ipo_listings WHERE ticker_symbol = 'MSTI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 2, 7
FROM ipo_listings WHERE ticker_symbol = 'MSTI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 0, 30
FROM ipo_listings WHERE ticker_symbol = 'MSTI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 11, 180
FROM ipo_listings WHERE ticker_symbol = 'MSTI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 14, 365
FROM ipo_listings WHERE ticker_symbol = 'MSTI';

-- Metrics for IKPM
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'IKPM');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 10, 1
FROM ipo_listings WHERE ticker_symbol = 'IKPM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 5, 7
FROM ipo_listings WHERE ticker_symbol = 'IKPM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 16, 30
FROM ipo_listings WHERE ticker_symbol = 'IKPM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 52, 180
FROM ipo_listings WHERE ticker_symbol = 'IKPM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 67, 365
FROM ipo_listings WHERE ticker_symbol = 'IKPM';

-- Metrics for AYAM
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'AYAM');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 35, 1
FROM ipo_listings WHERE ticker_symbol = 'AYAM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 11, 7
FROM ipo_listings WHERE ticker_symbol = 'AYAM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 10, 30
FROM ipo_listings WHERE ticker_symbol = 'AYAM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 7, 180
FROM ipo_listings WHERE ticker_symbol = 'AYAM';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', 49, 365
FROM ipo_listings WHERE ticker_symbol = 'AYAM';

-- Metrics for SURI
DELETE FROM ipo_performance_metrics 
WHERE ipo_listing_id = (SELECT id FROM ipo_listings WHERE ticker_symbol = 'SURI');

INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -5, 1
FROM ipo_listings WHERE ticker_symbol = 'SURI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -4, 7
FROM ipo_listings WHERE ticker_symbol = 'SURI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -1, 30
FROM ipo_listings WHERE ticker_symbol = 'SURI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -18, 180
FROM ipo_listings WHERE ticker_symbol = 'SURI';
INSERT INTO ipo_performance_metrics (ipo_listing_id, metric_name, metric_value, period_days)
SELECT id, 'return', -71, 365
FROM ipo_listings WHERE ticker_symbol = 'SURI';

-- Done!
SELECT 'Import completed successfully!' as status;
