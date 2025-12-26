-- Create a table to store the secret garden state
CREATE TABLE public.secret_garden (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  flowers JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_growth_date DATE,
  tulip_count INTEGER NOT NULL DEFAULT 0,
  daisy_count INTEGER NOT NULL DEFAULT 0,
  days_cared INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.secret_garden ENABLE ROW LEVEL SECURITY;

-- Anyone can view the garden (public feature)
CREATE POLICY "Anyone can view the garden" 
ON public.secret_garden 
FOR SELECT 
USING (true);

-- Anyone can insert garden record (only one will exist)
CREATE POLICY "Anyone can insert garden" 
ON public.secret_garden 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update the garden
CREATE POLICY "Anyone can update garden" 
ON public.secret_garden 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_secret_garden_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_secret_garden_updated_at
BEFORE UPDATE ON public.secret_garden
FOR EACH ROW
EXECUTE FUNCTION public.update_secret_garden_updated_at();