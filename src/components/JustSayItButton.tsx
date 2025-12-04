import { MessageCircleHeart } from 'lucide-react';

interface JustSayItButtonProps {
  onClick: () => void;
}

const JustSayItButton = ({ onClick }: JustSayItButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blush-rose to-soft-pink text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse-glow"
      style={{
        boxShadow: '0 8px 30px rgba(243, 184, 211, 0.6)'
      }}
    >
      <MessageCircleHeart className="w-5 h-5" />
      <span className="font-serif">Just Say It</span>
    </button>
  );
};

export default JustSayItButton;
