import { Heart } from "lucide-react";

interface CountdownButtonProps {
  onClick: () => void;
}

const CountdownButton = ({ onClick }: CountdownButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-52 left-16 z-40 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      style={{
        boxShadow: '0 4px 20px rgba(236, 72, 153, 0.5)'
      }}
      aria-label="Countdown Timer"
    >
      <Heart className="h-5 w-5 text-white fill-white" />
    </button>
  );
};

export default CountdownButton;
