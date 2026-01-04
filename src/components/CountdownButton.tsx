import { Heart } from "lucide-react";

interface CountdownButtonProps {
  onClick: () => void;
}

const CountdownButton = ({ onClick }: CountdownButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-40 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Countdown Timer"
    >
      <Heart className="h-6 w-6 animate-pulse fill-current" />
    </button>
  );
};

export default CountdownButton;
