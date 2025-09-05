-- Create business_pages table for storing permanent business page HTML
CREATE TABLE business_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  html_content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_pages_business_id ON business_pages(business_id);
CREATE INDEX IF NOT EXISTS idx_business_pages_version ON business_pages(business_id, version);

-- Add RLS policy
ALTER TABLE business_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access for business pages (they are meant to be public)
CREATE POLICY "Allow public read access to business pages"
ON business_pages
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow business owners to manage their own pages
CREATE POLICY "Allow business owners to manage their pages"
ON business_pages
FOR ALL
TO authenticated
USING (
  business_id IN (
    SELECT b.id 
    FROM businesses b 
    WHERE b.email = ((SELECT auth.jwt()) ->> 'email')
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_business_pages_updated_at 
  BEFORE UPDATE ON business_pages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE business_pages IS 'Stores rendered HTML content for permanent business pages';
COMMENT ON COLUMN business_pages.html_content IS 'Pre-rendered HTML for fast serving';
COMMENT ON COLUMN business_pages.metadata IS 'Additional metadata about page generation';
COMMENT ON COLUMN business_pages.version IS 'Version number for page updates';