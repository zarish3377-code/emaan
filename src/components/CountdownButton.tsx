import { Clock } from "lucide-react";

interface CountdownButtonProps {
  onClick: () => void;
}

const CountdownButton = ({ onClick }: CountdownButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-[230px] z-40 px-4 py-2 rounded-full bg-gradient-to-r from-green-300 to-emerald-400 border border-green-300/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      style={{
        boxShadow: '0 4px 20px rgba(134, 239, 172, 0.4), 0 0 30px rgba(52, 211, 153, 0.2)'
      }}
      aria-label="Countdown Timer"
    >
      <span className="font-serif text-sm text-white group-hover:text-green-100 transition-colors flex items-center gap-1">
        <Clock className="h-4 w-4" /> Timer
      </span>
    </button>
  );
};

export default CountdownButton;
