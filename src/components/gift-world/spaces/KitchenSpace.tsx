import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../BackButton";

interface KitchenSpaceProps {
  onBack: () => void;
}

const messages = [
  "cooking up love for you 💕",
  "you're the sweetest treat 🍰",
  "homemade happiness 🏠",
  "our recipe: you + me ❤️",
  "sweet like honey 🍯",
];

const steamParticles = [...Array(15)].map((_, i) => ({
  id: i,
  x: 40 + Math.random() * 20,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 1.5,
}));

const bouncingFood = [
  { emoji: "🍩", x: 15, y: 50, delay: 0 },
  { emoji: "🧁", x: 85, y: 45, delay: 0.5 },
  { emoji: "🍪", x: 25, y: 35, delay: 1 },
  { emoji: "🍰", x: 75, y: 55, delay: 1.5 },
  { emoji: "🍫", x: 10, y: 40, delay: 2 },
  { emoji: "🍭", x: 90, y: 38, delay: 2.5 },
];

const heartSteam = [...Array(8)].map((_, i) => ({
  id: i,
  x: 45 + Math.random() * 10,
  delay: Math.random() * 3,
}));

const interactiveItems = [
  { id: 0, emoji: "🍳", x: 30, y: 55 },
  { id: 1, emoji: "🎂", x: 50, y: 60 },
  { id: 2, emoji: "☕", x: 70, y: 52 },
  { id: 3, emoji: "🥧", x: 40, y: 70 },
  { id: 4, emoji: "🍦", x: 60, y: 68 },
];

const KitchenSpace = ({ onBack }: KitchenSpaceProps) => {
  const [revealedMessage, setRevealedMessage] = useState<number | null>(null);

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Warm kitchen gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(180deg, #FFF8E7 0%, #FFE4B5 50%, #FFDAB9 100%)",
            "linear-gradient(180deg, #FFFACD 0%, #FFE4C4 50%, #FFDEAD 100%)",
            "linear-gradient(180deg, #FFF8E7 0%, #FFE4B5 50%, #FFDAB9 100%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Steam particles */}
      {steamParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-2xl pointer-events-none text-white/60"
          style={{ left: `${particle.x}%`, bottom: "40%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -150,
            opacity: [0, 0.8, 0],
            x: [0, 10, -10, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
          }}
        >
          ☁️
        </motion.span>
      ))}

      {/* Heart-shaped steam */}
      {heartSteam.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute text-xl pointer-events-none"
          style={{ left: `${heart.x}%`, bottom: "45%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -120,
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            delay: heart.delay,
            repeat: Infinity,
          }}
        >
          💗
        </motion.span>
      ))}

      {/* Bouncing food items */}
      {bouncingFood.map((food, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${food.x}%`, top: `${food.y}%` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            delay: food.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {food.emoji}
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
        <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-700 drop-shadow-lg">
          🍰 The Kitchen 🍰
        </h2>
        <p className="mt-2 text-lg font-body text-orange-600/80">
          tap the treats for sweet messages 🍪
        </p>
      </motion.div>

      {/* Counter/Table */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-200 via-amber-100 to-transparent" />
      <div className="absolute bottom-1/4 left-5 right-5 h-4 bg-amber-400/50 rounded-full" />

      {/* Interactive kitchen items */}
      {interactiveItems.map((item, index) => (
        <motion.button
          key={item.id}
          className="absolute z-10"
          style={{
            left: `${item.x}%`,
            bottom: `${100 - item.y}%`,
            fontSize: 56,
          }}
          onClick={() => setRevealedMessage(index)}
          animate={{
            y: [0, -8, 0],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 2 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ 
            scale: 1.4,
            rotate: 15,
            filter: "drop-shadow(0 0 15px rgba(255,165,0,0.8))",
          }}
          whileTap={{ scale: 0.85 }}
        >
          {item.emoji}
        </motion.button>
      ))}

      {/* Stove/Oven glow */}
      <motion.div
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,140,0,0.4) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity }}
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
            className="relative px-8 py-6 bg-orange-50/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-orange-300"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {/* Confetti burst */}
            {[...Array(10)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 120,
                  y: (Math.random() - 0.5) * 120,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              >
                {["🍩", "🧁", "🍪", "🍫", "🍭"][i % 5]}
              </motion.span>
            ))}

            <p className="text-xl md:text-2xl font-body text-orange-700 text-center">
              {messages[revealedMessage]}
            </p>
            <p className="mt-2 text-sm text-orange-400 text-center">tap to close</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KitchenSpace;
