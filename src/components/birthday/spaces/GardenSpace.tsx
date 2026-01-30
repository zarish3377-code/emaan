import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

interface GardenSpaceProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const gardenMessages = [
  "hi birthday girl 😌",
  "you clicked this flower so now you get love 💕",
  "surprise! this one's for you ✨",
  "you're blooming beautifully 🌸",
  "sending you all the birthday magic 🦋",
  "you make everything brighter 🌻",
  "happy happy happy birthday! 🎂",
  "more love for you, always 💗",
  "this garden grows because of you 🌷",
  "you deserve all the flowers in the world 💐",
];

const GardenSpace = ({ onBack, soundEnabled, onToggleSound }: GardenSpaceProps) => {
  const [revealedMessages, setRevealedMessages] = useState<{ id: number; message: string; x: number; y: number }[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleFlowerClick = (x: number, y: number) => {
    const message = gardenMessages[messageIndex % gardenMessages.length];
    const id = Date.now();
    
    setRevealedMessages(prev => [...prev, { id, message, x, y }]);
    setMessageIndex(prev => prev + 1);
    
    // Remove message after animation
    setTimeout(() => {
      setRevealedMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);

    // Play sound if enabled
    if (soundEnabled) {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleijhqpuHfQ==";
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const flowers = [
    { emoji: "🌸", x: 15, y: 30, size: 50 },
    { emoji: "🌷", x: 35, y: 45, size: 55 },
    { emoji: "🌻", x: 55, y: 25, size: 60 },
    { emoji: "🌺", x: 75, y: 40, size: 52 },
    { emoji: "💐", x: 25, y: 60, size: 58 },
    { emoji: "🌹", x: 65, y: 65, size: 54 },
    { emoji: "🪻", x: 45, y: 75, size: 48 },
    { emoji: "🌼", x: 85, y: 55, size: 50 },
    { emoji: "💮", x: 10, y: 70, size: 45 },
  ];

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #87ceeb 0%, #98fb98 60%, #32cd32 100%)",
      }}
    >
      {/* Floating butterflies */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl md:text-3xl pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🦋
        </motion.div>
      ))}

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      ))}

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
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.5)",
        }}
      >
        🌸 click the flowers 🌸
      </motion.h2>

      {/* Clickable flowers */}
      {flowers.map((flower, i) => (
        <motion.button
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            fontSize: flower.size,
          }}
          onClick={() => handleFlowerClick(flower.x, flower.y)}
          whileHover={{ 
            scale: 1.3,
            rotate: [0, -10, 10, 0],
            filter: "drop-shadow(0 0 20px rgba(255, 182, 193, 0.8))",
          }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: { duration: 2 + i * 0.2, repeat: Infinity },
          }}
        >
          {flower.emoji}
        </motion.button>
      ))}

      {/* Revealed messages */}
      <AnimatePresence>
        {revealedMessages.map((msg) => (
          <motion.div
            key={msg.id}
            className="absolute z-30 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl max-w-[200px] text-center"
            style={{
              left: `${Math.min(Math.max(msg.x, 15), 85)}%`,
              top: `${msg.y - 15}%`,
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <p className="font-body text-sm text-gray-800">{msg.message}</p>
            {/* Sparkle decorations */}
            <motion.span 
              className="absolute -top-2 -right-2 text-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating hearts */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: `${10 + i * 9}%`,
            bottom: -50,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(i) * 50],
            opacity: [0.7, 0.7, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + i,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          💕
        </motion.div>
      ))}

      {/* Ground with grass */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(0deg, #228b22 0%, #32cd32 50%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default GardenSpace;
