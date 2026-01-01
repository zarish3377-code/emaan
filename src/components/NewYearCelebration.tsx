import { useEffect, useState } from "react";
import floatingTulip from "@/assets/floating_tulip.png";

interface CelebrationItem {
  id: number;
  type: 'balloon' | 'tulip';
  x: number;
  delay: number;
  color?: string;
  size: number;
}

const NewYearCelebration = () => {
  const [isNewYear, setIsNewYear] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [items, setItems] = useState<CelebrationItem[]>([]);

  useEffect(() => {
    const now = new Date();
    const isJan1_2026 = now.getFullYear() === 2026 && now.getMonth() === 0 && now.getDate() === 1;
    
    if (isJan1_2026) {
      setIsNewYear(true);
      setShowCelebration(true);
      
      // Generate celebration items
      const celebrationItems: CelebrationItem[] = [];
      const balloonColors = ['#FF6B8A', '#FFB6C1', '#FF69B4', '#FFC0CB', '#FF1493', '#FFD700', '#87CEEB', '#98FB98'];
      
      // Create balloons
      for (let i = 0; i < 20; i++) {
        celebrationItems.push({
          id: i,
          type: 'balloon',
          x: Math.random() * 100,
          delay: Math.random() * 2,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          size: 40 + Math.random() * 30,
        });
      }
      
      // Create tulips
      for (let i = 20; i < 35; i++) {
        celebrationItems.push({
          id: i,
          type: 'tulip',
          x: Math.random() * 100,
          delay: Math.random() * 2,
          size: 50 + Math.random() * 40,
        });
      }
      
      setItems(celebrationItems);
      
      // Hide celebration after 8 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 8000);
    }
  }, []);

  if (!isNewYear || !showCelebration) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Celebration items */}
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-pop-up"
          style={{
            left: `${item.x}%`,
            bottom: '-100px',
            animationDelay: `${item.delay}s`,
            animationDuration: '3s',
          }}
        >
          {item.type === 'balloon' ? (
            <div className="relative">
              {/* Balloon */}
              <div
                className="rounded-full animate-balloon-wobble"
                style={{
                  width: item.size,
                  height: item.size * 1.2,
                  backgroundColor: item.color,
                  boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.1), inset 10px 10px 20px rgba(255,255,255,0.3)`,
                }}
              />
              {/* Balloon knot */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: -8,
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `10px solid ${item.color}`,
                }}
              />
              {/* Balloon string */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-gray-400"
                style={{
                  top: item.size * 1.2 + 2,
                  height: 40,
                }}
              />
            </div>
          ) : (
            <img
              src={floatingTulip}
              alt=""
              className="animate-tulip-spin"
              style={{
                width: item.size,
                height: 'auto',
              }}
            />
          )}
        </div>
      ))}

      {/* Happy New Year text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 
          className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600 animate-new-year-text drop-shadow-2xl"
          style={{
            textShadow: '0 0 40px rgba(255,182,193,0.8), 0 0 80px rgba(255,105,180,0.6)',
          }}
        >
          Happy New Year 2026! 🎉
        </h1>
      </div>

      {/* Confetti sparkles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#FFB6C1', '#FF6B8A'][Math.floor(Math.random() * 6)],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      <style>{`
        @keyframes pop-up {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            transform: translateY(-200px) scale(1.2);
            opacity: 1;
          }
          40% {
            transform: translateY(-400px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes balloon-wobble {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes tulip-spin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(15deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-15deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes new-year-text {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-pop-up {
          animation: pop-up ease-out forwards;
        }

        .animate-balloon-wobble {
          animation: balloon-wobble 0.5s ease-in-out infinite;
        }

        .animate-tulip-spin {
          animation: tulip-spin 1s ease-in-out infinite;
        }

        .animate-new-year-text {
          animation: new-year-text 1s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};

export default NewYearCelebration;
