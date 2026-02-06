-- Add detailed columns to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS bedrooms INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS bathrooms INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS amenities TEXT; -- Comma separated list for now

-- Initial seed data update (optional, just ensuring existing rows don't break app)
UPDATE public.properties SET description = 'A wonderful place for students.', amenities = 'Water,Electricity,Security' WHERE description IS NULL;
