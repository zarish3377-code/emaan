import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../BackButton";

interface RoomSpaceProps {
  onBack: () => void;
}

const messages = [
  "cuddles > everything 🤗",
  "you're my favorite person 💜",
  "our cozy corner 🌙",
  "dreaming of you always ✨",
  "wrapped in your love 💕",
];

const fairyLights = [...Array(20)].map((_, i) => ({
  id: i,
  x: 5 + (i % 10) * 10,
  y: 8 + Math.floor(i / 10) * 5,
  delay: Math.random() * 2,
  color: ["#FFD700", "#FF69B4", "#87CEEB", "#DDA0DD", "#98FB98"][i % 5],
}));

const stars = [...Array(30)].map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 60,
  size: 8 + Math.random() * 12,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 2,
}));

const floatingItems = [
  { emoji: "🌙", x: 15, y: 20 },
  { emoji: "⭐", x: 75, y: 15 },
  { emoji: "💫", x: 85, y: 35 },
  { emoji: "🌟", x: 25, y: 45 },
  { emoji: "✨", x: 65, y: 25 },
];

const RoomSpace = ({ onBack }: RoomSpaceProps) => {
  const [revealedMessage, setRevealedMessage] = useState<number | null>(null);

  const pillows = [
    { id: 0, emoji: "🛋️", x: 20, y: 60 },
    { id: 1, emoji: "🧸", x: 40, y: 65 },
    { id: 2, emoji: "💜", x: 60, y: 58 },
    { id: 3, emoji: "🎀", x: 75, y: 63 },
    { id: 4, emoji: "🌸", x: 50, y: 70 },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Night sky gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(180deg, #1a1a2e 0%, #4a2c5e 50%, #7b4397 100%)",
            "linear-gradient(180deg, #16213e 0%, #533a71 50%, #8e6aae 100%)",
            "linear-gradient(180deg, #1a1a2e 0%, #4a2c5e 50%, #7b4397 100%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Floating stars background */}
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute pointer-events-none text-yellow-200/60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: star.size,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
          }}
        >
          ⭐
        </motion.span>
      ))}

      {/* Fairy lights */}
      <div className="absolute top-0 left-0 right-0 h-20">
        {fairyLights.map((light) => (
          <motion.div
            key={light.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${light.x}%`,
              top: `${light.y}%`,
              backgroundColor: light.color,
              boxShadow: `0 0 10px ${light.color}, 0 0 20px ${light.color}`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              delay: light.delay,
              repeat: Infinity,
            }}
          />
        ))}
        {/* String connecting lights */}
        <svg className="absolute top-4 left-0 w-full h-8" preserveAspectRatio="none">
          <motion.path
            d="M0,15 Q25,25 50,15 T100,15"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
            style={{ strokeDasharray: "none" }}
          />
        </svg>
      </div>

      {/* Floating dreamy items */}
      {floatingItems.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, -5, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}

      {/* Navigation */}
      <BackButton onClick={onBack} label="Back to Home" variant="home" />

      {/* Title */}
      <motion.div
        className="absolute top-20 left-0 right-0 text-center z-10"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold text-purple-200 drop-shadow-lg">
          🛏️ The Room 🛏️
        </h2>
        <p className="mt-2 text-lg font-body text-purple-300/80">
          tap the cozy things for dreamy messages 💫
        </p>
      </motion.div>

      {/* Floor/Carpet */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-purple-900/50 via-purple-800/30 to-transparent" />

      {/* Interactive pillows and items */}
      {pillows.map((pillow, index) => (
        <motion.button
          key={pillow.id}
          className="absolute z-10"
          style={{
            left: `${pillow.x}%`,
            bottom: `${100 - pillow.y}%`,
            fontSize: 48,
          }}
          onClick={() => setRevealedMessage(index)}
          animate={{
            y: [0, -5, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ 
            scale: 1.3,
            filter: "drop-shadow(0 0 20px rgba(255,182,193,0.8))",
          }}
          whileTap={{ scale: 0.9 }}
        >
          {pillow.emoji}
        </motion.button>
      ))}

      {/* Cozy glow effect */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,182,193,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Message popup */}
      {revealedMessage !== null && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setRevealedMessage(null)}
        >
          <motion.div
            className="relative px-8 py-6 bg-purple-900/90 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-purple-400/50"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {/* Sparkle decorations */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.span>
            ))}

            <p className="text-xl md:text-2xl font-body text-purple-200 text-center">
              {messages[revealedMessage]}
            </p>
            <p className="mt-2 text-sm text-purple-400 text-center">tap to close</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RoomSpace;
