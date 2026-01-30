import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface BirthdayGiftButtonProps {
  onClick: () => void;
}

const BirthdayGiftButton = ({ onClick }: BirthdayGiftButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-body overflow-hidden"
      style={{
        background: isHovered 
          ? "linear-gradient(135deg, #ff6b9d 0%, #ffa8cc 50%, #ffdb58 100%)" 
          : "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)",
        boxShadow: isHovered 
          ? "0 0 30px rgba(255, 107, 157, 0.6), 0 0 60px rgba(255, 168, 204, 0.4), 0 4px 20px rgba(0,0,0,0.1)" 
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{ 
        scale: 1.05,
      }}
      animate={isHovered ? {
        y: [0, -3, 0, -2, 0],
        rotate: [0, -2, 2, -1, 0],
      } : {}}
      transition={{
        y: { duration: 0.5, repeat: isHovered ? Infinity : 0 },
        rotate: { duration: 0.3 },
      }}
      aria-label="Open Birthday Gift"
    >
      {/* Sparkle particles when hovered */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-300"
              initial={{ 
                opacity: 0, 
                x: 0, 
                y: 0,
                scale: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}
      
      {/* Glow pulse background */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2 text-dark-berry">
        <motion.span
          animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        >
          🎁
        </motion.span>
        <span className="font-medium">lil BHD gift for Love</span>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
};

export default BirthdayGiftButton;
