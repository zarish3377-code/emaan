import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  variant?: "home" | "back";
}

const BackButton = ({ onClick, label = "Back", variant = "back" }: BackButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-all hover:bg-white/90"
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {variant === "home" ? (
        <Home className="w-5 h-5 text-pink-500" />
      ) : (
        <ArrowLeft className="w-5 h-5 text-pink-500" />
      )}
      <span className="font-body text-sm font-medium text-pink-600">{label}</span>
    </motion.button>
  );
};

export default BackButton;
