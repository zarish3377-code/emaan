import { Heart } from "lucide-react";

interface HugButtonProps {
  onClick: () => void;
}

const HugButton = ({ onClick }: HugButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-36 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Virtual Hug"
    >
      <Heart className="h-7 w-7 fill-white text-white animate-pulse" />
    </button>
  );
};

export default HugButton;
