-- Add missing universities
INSERT INTO public.universities (name, short_name, location) VALUES
  ('Dominion University', 'Dominion', 'Ibadan'),
  ('Ibadan City Polytechnic', 'ICP', 'Ibadan')
ON CONFLICT (name) DO NOTHING;

-- Get IDs for Universities (assuming standard order or fetching dynamically in app, but for seed we use subqueries)
-- We need to mock user owner_id. We'll use the authenticated user's ID if running in console, 
-- but for a script we assume a hardcoded placeholder or requirement to replace 'YOUR_USER_ID'.
-- IMPORTANT: User must Replace 'YOUR_USER_ID' with their actual Supabase User ID before running.

DO $$
DECLARE
  ui_id bigint;
  lead_id bigint;
  poly_id bigint;
  owner_uuid uuid; -- You need to set this to a real user ID from auth.users
BEGIN
  -- 1. GET A VALID USER ID (Pick the first one found, or replace with specific ID)
  SELECT id INTO owner_uuid FROM auth.users LIMIT 1;
  
  -- If no user exists, we cannot seed properties.
  IF owner_uuid IS NULL THEN
    RAISE NOTICE 'No users found in auth.users. Please sign up a user first.';
    RETURN;
  END IF;

  -- 2. GET UNIVERSITY IDs
  SELECT id INTO ui_id FROM public.universities WHERE short_name = 'UI' LIMIT 1;
  SELECT id INTO lead_id FROM public.universities WHERE short_name = 'LCU' LIMIT 1;
  SELECT id INTO poly_id FROM public.universities WHERE short_name = 'Poly Ibadan' LIMIT 1;

  -- 3. INSERT PROPERTIES (UI)
  INSERT INTO public.properties (title, price, category, location, image_url, landlord_phone, owner_id, status, university_id, verified) VALUES
  ('P.I. Hostel Luxury Room', 60000, 'Hostel', 'New Bodija, near UI', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08011111111', owner_uuid, 'approved', ui_id, true),
  ('A''s Kongi Lodge', 45000, 'Self Con', 'Kongi Area, UI', 'https://images.unsplash.com/photo-1522771753062-5885bb3bd6e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08022222222', owner_uuid, 'approved', ui_id, true),
  ('Iyalode Hub Premium', 600000, 'Flat', 'Near UI Gate', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08033333333', owner_uuid, 'approved', ui_id, true);

  -- 4. INSERT PROPERTIES (Lead City)
  INSERT INTO public.properties (title, price, category, location, image_url, landlord_phone, owner_id, status, university_id, verified) VALUES
  ('XXIV Rooms Premium', 800000, 'Hostel', '2 mins walk from Lead City', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08044444444', owner_uuid, 'approved', lead_id, true),
  ('Amazing Grace Apartments', 150000, 'Self Con', 'Toll Gate Area, Ibadan', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08055555555', owner_uuid, 'approved', lead_id, false);

  -- 5. INSERT PROPERTIES (Poly Ibadan)
  INSERT INTO public.properties (title, price, category, location, image_url, landlord_phone, owner_id, status, university_id, verified) VALUES
  ('Dorcas Olaore Upstairs', 200000, 'Self Con', 'Apete, beside Unity Hostel', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08066666666', owner_uuid, 'approved', poly_id, true),
  ('Toposyi Luxury Unit', 250000, 'Flat', 'Apete Area', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', '08077777777', owner_uuid, 'approved', poly_id, true);

END $$;
