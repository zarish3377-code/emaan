import { motion } from "framer-motion";
import { useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import GardenSpace from "./spaces/GardenSpace";
import RoomSpace from "./spaces/RoomSpace";
import KitchenSpace from "./spaces/KitchenSpace";
import PlayCornerSpace from "./spaces/PlayCornerSpace";

interface GiftHouseProps {
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

type SpaceType = "house" | "garden" | "room" | "kitchen" | "play";

const GiftHouse = ({ onClose, soundEnabled, onToggleSound }: GiftHouseProps) => {
  const [currentSpace, setCurrentSpace] = useState<SpaceType>("house");

  const handleSpaceClick = (space: SpaceType) => {
    setCurrentSpace(space);
  };

  const handleBackToHouse = () => {
    setCurrentSpace("house");
  };

  if (currentSpace === "garden") {
    return <GardenSpace onBack={handleBackToHouse} soundEnabled={soundEnabled} onToggleSound={onToggleSound} />;
  }
  if (currentSpace === "room") {
    return <RoomSpace onBack={handleBackToHouse} soundEnabled={soundEnabled} onToggleSound={onToggleSound} />;
  }
  if (currentSpace === "kitchen") {
    return <KitchenSpace onBack={handleBackToHouse} soundEnabled={soundEnabled} onToggleSound={onToggleSound} />;
  }
  if (currentSpace === "play") {
    return <PlayCornerSpace onBack={handleBackToHouse} soundEnabled={soundEnabled} onToggleSound={onToggleSound} />;
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #87ceeb 0%, #b0e0e6 40%, #98fb98 100%)",
      }}
    >
      {/* Animated clouds */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-80"
          style={{
            width: 80 + Math.random() * 60,
            height: 40 + Math.random() * 30,
            top: `${5 + i * 8}%`,
            left: `-20%`,
            filter: "blur(2px)",
          }}
          animate={{
            x: [0, window.innerWidth + 200],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            delay: i * 4,
            ease: "linear",
          }}
        />
      ))}

      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-6 h-6 text-gray-700" />
      </motion.button>

      {/* Sound toggle */}
      <motion.button
        onClick={onToggleSound}
        className="absolute top-4 left-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
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
      <motion.h1
        className="absolute top-8 left-1/2 -translate-x-1/2 z-40 text-3xl md:text-4xl font-display text-white drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.5)",
        }}
      >
        ✨ Happy Birthday! ✨
      </motion.h1>

      {/* The House - Illustrated Style */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* House Structure */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto"
            style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))" }}
          >
            {/* Roof */}
            <motion.polygon
              points="400,50 100,200 700,200"
              fill="#d2691e"
              stroke="#8b4513"
              strokeWidth="4"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            />
            
            {/* House Body */}
            <motion.rect
              x="130"
              y="200"
              width="540"
              height="350"
              fill="#ffe4c4"
              stroke="#deb887"
              strokeWidth="4"
              rx="8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            />

            {/* Chimney */}
            <motion.rect
              x="550"
              y="80"
              width="50"
              height="120"
              fill="#cd853f"
              stroke="#8b4513"
              strokeWidth="3"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </svg>

          {/* Interactive Spaces - Overlaid on house */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl px-8 mt-16">
              {/* Garden - Top Left */}
              <motion.button
                onClick={() => handleSpaceClick("garden")}
                className="aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #90ee90 0%, #32cd32 100%)",
                  boxShadow: "0 8px 30px rgba(50, 205, 50, 0.4)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(50, 205, 50, 0.6), 0 0 60px rgba(255, 182, 193, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span 
                  className="text-4xl md:text-5xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌸
                </motion.span>
                <span className="font-display text-lg md:text-xl text-white drop-shadow-md">Garden</span>
                
                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 text-lg"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                    style={{
                      top: `${30 + i * 20}%`,
                      left: `${20 + i * 25}%`,
                    }}
                  >
                    🦋
                  </motion.div>
                ))}
              </motion.button>

              {/* Room - Top Right */}
              <motion.button
                onClick={() => handleSpaceClick("room")}
                className="aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #dda0dd 0%, #9370db 100%)",
                  boxShadow: "0 8px 30px rgba(147, 112, 219, 0.4)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(147, 112, 219, 0.6), 0 0 60px rgba(255, 223, 186, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span 
                  className="text-4xl md:text-5xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🛏️
                </motion.span>
                <span className="font-display text-lg md:text-xl text-white drop-shadow-md">Room</span>
                
                {/* Fairy lights */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-yellow-300"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                    style={{
                      top: `${15}%`,
                      left: `${15 + i * 22}%`,
                    }}
                  />
                ))}
              </motion.button>

              {/* Kitchen - Bottom Left */}
              <motion.button
                onClick={() => handleSpaceClick("kitchen")}
                className="aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%)",
                  boxShadow: "0 8px 30px rgba(255, 105, 180, 0.4)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(255, 105, 180, 0.6), 0 0 60px rgba(255, 218, 185, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.span 
                  className="text-4xl md:text-5xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🍰
                </motion.span>
                <span className="font-display text-lg md:text-xl text-white drop-shadow-md">Kitchen</span>
                
                {/* Steam hearts */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-sm opacity-60"
                    animate={{
                      y: [0, -30],
                      opacity: [0.6, 0],
                      scale: [0.8, 1.2],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.5,
                      repeat: Infinity,
                    }}
                    style={{
                      bottom: `30%`,
                      left: `${30 + i * 15}%`,
                    }}
                  >
                    💗
                  </motion.div>
                ))}
              </motion.button>

              {/* Play Corner - Bottom Right */}
              <motion.button
                onClick={() => handleSpaceClick("play")}
                className="aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #ffd700 0%, #ffa500 100%)",
                  boxShadow: "0 8px 30px rgba(255, 165, 0, 0.4)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 12px 40px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 255, 224, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.span 
                  className="text-4xl md:text-5xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  🎉
                </motion.span>
                <span className="font-display text-lg md:text-xl text-white drop-shadow-md">Play!</span>
                
                {/* Bouncing stars */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-lg"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                    style={{
                      top: `${25 + i * 20}%`,
                      right: `${15 + i * 10}%`,
                    }}
                  >
                    ⭐
                  </motion.div>
                ))}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Ground decoration */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20"
        style={{
          background: "linear-gradient(0deg, #228b22 0%, #32cd32 100%)",
        }}
      >
        {/* Grass blades */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1 bg-green-700 rounded-t-full"
            style={{
              height: 15 + Math.random() * 20,
              left: `${i * 5 + Math.random() * 3}%`,
            }}
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GiftHouse;
