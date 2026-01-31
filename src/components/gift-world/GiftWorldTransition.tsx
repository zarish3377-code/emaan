import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GiftWorldTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const GiftWorldTransition = ({ isActive, onComplete }: GiftWorldTransitionProps) => {
  const [phase, setPhase] = useState<"gift" | "explosion" | "title" | "done">("gift");

  useEffect(() => {
    if (isActive) {
      setPhase("gift");
      
      // Phase timing
      const explosionTimer = setTimeout(() => setPhase("explosion"), 800);
      const titleTimer = setTimeout(() => setPhase("title"), 1600);
      const doneTimer = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 3500);

      return () => {
        clearTimeout(explosionTimer);
        clearTimeout(titleTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [isActive, onComplete]);

  // Generate confetti particles
  const confetti = [...Array(40)].map((_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    rotation: Math.random() * 720 - 360,
    scale: 0.5 + Math.random() * 1,
    color: [
      "#FF69B4", "#FFB6C1", "#DDA0DD", "#E6E6FA", 
      "#FF1493", "#FF6347", "#FFD700", "#87CEEB",
      "#98FB98", "#FFA500", "#FF69B4", "#BA55D3"
    ][i % 12],
    delay: Math.random() * 0.3,
  }));

  // Generate floating hearts for title phase
  const hearts = [...Array(20)].map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    size: 16 + Math.random() * 24,
  }));

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-pink-400"
            animate={{
              background: phase === "title" 
                ? ["linear-gradient(135deg, #FFB6C1 0%, #DDA0DD 50%, #FFB6C1 100%)",
                   "linear-gradient(135deg, #DDA0DD 0%, #FFB6C1 50%, #E6E6FA 100%)",
                   "linear-gradient(135deg, #FFB6C1 0%, #E6E6FA 50%, #DDA0DD 100%)"]
                : "linear-gradient(135deg, #FFB6C1 0%, #DDA0DD 50%, #FFB6C1 100%)"
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* Gift Phase */}
          {phase === "gift" && (
            <motion.div
              className="relative text-9xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              🎁
              {/* Sparkle ring around gift */}
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                  style={{
                    top: `${50 + 60 * Math.sin((i * Math.PI * 2) / 8)}%`,
                    left: `${50 + 60 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  ✨
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Explosion Phase - Confetti */}
          {(phase === "explosion" || phase === "title") && (
            <>
              {confetti.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-4 h-4 rounded-full"
                  style={{ backgroundColor: particle.color }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{ 
                    x: particle.x * 5,
                    y: particle.y * 5,
                    scale: [0, particle.scale, 0],
                    rotate: particle.rotation,
                    opacity: [1, 1, 0],
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: particle.delay,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Explosion flash */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.3 }}
              />
            </>
          )}

          {/* Title Phase - OUR HOME */}
          {phase === "title" && (
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Sparkle ring around title */}
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl"
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                  style={{
                    top: `${50 + 150 * Math.sin((i * Math.PI * 2) / 12)}%`,
                    left: `${50 + 200 * Math.cos((i * Math.PI * 2) / 12)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {["✨", "💖", "🌸", "⭐", "💕", "🌷"][i % 6]}
                </motion.span>
              ))}

              {/* Main title */}
              <motion.h1
                className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 drop-shadow-lg"
                style={{
                  backgroundSize: "200% 200%",
                  animation: "rainbow-shift 2s ease infinite",
                  textShadow: "0 0 40px rgba(255, 182, 193, 0.8), 0 0 80px rgba(221, 160, 221, 0.6)",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨ OUR HOME ✨
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mt-6 text-xl md:text-2xl font-body text-white/90 drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                welcome to our little world 💕
              </motion.p>

              {/* Floating hearts */}
              {hearts.map((heart) => (
                <motion.span
                  key={heart.id}
                  className="absolute text-pink-400/60"
                  style={{ fontSize: heart.size, left: `${heart.startX}%` }}
                  initial={{ y: "100vh", opacity: 0 }}
                  animate={{ 
                    y: "-100vh",
                    opacity: [0, 1, 1, 0],
                    x: [0, 20, -20, 0],
                  }}
                  transition={{ 
                    duration: heart.duration,
                    delay: heart.delay,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  💗
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiftWorldTransition;
