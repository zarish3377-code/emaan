import { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "./BackButton";
import SoundToggle from "./SoundToggle";
import GardenSpace from "./spaces/GardenSpace";
import RoomSpace from "./spaces/RoomSpace";
import KitchenSpace from "./spaces/KitchenSpace";
import PlayCornerSpace from "./spaces/PlayCornerSpace";

interface HouseHubProps {
  onExit: () => void;
}

interface RoomCard {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  hoverGradient: string;
}

const rooms: RoomCard[] = [
  {
    id: "garden",
    title: "Garden",
    emoji: "🌸",
    description: "Fun & Magical",
    gradient: "from-green-200 via-emerald-200 to-teal-200",
    hoverGradient: "from-green-300 via-emerald-300 to-teal-300",
  },
  {
    id: "room",
    title: "Room",
    emoji: "🛏️",
    description: "Cozy & Dreamy",
    gradient: "from-purple-200 via-pink-200 to-rose-200",
    hoverGradient: "from-purple-300 via-pink-300 to-rose-300",
  },
  {
    id: "kitchen",
    title: "Kitchen",
    emoji: "🍰",
    description: "Sweet & Caring",
    gradient: "from-orange-200 via-amber-200 to-yellow-200",
    hoverGradient: "from-orange-300 via-amber-300 to-yellow-300",
  },
  {
    id: "play",
    title: "Play Corner",
    emoji: "🎉",
    description: "Pure Fun!",
    gradient: "from-pink-200 via-fuchsia-200 to-violet-200",
    hoverGradient: "from-pink-300 via-fuchsia-300 to-violet-300",
  },
];

// Background particles
const particles = [...Array(30)].map((_, i) => ({
  id: i,
  emoji: ["✨", "💖", "⭐", "🌸", "💕", "🦋", "🌷", "💗"][i % 8],
  x: Math.random() * 100,
  duration: 4 + Math.random() * 4,
  delay: Math.random() * 5,
  size: 12 + Math.random() * 16,
}));

// Sky decorations
const clouds = [...Array(6)].map((_, i) => ({
  id: i,
  top: 5 + Math.random() * 20,
  duration: 20 + Math.random() * 15,
  delay: Math.random() * 10,
  size: 40 + Math.random() * 30,
}));

const HouseHub = ({ onExit }: HouseHubProps) => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Render active room
  if (activeRoom === "garden") {
    return <GardenSpace onBack={() => setActiveRoom(null)} />;
  }
  if (activeRoom === "room") {
    return <RoomSpace onBack={() => setActiveRoom(null)} />;
  }
  if (activeRoom === "kitchen") {
    return <KitchenSpace onBack={() => setActiveRoom(null)} />;
  }
  if (activeRoom === "play") {
    return <PlayCornerSpace onBack={() => setActiveRoom(null)} />;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Gradient sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-pink-100 to-rose-200" />

      {/* Floating clouds */}
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute text-white/80 select-none"
          style={{ 
            top: `${cloud.top}%`, 
            fontSize: cloud.size,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
          initial={{ x: "-10vw" }}
          animate={{ x: "110vw" }}
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Floating particles background */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute pointer-events-none select-none"
          style={{ 
            left: `${particle.x}%`,
            fontSize: particle.size,
          }}
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
            ease: "linear",
          }}
        >
          {particle.emoji}
        </motion.span>
      ))}

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{ 
            top: `${10 + i * 15}%`,
            boxShadow: "0 0 10px 3px rgba(253, 224, 71, 0.8), -20px 0 20px 2px rgba(253, 224, 71, 0.4)",
          }}
          initial={{ x: "110vw", opacity: 0 }}
          animate={{ 
            x: "-10vw",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: 5 + i * 8,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Navigation */}
      <BackButton onClick={onExit} label="Exit" variant="back" />
      <SoundToggle isOn={soundOn} onToggle={() => setSoundOn(!soundOn)} />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 drop-shadow-lg mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            style={{ backgroundSize: "200% 200%" }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✨ OUR HOME ✨
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-body text-pink-600/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            tap a room to explore 💕
          </motion.p>
        </motion.div>

        {/* House illustration with rooms */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl w-full">
          {rooms.map((room, index) => (
            <motion.button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={`relative p-6 md:p-8 rounded-3xl bg-gradient-to-br ${
                hoveredRoom === room.id ? room.hoverGradient : room.gradient
              } shadow-xl border-4 border-white/60 transition-all duration-300 overflow-hidden group`}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredRoom === room.id ? 0.5 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Particle trail on hover */}
              {hoveredRoom === room.id && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-xl pointer-events-none"
                      initial={{ 
                        x: "50%", 
                        y: "50%", 
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{ 
                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                        y: `${50 + (Math.random() - 0.5) * 100}%`,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                      }}
                      transition={{ 
                        duration: 0.8,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                    >
                      ✨
                    </motion.span>
                  ))}
                </>
              )}

              {/* Room content */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.span 
                  className="text-5xl md:text-6xl mb-3"
                  animate={hoveredRoom === room.id ? { 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {room.emoji}
                </motion.span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-gray-800 mb-1">
                  {room.title}
                </h3>
                <p className="font-body text-sm text-gray-600">
                  {room.description}
                </p>
              </div>

              {/* Rainbow border pulse on hover */}
              {hoveredRoom === room.id && (
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-transparent"
                  style={{
                    background: "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b) border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Ground flowers */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-around px-4 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {["🌷", "🌸", "🌼", "🌻", "🌺", "🌷", "🌸", "🌼"].map((flower, i) => (
            <motion.span
              key={i}
              className="text-2xl md:text-3xl"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2 + i * 0.3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {flower}
            </motion.span>
          ))}
        </motion.div>

        {/* Butterflies */}
        {[...Array(4)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl pointer-events-none"
            style={{ top: `${30 + i * 15}%` }}
            initial={{ x: "-5vw" }}
            animate={{ 
              x: "105vw",
              y: [0, -30, 0, 30, 0],
            }}
            transition={{
              x: { duration: 15 + i * 5, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            🦋
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default HouseHub;
