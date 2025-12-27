import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface Flower {
  id: string;
  type: 'tulip' | 'daisy';
  x: number; // percentage position
  y: number; // percentage position
  scale: number;
  rotation: number;
  plantedAt: string;
}

interface GardenState {
  id: string;
  startDate: string;
  flowers: Flower[];
  lastGrowthDate: string | null;
  tulipCount: number;
  daisyCount: number;
  daysCared: number;
}

const generateFlowerPosition = (existingFlowers: Flower[]): { x: number; y: number } => {
  // Generate position in bottom 60% of screen (grass area)
  // Avoid overlapping with existing flowers
  let attempts = 0;
  let x: number, y: number;
  
  do {
    x = 5 + Math.random() * 90; // 5-95% horizontal
    y = 45 + Math.random() * 50; // 45-95% vertical (grass area)
    attempts++;
  } while (
    attempts < 50 &&
    existingFlowers.some(f => 
      Math.abs(f.x - x) < 8 && Math.abs(f.y - y) < 10
    )
  );
  
  return { x, y };
};

const createFlowerPair = (existingFlowers: Flower[]): { tulip: Flower; daisy: Flower } => {
  const pos = generateFlowerPosition(existingFlowers);
  
  // Tulip on the left
  const tulip: Flower = {
    id: `tulip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'tulip',
    x: pos.x,
    y: pos.y,
    rotation: Math.random() * 6 - 3,
    scale: 0.9 + Math.random() * 0.2,
    plantedAt: new Date().toISOString(),
  };
  
  // Daisy right next to tulip (slightly to the right)
  const daisy: Flower = {
    id: `daisy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'daisy',
    x: Math.min(pos.x + 4, 92),
    y: pos.y + (Math.random() * 2 - 1),
    rotation: Math.random() * 6 - 3,
    scale: 0.9 + Math.random() * 0.2,
    plantedAt: new Date().toISOString(),
  };
  
  return { tulip, daisy };
};

const createFlower = (type: 'tulip' | 'daisy', existingFlowers: Flower[], basePosition?: { x: number; y: number }): Flower => {
  let pos: { x: number; y: number };
  
  if (basePosition) {
    pos = {
      x: Math.min(basePosition.x + 4, 92),
      y: basePosition.y + (Math.random() * 2 - 1),
    };
  } else {
    pos = generateFlowerPosition(existingFlowers);
  }
  
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    x: pos.x,
    y: pos.y,
    scale: 0.6 + Math.random() * 0.4, // 0.6 - 1.0
    rotation: -5 + Math.random() * 10, // -5 to 5 degrees
    plantedAt: new Date().toISOString(),
  };
};

export const useSecretGarden = () => {
  const [garden, setGarden] = useState<GardenState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGarden = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('secret_garden')
        .select('*')
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setGarden({
          id: data.id,
          startDate: data.start_date,
          flowers: (data.flowers as unknown as Flower[]) || [],
          lastGrowthDate: data.last_growth_date,
          tulipCount: data.tulip_count,
          daisyCount: data.daisy_count,
          daysCared: data.days_cared,
        });
      } else {
        // Create initial garden
        const { data: newGarden, error: insertError } = await supabase
          .from('secret_garden')
          .insert({
            start_date: new Date().toISOString().split('T')[0],
            flowers: [],
            tulip_count: 0,
            daisy_count: 0,
            days_cared: 0,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (newGarden) {
          setGarden({
            id: newGarden.id,
            startDate: newGarden.start_date,
            flowers: [],
            lastGrowthDate: null,
            tulipCount: 0,
            daisyCount: 0,
            daysCared: 0,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching garden:', err);
      setError('Failed to load garden');
    } finally {
      setLoading(false);
    }
  }, []);

  const growFlowers = useCallback(async () => {
    if (!garden) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already grew today
    if (garden.lastGrowthDate === today) {
      return;
    }

    // Create new flowers - tulip and daisy grow together as a pair
    const existingFlowers = [...garden.flowers];
    const { tulip: newTulip, daisy: newDaisy } = createFlowerPair(existingFlowers);
    existingFlowers.push(newTulip, newDaisy);

    const newTulipCount = garden.tulipCount + 1;
    const newDaisyCount = garden.daisyCount + 1;
    const newDaysCared = garden.daysCared + 1;

    try {
      const { error: updateError } = await supabase
        .from('secret_garden')
        .update({
          flowers: existingFlowers as unknown as Json,
          last_growth_date: today,
          tulip_count: newTulipCount,
          daisy_count: newDaisyCount,
          days_cared: newDaysCared,
        })
        .eq('id', garden.id);

      if (updateError) throw updateError;

      setGarden({
        ...garden,
        flowers: existingFlowers,
        lastGrowthDate: today,
        tulipCount: newTulipCount,
        daisyCount: newDaisyCount,
        daysCared: newDaysCared,
      });
    } catch (err) {
      console.error('Error growing flowers:', err);
    }
  }, [garden]);

  useEffect(() => {
    fetchGarden();
  }, [fetchGarden]);

  // Auto-grow when garden loads and hasn't grown today
  useEffect(() => {
    if (garden && !loading) {
      const today = new Date().toISOString().split('T')[0];
      if (garden.lastGrowthDate !== today) {
        growFlowers();
      }
    }
  }, [garden, loading, growFlowers]);

  return {
    garden,
    loading,
    error,
    growFlowers,
  };
};
