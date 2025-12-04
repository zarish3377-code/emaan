import { MessageCircleHeart } from 'lucide-react';

interface JustSayItButtonProps {
  onClick: () => void;
}

const JustSayItButton = ({ onClick }: JustSayItButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#c76b8f] to-[#d98aa8] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse-glow"
      style={{
        boxShadow: '0 8px 30px rgba(199, 107, 143, 0.6)'
      }}
    >
      <MessageCircleHeart className="w-5 h-5" />
      <span className="font-serif">Just Say It</span>
    </button>
  );
};

export default JustSayItButton;
