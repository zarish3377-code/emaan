import { Heart } from "lucide-react";

interface HugButtonProps {
  onClick: () => void;
}

const HugButton = ({ onClick }: HugButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-[140px] z-40 px-4 py-2 rounded-full bg-gradient-to-r from-purple-300 to-violet-400 border border-purple-300/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      style={{
        boxShadow: '0 4px 20px rgba(167, 139, 250, 0.4), 0 0 30px rgba(192, 132, 252, 0.2)'
      }}
      aria-label="Virtual Hug"
    >
      <span className="font-serif text-sm text-white group-hover:text-purple-100 transition-colors flex items-center gap-1">
        <Heart className="h-4 w-4 fill-current" /> Hug
      </span>
    </button>
  );
};

export default HugButton;
