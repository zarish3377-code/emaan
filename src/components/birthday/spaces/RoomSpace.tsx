import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

interface RoomSpaceProps {
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const roomMessages = [
  "rest well, birthday star ⭐",
  "cozy vibes for you always 🛏️",
  "you deserve all the soft blankets 🧸",
  "sending warm hugs your way 🤗",
  "this pillow has birthday wishes in it 💫",
  "fairy lights say happy birthday! ✨",
  "sweet dreams and sweeter days ahead 🌙",
  "you're the coziest person I know 💕",
];

const RoomSpace = ({ onBack, soundEnabled, onToggleSound }: RoomSpaceProps) => {
  const [revealedMessage, setRevealedMessage] = useState<{ id: number; message: string; x: number; y: number } | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleObjectClick = (x: number, y: number) => {
    const message = roomMessages[messageIndex % roomMessages.length];
    const id = Date.now();
    
    setRevealedMessage({ id, message, x, y });
    setMessageIndex(prev => prev + 1);
    
    setTimeout(() => {
      setRevealedMessage(null);
    }, 2500);

    if (soundEnabled) {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleijhqpuHfQ==";
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  };

  const roomObjects = [
    { emoji: "🛏️", x: 50, y: 55, size: 80, label: "bed" },
    { emoji: "🧸", x: 25, y: 50, size: 45, label: "teddy" },
    { emoji: "🌙", x: 80, y: 25, size: 50, label: "moon" },
    { emoji: "📚", x: 20, y: 70, size: 40, label: "books" },
    { emoji: "🕯️", x: 75, y: 65, size: 38, label: "candle" },
    { emoji: "🎀", x: 60, y: 35, size: 35, label: "ribbon" },
  ];

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #2c1654 0%, #4a2c82 50%, #6b4c9a 100%)",
      }}
    >
      {/* Fairy lights string */}
      <div className="absolute top-16 left-0 right-0 flex justify-center gap-8 md:gap-12">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 md:w-4 md:h-4 rounded-full"
            style={{
              background: ["#ffeb3b", "#ff6b9d", "#87ceeb", "#98fb98", "#ffa07a"][i % 5],
              boxShadow: `0 0 15px ${["#ffeb3b", "#ff6b9d", "#87ceeb", "#98fb98", "#ffa07a"][i % 5]}`,
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Stars in background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: i * 0.1,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg flex items-center gap-2"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowLeft className="w-6 h-6 text-white" />
        <span className="font-body text-sm text-white pr-2">Back to house</span>
      </motion.button>

      {/* Sound toggle */}
      <motion.button
        onClick={onToggleSound}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {soundEnabled ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white/50" />
        )}
      </motion.button>

      {/* Title */}
      <motion.h2
        className="absolute top-24 left-1/2 -translate-x-1/2 z-40 text-2xl md:text-3xl font-display text-white drop-shadow-lg text-center px-4"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          textShadow: "0 0 20px rgba(255,255,255,0.5)",
        }}
      >
        ✨ cozy corner ✨
      </motion.h2>

      {/* Window with moon glow */}
      <motion.div
        className="absolute top-28 right-8 md:right-20 w-24 h-32 md:w-32 md:h-40 rounded-lg border-4 border-white/30"
        style={{
          background: "linear-gradient(180deg, #1a0a2e 0%, #2c1654 100%)",
          boxShadow: "inset 0 0 30px rgba(255,255,255,0.1)",
        }}
      >
        <motion.div
          className="absolute top-4 right-4 text-4xl"
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌙
        </motion.div>
      </motion.div>

      {/* Clickable objects */}
      {roomObjects.map((obj, i) => (
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
            scale: 1.2,
            filter: "drop-shadow(0 0 25px rgba(255, 235, 59, 0.8))",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            y: { duration: 3 + i * 0.3, repeat: Infinity },
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
            className="absolute z-30 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl max-w-[220px] text-center"
            style={{
              left: `${Math.min(Math.max(revealedMessage.x, 20), 80)}%`,
              top: `${revealedMessage.y - 18}%`,
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, y: -30 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <p className="font-body text-sm text-gray-800">{revealedMessage.message}</p>
            <motion.span 
              className="absolute -top-3 -left-2 text-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              💜
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating z's for sleep vibes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl md:text-2xl text-white/40 font-display pointer-events-none"
          style={{
            left: `${55 + i * 5}%`,
            bottom: "40%",
          }}
          animate={{
            y: [0, -60 - i * 20],
            x: [0, 20 + i * 10],
            opacity: [0.6, 0],
            scale: [0.8, 1.2],
          }}
          transition={{
            duration: 3,
            delay: i * 0.6,
            repeat: Infinity,
          }}
        >
          z
        </motion.div>
      ))}

      {/* Floor / carpet */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(0deg, #8b6c9a 0%, #6b4c9a 100%)",
        }}
      />
    </div>
  );
};

export default RoomSpace;
