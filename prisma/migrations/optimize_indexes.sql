-- 1. Enable Fuzzy Search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Optimize Recent Posts Feed (Composite Index)
CREATE INDEX IF NOT EXISTS idx_articles_status_published 
ON articles(status, published_at DESC);

-- 3. Optimize Category Filtering
CREATE INDEX IF NOT EXISTS idx_articles_category 
ON articles(category);

-- 4. Optimize Slug Lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug 
ON articles(slug);

-- 5. Optimize Featured Section (Partial Index)
CREATE INDEX IF NOT EXISTS idx_articles_is_featured 
ON articles(is_featured) 
WHERE is_featured = true;

-- 6. Full Text Search Index (GIN)
CREATE INDEX IF NOT EXISTS idx_articles_search 
ON articles USING GIN (title gin_trgm_ops);
