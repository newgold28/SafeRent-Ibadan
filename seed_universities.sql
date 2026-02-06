-- Insert or Ignore all major Ibadan universities
INSERT INTO public.universities (name, short_name, location) VALUES
  ('University of Ibadan', 'UI', 'Ibadan'),
  ('The Polytechnic, Ibadan', 'Poly Ibadan', 'Ibadan'),
  ('Lead City University', 'LCU', 'Ibadan'),
  ('Dominican University', 'Dominican', 'Ibadan'),
  ('Kola Daisi University', 'KDU', 'Ibadan'),
  ('Technical University (Tech-U)', 'Tech-U', 'Ibadan'),
  ('Precious Cornerstone University', 'PCU', 'Ibadan'),
  ('Ajayi Crowther University', 'ACU', 'Oyo'), -- Nearby
  ('Ibadan City Polytechnic', 'ICP', 'Ibadan'),
  ('Ladoke Akintola University of Technology', 'LAUTECH', 'Ogbomoso') -- Often requested due to proximity
ON CONFLICT (name) DO NOTHING;
