import { useState } from "react";
import { Gift } from "lucide-react";

interface GiftWorldButtonProps {
  onClick: () => void;
}

const GiftWorldButton = ({ onClick }: GiftWorldButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 left-6 z-50 group"
      aria-label="Open gift world"
    >
      {/* Sparkle effects on hover */}
      {isHovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-ping"
              style={{
                top: `${Math.random() * 100 - 50}%`,
                left: `${Math.random() * 100 - 50}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </>
      )}

      {/* Glow ring */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isHovered
            ? "bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 blur-lg opacity-80 scale-150 animate-pulse"
            : "bg-pink-300/30 blur-md opacity-0"
        }`}
      />

      {/* Main button */}
      <div
        className={`relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-soft-pink via-blush-rose to-pastel-lavender border-2 border-white/50 shadow-lg transition-all duration-300 ${
          isHovered ? "scale-110 animate-bounce" : "scale-100"
        }`}
      >
        <Gift
          className={`w-6 h-6 text-dark-berry transition-transform duration-300 ${
            isHovered ? "rotate-12 scale-110" : ""
          }`}
        />
        <span className="font-body text-base font-medium text-dark-berry whitespace-nowrap">
          lil BHD gift for Love
        </span>

        {/* Sparkle decorations */}
        <span
          className={`absolute -top-1 -right-1 text-xs transition-all duration-300 ${
            isHovered ? "opacity-100 animate-spin" : "opacity-60"
          }`}
        >
          ✨
        </span>
        <span
          className={`absolute -bottom-1 -left-1 text-xs transition-all duration-300 ${
            isHovered ? "opacity-100 scale-125" : "opacity-40"
          }`}
        >
          💝
        </span>
      </div>
    </button>
  );
};

export default GiftWorldButton;
