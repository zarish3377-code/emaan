import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface GiftWorldTransitionProps {
  isOpen: boolean;
  children: ReactNode;
}

const GiftWorldTransition = ({ isOpen, children }: GiftWorldTransitionProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Color burst background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, #ffb6c1 0%, #ffd1dc 30%, #fff0f5 60%, #fffaf0 100%)",
            }}
            initial={{ scale: 0, borderRadius: "100%" }}
            animate={{ 
              scale: 3,
              borderRadius: "0%",
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          />
          
          {/* Confetti burst */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3"
              style={{
                left: "50%",
                top: "50%",
                background: [
                  "#ff6b9d", "#ffdb58", "#87ceeb", 
                  "#98fb98", "#dda0dd", "#ffa07a"
                ][i % 6],
                borderRadius: i % 2 === 0 ? "50%" : "2px",
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1,
                scale: 0,
                rotate: 0,
              }}
              animate={{ 
                x: (Math.random() - 0.5) * window.innerWidth,
                y: (Math.random() - 0.5) * window.innerHeight,
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0.5],
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 1.2,
                delay: 0.2 + i * 0.02,
                ease: "easeOut",
              }}
            />
          ))}
          
          {/* Main content with zoom-in */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiftWorldTransition;
