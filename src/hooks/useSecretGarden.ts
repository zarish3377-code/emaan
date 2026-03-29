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

// Grid layout: flowers arranged in rows and columns, alternating tulip/daisy
// Grid starts at grass area (top ~48%, bottom ~92%) and spans horizontally (5%-95%)
const GRID_CONFIG = {
  startX: 6,    // % from left
  endX: 95,     // % from right  
  startY: 48,   // % from top (grass area)
  endY: 90,     // % from bottom
  colSpacing: 5, // % between columns
  rowSpacing: 8, // % between rows
};

const getGridPosition = (index: number): { x: number; y: number; col: number; row: number } => {
  const cols = Math.floor((GRID_CONFIG.endX - GRID_CONFIG.startX) / GRID_CONFIG.colSpacing) + 1;
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  return {
    x: GRID_CONFIG.startX + col * GRID_CONFIG.colSpacing,
    y: GRID_CONFIG.startY + row * GRID_CONFIG.rowSpacing,
    col,
    row,
  };
};

const createGridFlower = (index: number): Flower => {
  const pos = getGridPosition(index);
  // Alternate: even index = tulip, odd index = daisy (checkerboard)
  // For checkerboard: if (row + col) is even → tulip, odd → daisy
  const type: 'tulip' | 'daisy' = (pos.row + pos.col) % 2 === 0 ? 'tulip' : 'daisy';
  
  return {
    id: `${type}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    x: pos.x,
    y: pos.y,
    scale: 0.95,
    rotation: 0,
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
    
    if (garden.lastGrowthDate === today) return;

    // Calculate total days from start to today
    const start = new Date(garden.startDate);
    const end = new Date(today);
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) return;

    // Rebuild entire grid based on total days
    // Each day = 1 flower in the grid (alternating tulip/daisy via checkerboard)
    const totalFlowers = totalDays;
    const newFlowers: Flower[] = [];
    
    for (let i = 0; i < totalFlowers; i++) {
      newFlowers.push(createGridFlower(i));
    }

    const newTulipCount = newFlowers.filter(f => f.type === 'tulip').length;
    const newDaisyCount = newFlowers.filter(f => f.type === 'daisy').length;

    try {
      const { error: updateError } = await supabase
        .from('secret_garden')
        .update({
          flowers: newFlowers as unknown as Json,
          last_growth_date: today,
          tulip_count: newTulipCount,
          daisy_count: newDaisyCount,
          days_cared: totalDays,
        })
        .eq('id', garden.id);

      if (updateError) throw updateError;

      setGarden({
        ...garden,
        flowers: newFlowers,
        lastGrowthDate: today,
        tulipCount: newTulipCount,
        daisyCount: newDaisyCount,
        daysCared: totalDays,
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
