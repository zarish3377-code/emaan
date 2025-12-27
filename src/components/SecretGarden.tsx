import { useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useSecretGarden } from '@/hooks/useSecretGarden';
import * as THREE from 'three';
import Garden3DScene from './garden/Garden3DScene';
import gardenTulip from '@/assets/garden_tulip.png';
import gardenDaisy from '@/assets/garden_daisy.png';

interface SecretGardenProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecretGarden = ({ isOpen, onClose }: SecretGardenProps) => {
  const { garden, loading } = useSecretGarden();
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [tulipTexture, setTulipTexture] = useState<THREE.Texture | null>(null);
  const [daisyTexture, setDaisyTexture] = useState<THREE.Texture | null>(null);

  // Load textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    loader.load(gardenTulip, (texture) => {
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      setTulipTexture(texture);
    });
    
    loader.load(gardenDaisy, (texture) => {
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      setDaisyTexture(texture);
    });
  }, []);

  // Determine time of day based on real time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      setTimeOfDay(hour >= 6 && hour < 19 ? 'day' : 'night');
    };
    
    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const skyGradient = timeOfDay === 'day' 
    ? 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 30%, #E0F4FF 60%, #98D8AA 100%)'
    : 'linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #1a1a2e 60%, #2d4a3e 100%)';

  return (
    <div 
      className="fixed inset-0 z-50 transition-opacity duration-500"
      style={{
        background: skyGradient,
        opacity: isOpen ? 1 : 0,
      }}
    >
      {/* 3D Canvas */}
      <Garden3DScene 
        flowers={garden?.flowers || []}
        timeOfDay={timeOfDay}
        tulipTexture={tulipTexture}
        daisyTexture={daisyTexture}
      />

      {/* Stats panel */}
      <div 
        className="absolute top-4 right-4 px-4 py-3 rounded-xl backdrop-blur-sm z-10"
        style={{
          background: timeOfDay === 'day' 
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.3)',
          border: `1px solid ${timeOfDay === 'day' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        <div className={`font-serif text-sm space-y-1 ${timeOfDay === 'day' ? 'text-green-800' : 'text-green-200'}`}>
          <p>🌷 Tulips grown: {garden?.tulipCount || 0}</p>
          <p>🌼 Daisies grown: {garden?.daisyCount || 0}</p>
          <p>🌱 Days cared for: {garden?.daysCared || 0}</p>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110 z-10"
        style={{
          background: timeOfDay === 'day' 
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <X className={timeOfDay === 'day' ? 'text-green-800' : 'text-green-200'} size={24} />
      </button>

      {/* Quote at bottom */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p 
          className="font-serif text-sm italic text-white"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        >
          "Some things grow even when we're apart, just like our love for each other 🌷🌼"
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
          <p className="font-serif text-white text-lg">Growing your garden...</p>
        </div>
      )}
    </div>
  );
};

export default SecretGarden;
