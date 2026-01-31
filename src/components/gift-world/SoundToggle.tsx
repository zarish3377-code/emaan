import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface SoundToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const SoundToggle = ({ isOn, onToggle }: SoundToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border-2 border-pink-200 hover:border-pink-400 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOn ? "Mute sounds" : "Unmute sounds"}
    >
      {isOn ? (
        <Volume2 className="w-5 h-5 text-pink-500" />
      ) : (
        <VolumeX className="w-5 h-5 text-gray-400" />
      )}
    </motion.button>
  );
};

export default SoundToggle;
