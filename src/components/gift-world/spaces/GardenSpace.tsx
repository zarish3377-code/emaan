import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../BackButton";

interface GardenSpaceProps {
  onBack: () => void;
}

const messages = [
  "you make my heart bloom 🌸",
  "growing love every day 💕",
  "our garden of dreams ✨",
  "you're my sunshine 🌻",
  "forever in bloom with you 🌷",
];

const flowers = [...Array(20)].map((_, i) => ({
  id: i,
  emoji: ["🌷", "🌸", "🌼", "🌻", "🌺", "💐"][i % 6],
  x: 5 + Math.random() * 90,
  y: 50 + Math.random() * 40,
  size: 24 + Math.random() * 24,
  delay: Math.random() * 2,
}));

const butterflies = [...Array(8)].map((_, i) => ({
  id: i,
  startX: Math.random() * 100,
  startY: 20 + Math.random() * 60,
  duration: 8 + Math.random() * 8,
  delay: Math.random() * 5,
}));

const sparkles = [...Array(25)].map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: 1.5 + Math.random() * 1.5,
  delay: Math.random() * 3,
  size: 10 + Math.random() * 15,
}));

const GardenSpace = ({ onBack }: GardenSpaceProps) => {
  const [revealedMessage, setRevealedMessage] = useState<number | null>(null);
  const [showRainbow, setShowRainbow] = useState(false);

  const handleFlowerClick = (index: number) => {
    setRevealedMessage(index);
    setShowRainbow(true);
    setTimeout(() => setShowRainbow(false), 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Sky gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(180deg, #87CEEB 0%, #E0F7FA 50%, #C8E6C9 100%)",
            "linear-gradient(180deg, #81D4FA 0%, #B2EBF2 50%, #A5D6A7 100%)",
            "linear-gradient(180deg, #87CEEB 0%, #E0F7FA 50%, #C8E6C9 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Rainbow effect on reveal */}
      {showRainbow && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2 }}
          style={{
            background: "linear-gradient(135deg, rgba(255,0,0,0.2), rgba(255,165,0,0.2), rgba(255,255,0,0.2), rgba(0,128,0,0.2), rgba(0,0,255,0.2), rgba(75,0,130,0.2), rgba(238,130,238,0.2))",
          }}
        />
      )}

      {/* Sparkles everywhere */}
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: sparkle.size,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.span>
      ))}

      {/* Sun */}
      <motion.div
        className="absolute top-8 right-8 text-7xl"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity },
        }}
      >
        ☀️
      </motion.div>

      {/* Butterflies */}
      {butterflies.map((butterfly) => (
        <motion.span
          key={butterfly.id}
          className="absolute text-3xl pointer-events-none z-10"
          style={{ top: `${butterfly.startY}%` }}
          initial={{ x: `${butterfly.startX}vw` }}
          animate={{
            x: [`${butterfly.startX}vw`, `${(butterfly.startX + 50) % 100}vw`, `${butterfly.startX}vw`],
            y: [0, -40, 20, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: butterfly.duration,
            delay: butterfly.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🦋
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
        <h2 className="text-4xl md:text-5xl font-display font-bold text-green-700 drop-shadow-lg">
          🌸 The Garden 🌸
        </h2>
        <p className="mt-2 text-lg font-body text-green-600/80">
          tap the flowers for magical messages ✨
        </p>
      </motion.div>

      {/* Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-400 via-green-300 to-transparent" />

      {/* Flowers */}
      {flowers.slice(0, 5).map((flower, index) => (
        <motion.button
          key={flower.id}
          className="absolute z-10"
          style={{
            left: `${10 + index * 18}%`,
            bottom: `${15 + (index % 2) * 10}%`,
            fontSize: flower.size + 10,
          }}
          onClick={() => handleFlowerClick(index)}
          animate={{
            y: [0, -8, 0],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 2 + index * 0.3,
            delay: flower.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          {flower.emoji}
        </motion.button>
      ))}

      {/* Background flowers */}
      {flowers.slice(5).map((flower) => (
        <motion.span
          key={flower.id}
          className="absolute pointer-events-none opacity-70"
          style={{
            left: `${flower.x}%`,
            bottom: `${flower.y - 40}%`,
            fontSize: flower.size,
          }}
          animate={{
            y: [0, -5, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3,
            delay: flower.delay,
            repeat: Infinity,
          }}
        >
          {flower.emoji}
        </motion.span>
      ))}

      {/* Message popup */}
      {revealedMessage !== null && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setRevealedMessage(null)}
        >
          <motion.div
            className="relative px-8 py-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-pink-300 pointer-events-auto"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={() => setRevealedMessage(null)}
          >
            {/* Rainbow border */}
            <motion.div
              className="absolute inset-0 rounded-3xl -z-10"
              style={{
                background: "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b)",
                padding: 4,
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Confetti burst */}
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl"
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 150,
                  y: (Math.random() - 0.5) * 150,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              >
                {["✨", "💖", "🌸", "⭐"][i % 4]}
              </motion.span>
            ))}

            <p className="text-xl md:text-2xl font-body text-pink-600 text-center">
              {messages[revealedMessage]}
            </p>
            <p className="mt-2 text-sm text-gray-400 text-center">tap to close</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GardenSpace;
