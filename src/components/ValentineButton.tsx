import { Heart } from "lucide-react";

interface ValentineButtonProps {
  onClick: () => void;
}

const ValentineButton = ({ onClick }: ValentineButtonProps) => {
  const now = new Date();
  const unlockDate = new Date(2026, 1, 10); // Feb 10, 2026
  const isUnlocked = now >= unlockDate;

  return (
    <button
      onClick={isUnlocked ? onClick : undefined}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full border shadow-lg transition-all duration-300 group ${
        isUnlocked
          ? "bg-gradient-to-r from-rose-200 to-pink-300 border-rose-300/50 hover:shadow-xl hover:scale-105 cursor-pointer"
          : "bg-gray-200 border-gray-300/50 opacity-50 cursor-not-allowed"
      }`}
      style={
        isUnlocked
          ? { boxShadow: "0 4px 20px rgba(244, 63, 94, 0.4), 0 0 30px rgba(251, 113, 133, 0.2)" }
          : {}
      }
      aria-label="My Valentine"
    >
      <span className="font-serif text-sm text-dark-berry group-hover:text-rose-700 transition-colors flex items-center gap-1.5">
        <Heart className="h-3.5 w-3.5 fill-current" />
        My Valentine 💌
      </span>
    </button>
  );
};

export default ValentineButton;
