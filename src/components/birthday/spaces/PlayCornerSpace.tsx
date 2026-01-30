import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

interface PlayCornerSpaceProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const playMessages = [
  "you caught love! 💕",
  "surprise! birthday magic! ✨",
  "more happiness for you! 🎉",
  "woohoo! you're amazing! 🌟",
  "sparkle sparkle! ⭐",
  "joy explosion! 💫",
  "you're a star catcher! 🌠",
  "birthday power activated! 🎊",
];

interface FloatingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  caught: boolean;
}

const PlayCornerSpace = ({ onBack, soundEnabled, onToggleSound }: PlayCornerSpaceProps) => {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [caughtMessage, setCaughtMessage] = useState<{ id: number; message: string; x: number; y: number } | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const emojis = ["💕", "⭐", "✨", "🎉", "💫", "🌟", "🎊", "💗", "🌈", "🦋"];

  const spawnItem = useCallback(() => {
    const newItem: FloatingItem = {
      id: Date.now() + Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      caught: false,
    };
    setFloatingItems(prev => [...prev.slice(-15), newItem]); // Keep max 16 items
  }, []);

  useEffect(() => {
    // Spawn initial items
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnItem(), i * 300);
    }

    // Keep spawning items
    const interval = setInterval(spawnItem, 1500);
    return () => clearInterval(interval);
  }, [spawnItem]);

  const handleCatch = (item: FloatingItem) => {
    if (item.caught) return;

    // Mark as caught
    setFloatingItems(prev => prev.map(i => i.id === item.id ? { ...i, caught: true } : i));

    // Show message
    const message = playMessages[Math.floor(Math.random() * playMessages.length)];
    setCaughtMessage({ id: Date.now(), message, x: item.x, y: item.y });

    // Create explosion particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: item.x,
      y: item.y,
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Play sound
    if (soundEnabled) {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleijhqpuHfQ==";
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    // Clean up
    setTimeout(() => {
      setFloatingItems(prev => prev.filter(i => i.id !== item.id));
      setCaughtMessage(null);
    }, 1500);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 800);
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ff6b9d 0%, #ffa07a 25%, #ffdb58 50%, #87ceeb 75%, #dda0dd 100%)",
      }}
    >
      {/* Animated background bubbles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            width: 20 + Math.random() * 40,
            height: 20 + Math.random() * 40,
            background: ["#fff", "#ffeb3b", "#ff6b9d", "#87ceeb"][i % 4],
            left: `${Math.random() * 100}%`,
            bottom: -50,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(i) * 50],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Rainbow burst from center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center gap-2"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
        <span className="font-body text-sm text-gray-700 pr-2">Back to house</span>
      </motion.button>

      {/* Sound toggle */}
      <motion.button
        onClick={onToggleSound}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {soundEnabled ? (
          <Volume2 className="w-6 h-6 text-gray-700" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-400" />
        )}
      </motion.button>

      {/* Title */}
      <motion.h2
        className="absolute top-20 left-1/2 -translate-x-1/2 z-40 text-2xl md:text-3xl font-display text-white drop-shadow-lg text-center px-4"
        initial={{ y: -30, opacity: 0, scale: 0.8 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          scale: [1, 1.05, 1],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
        }}
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.5)",
        }}
      >
        🎉 catch the joy! 🎉
      </motion.h2>

      {/* Instruction */}
      <motion.p
        className="absolute top-32 left-1/2 -translate-x-1/2 z-40 text-sm md:text-base font-body text-white/90 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        tap the floating things! ✨
      </motion.p>

      {/* Floating catchable items */}
      <AnimatePresence>
        {floatingItems.filter(item => !item.caught).map((item) => (
          <motion.button
            key={item.id}
            className="absolute text-4xl md:text-5xl z-20"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            onClick={() => handleCatch(item)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -15, 0, 15, 0],
              x: [0, 10, 0, -10, 0],
              rotate: [0, 10, 0, -10, 0],
            }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{
              y: { duration: 3, repeat: Infinity },
              x: { duration: 4, repeat: Infinity },
              rotate: { duration: 2, repeat: Infinity },
            }}
            whileHover={{ 
              scale: 1.3,
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.8))",
            }}
            whileTap={{ scale: 0.5 }}
          >
            {item.emoji}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Explosion particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full bg-yellow-300 pointer-events-none z-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              x: (Math.random() - 0.5) * 150,
              y: (Math.random() - 0.5) * 150,
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      {/* Caught message */}
      <AnimatePresence>
        {caughtMessage && (
          <motion.div
            key={caughtMessage.id}
            className="absolute z-40 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl text-center"
            style={{
              left: `${caughtMessage.x}%`,
              top: `${caughtMessage.y - 10}%`,
              transform: "translateX(-50%)",
            }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <p className="font-body text-sm text-gray-800 font-medium">{caughtMessage.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Constant confetti rain */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${i * 4}%`,
            top: -20,
            fontSize: 20 + Math.random() * 15,
          }}
          animate={{
            y: [0, window.innerHeight + 50],
            rotate: [0, 720],
            x: [0, Math.sin(i) * 30],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {["🎊", "🎉", "⭐", "💫", "✨"][i % 5]}
        </motion.div>
      ))}
    </div>
  );
};

export default PlayCornerSpace;
