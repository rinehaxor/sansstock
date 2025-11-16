-- IPO Underwriter Performance History Schema
-- This schema supports tracking IPO listings and their underwriter performance

-- 1. Create underwriters table
CREATE TABLE IF NOT EXISTS underwriters (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create IPO listings table
CREATE TABLE IF NOT EXISTS ipo_listings (
    id BIGSERIAL PRIMARY KEY,
    ticker_symbol VARCHAR(10) NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    ipo_date DATE NOT NULL,
    general_sector TEXT,
    specific_sector TEXT,
    shares_offered BIGINT,
    total_value NUMERIC(18, 2),
    ipo_price NUMERIC(10, 2),
    assets_growth_1y NUMERIC(10, 2),
    liabilities_growth_1y NUMERIC(10, 2),
    revenue_growth_1y NUMERIC(10, 2),
    net_income_growth_1y NUMERIC(10, 2),
    lead_underwriter TEXT,
    accounting_firm TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create junction table for IPO listings and underwriters (many-to-many)
CREATE TABLE IF NOT EXISTS ipo_underwriters (
    id BIGSERIAL PRIMARY KEY,
    ipo_listing_id BIGINT NOT NULL REFERENCES ipo_listings(id) ON DELETE CASCADE,
    underwriter_id BIGINT NOT NULL REFERENCES underwriters(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ipo_listing_id, underwriter_id)
);

-- 4. Create IPO performance metrics table
CREATE TABLE IF NOT EXISTS ipo_performance_metrics (
    id BIGSERIAL PRIMARY KEY,
    ipo_listing_id BIGINT NOT NULL REFERENCES ipo_listings(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL, -- e.g., 'day_1_return', 'week_1_return', 'month_1_return', etc.
    metric_value NUMERIC(10, 2), -- Percentage value
    period_days INT, -- Number of days after IPO (e.g., 1, 7, 30, 90, 180, 365)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ipo_listing_id, metric_name, period_days)
);

-- 5. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ipo_listings_ticker ON ipo_listings(ticker_symbol);
CREATE INDEX IF NOT EXISTS idx_ipo_listings_ipo_date ON ipo_listings(ipo_date DESC);
CREATE INDEX IF NOT EXISTS idx_ipo_listings_sector ON ipo_listings(general_sector, specific_sector);
CREATE INDEX IF NOT EXISTS idx_ipo_underwriters_listing ON ipo_underwriters(ipo_listing_id);
CREATE INDEX IF NOT EXISTS idx_ipo_underwriters_underwriter ON ipo_underwriters(underwriter_id);
CREATE INDEX IF NOT EXISTS idx_ipo_performance_listing ON ipo_performance_metrics(ipo_listing_id);
CREATE INDEX IF NOT EXISTS idx_ipo_performance_period ON ipo_performance_metrics(period_days);

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_underwriters_updated_at ON underwriters;
CREATE TRIGGER update_underwriters_updated_at
    BEFORE UPDATE ON underwriters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ipo_listings_updated_at ON ipo_listings;
CREATE TRIGGER update_ipo_listings_updated_at
    BEFORE UPDATE ON ipo_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ipo_performance_metrics_updated_at ON ipo_performance_metrics;
CREATE TRIGGER update_ipo_performance_metrics_updated_at
    BEFORE UPDATE ON ipo_performance_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE underwriters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipo_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipo_underwriters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipo_performance_metrics ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for public read access
CREATE POLICY "Underwriters are viewable by everyone"
    ON underwriters FOR SELECT
    TO public
    USING (true);

CREATE POLICY "IPO listings are viewable by everyone"
    ON ipo_listings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "IPO underwriters are viewable by everyone"
    ON ipo_underwriters FOR SELECT
    TO public
    USING (true);

CREATE POLICY "IPO performance metrics are viewable by everyone"
    ON ipo_performance_metrics FOR SELECT
    TO public
    USING (true);

-- 10. RLS Policies for authenticated users (admin operations)
CREATE POLICY "Authenticated users can manage underwriters"
    ON underwriters FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage IPO listings"
    ON ipo_listings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage IPO underwriters"
    ON ipo_underwriters FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage IPO performance metrics"
    ON ipo_performance_metrics FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 11. Add comments for documentation
COMMENT ON TABLE underwriters IS 'List of underwriters that handle IPO listings';
COMMENT ON TABLE ipo_listings IS 'IPO listing information including company details and IPO date';
COMMENT ON TABLE ipo_underwriters IS 'Junction table linking IPO listings to their underwriters';
COMMENT ON TABLE ipo_performance_metrics IS 'Performance metrics for IPO listings over various time periods';

COMMENT ON COLUMN ipo_listings.ticker_symbol IS 'Stock ticker symbol (e.g., FAPA, DCII)';
COMMENT ON COLUMN ipo_listings.company_name IS 'Full company name (e.g., PT FAP Agri Tbk)';
COMMENT ON COLUMN ipo_listings.ipo_date IS 'Date when the IPO was launched';
COMMENT ON COLUMN ipo_listings.shares_offered IS 'Number of shares offered in the IPO';
COMMENT ON COLUMN ipo_listings.total_value IS 'Total value of the IPO';
COMMENT ON COLUMN ipo_listings.ipo_price IS 'IPO price per share';
COMMENT ON COLUMN ipo_performance_metrics.metric_name IS 'Name of the performance metric (e.g., return, gain)';
COMMENT ON COLUMN ipo_performance_metrics.metric_value IS 'Performance value as percentage';
COMMENT ON COLUMN ipo_performance_metrics.period_days IS 'Number of days after IPO for this metric';

-- 12. Create view for underwriter performance summary
CREATE OR REPLACE VIEW underwriter_performance_summary AS
SELECT 
    u.id AS underwriter_id,
    u.name AS underwriter_name,
    COUNT(DISTINCT iu.ipo_listing_id) AS total_ipos,
    AVG(ipm.metric_value) AS avg_return,
    MIN(ipm.metric_value) AS min_return,
    MAX(ipm.metric_value) AS max_return,
    ipm.period_days,
    ipm.metric_name
FROM underwriters u
LEFT JOIN ipo_underwriters iu ON u.id = iu.underwriter_id
LEFT JOIN ipo_performance_metrics ipm ON iu.ipo_listing_id = ipm.ipo_listing_id
GROUP BY u.id, u.name, ipm.period_days, ipm.metric_name;

-- Grant access to the view
GRANT SELECT ON underwriter_performance_summary TO public;

