import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

interface KitchenSpaceProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const kitchenMessages = [
  "drink water. this is an order. 💧",
  "have you eaten today? 🍎",
  "sending you birthday cake vibes 🎂",
  "this tea has love in it ☕",
  "you're the sweetest, literally 🍰",
  "birthday calories don't count btw 🧁",
  "chef's kiss for you 👨‍🍳💋",
  "made with love (and chaos) 💕",
  "snack time = self care 🍪",
];

const KitchenSpace = ({ onBack, soundEnabled, onToggleSound }: KitchenSpaceProps) => {
  const [revealedMessage, setRevealedMessage] = useState<{ id: number; message: string; x: number; y: number } | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleObjectClick = (x: number, y: number) => {
    const message = kitchenMessages[messageIndex % kitchenMessages.length];
    const id = Date.now();
    
    setRevealedMessage({ id, message, x, y });
    setMessageIndex(prev => prev + 1);
    
    setTimeout(() => {
      setRevealedMessage(null);
    }, 2500);

    if (soundEnabled) {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleijhqpuHfQ==";
      audio.volume = 0.25;
      audio.play().catch(() => {});
    }
  };

  const kitchenObjects = [
    { emoji: "🎂", x: 50, y: 55, size: 70 },
    { emoji: "☕", x: 25, y: 50, size: 50 },
    { emoji: "🧁", x: 75, y: 48, size: 45 },
    { emoji: "🍰", x: 35, y: 65, size: 48 },
    { emoji: "🍪", x: 65, y: 62, size: 42 },
    { emoji: "🫖", x: 20, y: 68, size: 55 },
    { emoji: "🥤", x: 80, y: 58, size: 40 },
  ];

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #fff5f5 0%, #ffe4ec 50%, #ffb6c1 100%)",
      }}
    >
      {/* Steam hearts floating up */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: `${15 + i * 7}%`,
            bottom: "30%",
          }}
          animate={{
            y: [0, -200],
            x: [0, Math.sin(i) * 30],
            opacity: [0.8, 0],
            scale: [0.5, 1.2],
          }}
          transition={{
            duration: 4 + i * 0.3,
            delay: i * 0.5,
            repeat: Infinity,
          }}
        >
          💗
        </motion.div>
      ))}

      {/* Sparkle decorations */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.4,
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
        className="absolute top-20 left-1/2 -translate-x-1/2 z-40 text-2xl md:text-3xl font-display drop-shadow-lg text-center px-4"
        style={{ color: "#d63384" }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🍰 birthday treats 🍰
      </motion.h2>

      {/* Table */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[85%] max-w-2xl h-40 rounded-t-3xl"
        style={{
          background: "linear-gradient(180deg, #deb887 0%, #d2691e 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Table cloth pattern */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[85%] max-w-2xl h-8 rounded-t-lg overflow-hidden"
        style={{
          background: "repeating-linear-gradient(90deg, #fff 0px, #fff 20px, #ffb6c1 20px, #ffb6c1 40px)",
        }}
      />

      {/* Clickable objects */}
      {kitchenObjects.map((obj, i) => (
        <motion.button
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            fontSize: obj.size,
          }}
          onClick={() => handleObjectClick(obj.x, obj.y)}
          whileHover={{ 
            scale: 1.25,
            y: -10,
            filter: "drop-shadow(0 10px 20px rgba(255, 105, 180, 0.5))",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -5, 0],
            rotate: i % 2 === 0 ? [0, 3, 0] : [0, -3, 0],
          }}
          transition={{
            y: { duration: 2 + i * 0.2, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity },
          }}
        >
          {obj.emoji}
        </motion.button>
      ))}

      {/* Revealed message */}
      <AnimatePresence>
        {revealedMessage && (
          <motion.div
            key={revealedMessage.id}
            className="absolute z-30 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl max-w-[220px] text-center border-2 border-pink-200"
            style={{
              left: `${Math.min(Math.max(revealedMessage.x, 20), 80)}%`,
              top: `${revealedMessage.y - 20}%`,
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, scale: 0, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -20 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <p className="font-body text-sm text-gray-800">{revealedMessage.message}</p>
            <motion.span 
              className="absolute -top-3 -right-2 text-xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🎀
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            background: ["#ff6b9d", "#ffdb58", "#87ceeb", "#98fb98", "#dda0dd"][i % 5],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, window.innerHeight + 50],
            x: [0, Math.sin(i) * 100],
            rotate: [0, 720],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Floor */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20"
        style={{
          background: "linear-gradient(0deg, #8b4513 0%, #a0522d 100%)",
        }}
      />
    </div>
  );
};

export default KitchenSpace;
