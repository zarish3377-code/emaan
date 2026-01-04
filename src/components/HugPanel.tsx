import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import FloatingTulip from "./FloatingTulip";

interface HugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HugPanel = ({ isOpen, onClose }: HugPanelProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Play the collection sound (reusing existing sound)
      audioRef.current = new Audio("/audio/collection/Ohh_she_loves_me.mp3");
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Audio play failed, likely due to autoplay restrictions
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate floating tulips positions
  const tulipPositions = [
    { top: "5%", left: "5%", size: 60, delay: 0 },
    { top: "10%", right: "8%", size: 50, delay: 1 },
    { bottom: "15%", left: "10%", size: 55, delay: 2 },
    { bottom: "10%", right: "5%", size: 65, delay: 3 },
    { top: "40%", left: "3%", size: 45, delay: 4 },
    { top: "35%", right: "3%", size: 50, delay: 5 },
    { bottom: "35%", left: "5%", size: 55, delay: 0 },
    { bottom: "40%", right: "8%", size: 48, delay: 1 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Floating Tulips around the GIF */}
        <div className="relative">
          {tulipPositions.map((pos, index) => (
            <FloatingTulip
              key={index}
              style={{
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
              }}
              delay={pos.delay}
              size={pos.size}
            />
          ))}

          {/* Hug GIF */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/images/hug.gif"
              alt="Virtual Hug"
              className="max-h-[70vh] max-w-[90vw] object-contain"
            />
            
            {/* Warm glow overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-pink-500/20 via-transparent to-rose-300/10" />
          </div>
        </div>

        {/* Message */}
        <p className="mt-6 font-display text-2xl text-white drop-shadow-lg animate-fade-in">
          sending you the biggest hug 🤗💕
        </p>
      </div>

      {/* Floating hearts animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-up text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            💗
          </div>
        ))}
      </div>
    </div>
  );
};

export default HugPanel;
