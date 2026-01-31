import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../BackButton";

interface PlayCornerSpaceProps {
  onBack: () => void;
}

interface FloatingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  caught: boolean;
}

const emojis = ["💖", "⭐", "🌈", "🎀", "🦋", "🌸", "💎", "🎈", "🍭", "🌟"];

const backgroundParticles = [...Array(20)].map((_, i) => ({
  id: i,
  emoji: ["✨", "💫", "⭐", "💕"][i % 4],
  x: Math.random() * 100,
  duration: 3 + Math.random() * 3,
  delay: Math.random() * 4,
}));

const PlayCornerSpace = ({ onBack }: PlayCornerSpaceProps) => {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [score, setScore] = useState(0);
  const [showExplosion, setShowExplosion] = useState<{ x: number; y: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Generate floating items
  useEffect(() => {
    const generateItem = () => {
      const newItem: FloatingItem = {
        id: Date.now() + Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: 10 + Math.random() * 80,
        y: 100 + Math.random() * 20,
        caught: false,
      };
      setItems((prev) => [...prev.slice(-15), newItem]);
    };

    generateItem();
    const interval = setInterval(generateItem, 1500);
    return () => clearInterval(interval);
  }, []);

  // Clean up items that have floated away
  useEffect(() => {
    const cleanup = setInterval(() => {
      setItems((prev) => prev.filter((item) => !item.caught));
    }, 5000);
    return () => clearInterval(cleanup);
  }, []);

  const catchItem = useCallback((id: number, x: number, y: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, caught: true } : item
      )
    );
    setScore((prev) => prev + 1);
    setShowExplosion({ x, y });
    
    // Show confetti every 5 catches
    if ((score + 1) % 5 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }
    
    setTimeout(() => setShowExplosion(null), 500);
  }, [score]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fun gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FFECD2 100%)",
            "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 50%, #F6D365 100%)",
            "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FFECD2 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Background particles */}
      {backgroundParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute pointer-events-none text-2xl"
          style={{ left: `${particle.x}%` }}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
          }}
        >
          {particle.emoji}
        </motion.span>
      ))}

      {/* Confetti explosion */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl pointer-events-none"
                style={{ left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: [0, 1.5, 0],
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
              >
                {["🎉", "🎊", "✨", "💖", "⭐", "🌈"][i % 6]}
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Catch explosion effect */}
      <AnimatePresence>
        {showExplosion && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl pointer-events-none z-50"
                style={{ left: showExplosion.x, top: showExplosion.y }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  scale: [0, 1.2, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <BackButton onClick={onBack} label="Back to Home" variant="home" />

      {/* Title and Score */}
      <motion.div
        className="absolute top-20 left-0 right-0 text-center z-10"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold text-fuchsia-700 drop-shadow-lg">
          🎉 Play Corner 🎉
        </h2>
        <p className="mt-2 text-lg font-body text-fuchsia-600/80">
          catch the floating items! 🎯
        </p>
        <motion.div
          className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-white/80 rounded-full shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          key={score}
        >
          <span className="text-2xl">✨</span>
          <span className="font-display text-2xl font-bold text-fuchsia-600">
            {score}
          </span>
          <span className="text-lg text-fuchsia-500">caught!</span>
        </motion.div>
      </motion.div>

      {/* Floating catchable items */}
      <AnimatePresence>
        {items
          .filter((item) => !item.caught)
          .map((item) => (
            <motion.button
              key={item.id}
              className="absolute text-5xl z-20 hover:scale-125 transition-transform"
              style={{ left: `${item.x}%` }}
              initial={{ y: "100vh", rotate: 0 }}
              animate={{
                y: "-20vh",
                rotate: [0, 15, -15, 0],
                x: [0, 20, -20, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                y: { duration: 6, ease: "linear" },
                rotate: { duration: 2, repeat: Infinity },
                x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                catchItem(item.id, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
            >
              <motion.span
                animate={{
                  filter: [
                    "drop-shadow(0 0 10px rgba(255,105,180,0.8))",
                    "drop-shadow(0 0 20px rgba(255,105,180,1))",
                    "drop-shadow(0 0 10px rgba(255,105,180,0.8))",
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {item.emoji}
              </motion.span>
            </motion.button>
          ))}
      </AnimatePresence>

      {/* Encouraging messages at milestones */}
      <AnimatePresence>
        {score > 0 && score % 10 === 0 && showConfetti && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="px-8 py-4 bg-white/90 rounded-3xl shadow-2xl">
              <p className="text-2xl font-display font-bold text-fuchsia-600">
                🎉 Amazing! {score} caught! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ground decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-around px-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {["🎈", "🎀", "🎁", "🧸", "🎪", "🎠", "🎡", "🎢"].map((emoji, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2 + i * 0.2,
              delay: i * 0.1,
              repeat: Infinity,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PlayCornerSpace;
