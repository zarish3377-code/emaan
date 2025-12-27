import { useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useSecretGarden } from '@/hooks/useSecretGarden';
import gardenTulip from '@/assets/garden_tulip.png';
import gardenDaisy from '@/assets/garden_daisy.png';

interface SecretGardenProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecretGarden = ({ isOpen, onClose }: SecretGardenProps) => {
  const { garden, loading } = useSecretGarden();
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');

  // Determine time of day based on real time
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      setTimeOfDay(hour >= 6 && hour < 19 ? 'day' : 'night');
    };
    
    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Generate random animation delays for flowers
  const flowerAnimationDelays = useMemo(() => {
    if (!garden?.flowers) return {};
    return garden.flowers.reduce((acc, flower) => {
      acc[flower.id] = Math.random() * 3;
      return acc;
    }, {} as Record<string, number>);
  }, [garden?.flowers.length]);

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
      {/* Stars for night time */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 40 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
          {/* Moon */}
          <div 
            className="absolute w-16 h-16 rounded-full"
            style={{
              top: '8%',
              right: '15%',
              background: 'radial-gradient(circle, #fffde7 0%, #fff9c4 50%, #fff59d 100%)',
              boxShadow: '0 0 40px rgba(255, 249, 196, 0.6), 0 0 80px rgba(255, 249, 196, 0.3)',
            }}
          />
        </div>
      )}

      {/* Sun for daytime */}
      {timeOfDay === 'day' && (
        <div 
          className="absolute w-20 h-20 rounded-full"
          style={{
            top: '8%',
            right: '15%',
            background: 'radial-gradient(circle, #fff9c4 0%, #ffee58 50%, #fdd835 100%)',
            boxShadow: '0 0 60px rgba(253, 216, 53, 0.5), 0 0 120px rgba(253, 216, 53, 0.3)',
          }}
        />
      )}

      {/* Grass field */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{
          background: timeOfDay === 'day'
            ? 'linear-gradient(180deg, #98D8AA 0%, #7BC88F 30%, #5BB374 70%, #4A9E64 100%)'
            : 'linear-gradient(180deg, #2d5a3e 0%, #234a32 30%, #1a3a26 70%, #122a1c 100%)',
        }}
      >
        {/* Grass texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.1) 2px,
              rgba(255,255,255,0.1) 4px
            )`,
          }}
        />
      </div>

      {/* Flowers */}
      {garden?.flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute transition-all duration-1000"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            transform: `translate(-50%, -100%) rotate(${flower.rotation}deg) scale(${flower.scale})`,
            animation: `gardenSway 4s ease-in-out infinite`,
            animationDelay: `${flowerAnimationDelays[flower.id] || 0}s`,
          }}
        >
          <img
            src={flower.type === 'tulip' ? gardenTulip : gardenDaisy}
            alt={flower.type}
            className="w-16 h-auto drop-shadow-md"
            style={{
              filter: timeOfDay === 'night' ? 'brightness(0.7)' : 'none',
            }}
          />
        </div>
      ))}

      {/* Stats panel */}
      <div 
        className="absolute top-4 right-4 px-4 py-3 rounded-xl backdrop-blur-sm"
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
        className="absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        style={{
          background: timeOfDay === 'day' 
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <X className={timeOfDay === 'day' ? 'text-green-800' : 'text-green-200'} size={24} />
      </button>

      {/* Quote at bottom */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p 
          className="font-serif text-sm italic text-white"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          "Some things grow even when we're apart, just like our love for each other 🌷🌼"
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <p className="font-serif text-white text-lg">Growing your garden...</p>
        </div>
      )}

      {/* Garden sway animation */}
      <style>{`
        @keyframes gardenSway {
          0%, 100% { transform: translate(-50%, -100%) rotate(var(--base-rotation, 0deg)) scale(var(--base-scale, 1)); }
          25% { transform: translate(-50%, -100%) rotate(calc(var(--base-rotation, 0deg) - 2deg)) scale(var(--base-scale, 1)); }
          75% { transform: translate(-50%, -100%) rotate(calc(var(--base-rotation, 0deg) + 2deg)) scale(var(--base-scale, 1)); }
        }
      `}</style>
    </div>
  );
};

export default SecretGarden;
