
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create function to auto-grow garden daily
CREATE OR REPLACE FUNCTION public.auto_grow_garden()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  garden_record RECORD;
  new_flowers jsonb;
  tulip_id text;
  daisy_id text;
  pos_x double precision;
  pos_y double precision;
  today date := CURRENT_DATE;
BEGIN
  SELECT * INTO garden_record FROM public.secret_garden LIMIT 1;
  
  IF garden_record IS NULL THEN
    RETURN;
  END IF;
  
  -- Skip if already grew today
  IF garden_record.last_growth_date = today THEN
    RETURN;
  END IF;
  
  -- Generate random flower positions
  pos_x := 5 + random() * 85;
  pos_y := 45 + random() * 45;
  tulip_id := 'tulip-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 9);
  daisy_id := 'daisy-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 9);
  
  -- Create tulip and daisy pair
  new_flowers := garden_record.flowers || jsonb_build_array(
    jsonb_build_object(
      'id', tulip_id,
      'type', 'tulip',
      'x', pos_x,
      'y', pos_y,
      'scale', 0.9 + random() * 0.2,
      'rotation', random() * 6 - 3,
      'plantedAt', now()::text
    ),
    jsonb_build_object(
      'id', daisy_id,
      'type', 'daisy',
      'x', LEAST(pos_x + 2.5, 94),
      'y', pos_y,
      'scale', 0.85 + random() * 0.15,
      'rotation', random() * 4 - 2,
      'plantedAt', now()::text
    )
  );
  
  UPDATE public.secret_garden
  SET flowers = new_flowers,
      last_growth_date = today,
      tulip_count = garden_record.tulip_count + 1,
      daisy_count = garden_record.daisy_count + 1,
      days_cared = garden_record.days_cared + 1
  WHERE id = garden_record.id;
END;
$$;
