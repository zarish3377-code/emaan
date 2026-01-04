import { Heart } from "lucide-react";

interface HugButtonProps {
  onClick: () => void;
}

const HugButton = ({ onClick }: HugButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-52 left-4 z-40 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      style={{
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)'
      }}
      aria-label="Virtual Hug"
    >
      <Heart className="h-5 w-5 text-white fill-white" />
    </button>
  );
};

export default HugButton;
