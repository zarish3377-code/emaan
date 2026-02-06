import { useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useSecretGarden } from '@/hooks/useSecretGarden';
import gardenTulip from '@/assets/garden_tulip.png';
import gardenDaisy from '@/assets/garden_daisy.png';
import moonImage from '@/assets/moon.png';
import sunImage from '@/assets/sun.png';

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
          <img 
            src={moonImage}
            alt="Moon"
            className="absolute w-44 h-auto animate-moon-glow"
            style={{
              top: '3%',
              left: '8%',
            }}
          />
        </div>
      )}

      {/* Sun for daytime */}
      {timeOfDay === 'day' && (
        <>
          <img 
            src={sunImage}
            alt="Sun"
            className="absolute w-80 h-auto"
            style={{
              top: '3%',
              right: '10%',
            }}
          />
          {/* Drifting clouds - randomly positioned */}
          {[
            { top: 5, startLeft: 10, size: 100, duration: 80, delay: 0 },
            { top: 15, startLeft: 45, size: 80, duration: 95, delay: -30 },
            { top: 8, startLeft: 70, size: 120, duration: 70, delay: -50 },
            { top: 22, startLeft: 25, size: 90, duration: 85, delay: -15 },
            { top: 12, startLeft: 85, size: 70, duration: 100, delay: -65 },
          ].map((cloud, i) => (
            <div
              key={`cloud-${i}`}
              className="absolute"
              style={{
                top: `${cloud.top}%`,
                left: `${cloud.startLeft}%`,
                animation: `cloudDrift ${cloud.duration}s linear infinite`,
                animationDelay: `${cloud.delay}s`,
              }}
            >
              <div 
                className="relative"
                style={{
                  width: `${cloud.size}px`,
                  height: `${cloud.size * 0.35}px`,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50px',
                  filter: 'blur(2px)',
                }}
              >
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: `${cloud.size * 0.4}px`,
                    height: `${cloud.size * 0.4}px`,
                    background: 'rgba(255, 255, 255, 0.9)',
                    top: `-${cloud.size * 0.15}px`,
                    left: '20%',
                  }}
                />
                <div 
                  className="absolute rounded-full"
                  style={{
                    width: `${cloud.size * 0.5}px`,
                    height: `${cloud.size * 0.5}px`,
                    background: 'rgba(255, 255, 255, 0.85)',
                    top: `-${cloud.size * 0.2}px`,
                    left: '45%',
                  }}
                />
              </div>
            </div>
          ))}
        </>
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
        {/* Grass blades with breeze */}
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={`grass-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${(i / 200) * 100 + (Math.random() * 0.5 - 0.25)}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${12 + Math.random() * 30}px`,
              background: timeOfDay === 'day' 
                ? `linear-gradient(to top, #4A9E64, ${Math.random() > 0.5 ? '#6BBF7A' : '#5BB374'})`
                : `linear-gradient(to top, #1a3a26, ${Math.random() > 0.5 ? '#2d5a3e' : '#234a32'})`,
              borderRadius: '50% 50% 0 0',
              transformOrigin: 'bottom center',
              animation: `breeze ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${(i / 200) * 2 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Flowers */}
      {garden?.flowers.map((flower, index) => (
        <div
          key={flower.id}
          className="absolute"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            transform: `translate(-50%, -100%) rotate(${flower.rotation}deg)`,
            animation: `gardenSway 4s ease-in-out infinite, flowerBloom 0.8s ease-out forwards`,
            animationDelay: `${flowerAnimationDelays[flower.id] || 0}s, ${index * 0.1}s`,
          }}
        >
          <img
            src={flower.type === 'tulip' ? gardenTulip : gardenDaisy}
            alt={flower.type}
            className="w-14 h-auto drop-shadow-md"
            style={{
              filter: timeOfDay === 'night' ? 'brightness(0.7)' : 'none',
              transform: `scale(${flower.scale})`,
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

      {/* Garden animations */}
      <style>{`
        @keyframes gardenSway {
          0%, 100% { transform: translate(-50%, -100%) rotate(0deg); }
          25% { transform: translate(-50%, -100%) rotate(-3deg); }
          75% { transform: translate(-50%, -100%) rotate(3deg); }
        }
        @keyframes flowerBloom {
          0% { opacity: 0; transform: translate(-50%, -100%) scale(0) rotate(-10deg); }
          40% { opacity: 1; transform: translate(-50%, -100%) scale(1.2) rotate(5deg); }
          60% { transform: translate(-50%, -100%) scale(0.9) rotate(-3deg); }
          80% { transform: translate(-50%, -100%) scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: translate(-50%, -100%) scale(1) rotate(0deg); }
        }
        @keyframes grassSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes breeze {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          20% { transform: rotate(4deg) translateX(2px); }
          40% { transform: rotate(-2deg) translateX(-1px); }
          60% { transform: rotate(3deg) translateX(1px); }
          80% { transform: rotate(-1deg) translateX(-1px); }
        }
        @keyframes cloudDrift {
          0% { left: -20%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes moonGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 40px rgba(200, 200, 255, 0.2));
          }
          50% { 
            filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 60px rgba(200, 200, 255, 0.35));
          }
        }
        .animate-moon-glow {
          animation: moonGlow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SecretGarden;
