interface NenoButtonProps {
  onClick: () => void;
}

const NenoButton = ({ onClick }: NenoButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-40 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-200 to-pink-200 border border-yellow-300/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      style={{
        boxShadow: '0 4px 20px rgba(243, 184, 211, 0.4), 0 0 30px rgba(253, 224, 71, 0.2)'
      }}
      aria-label="Open Ur Neno"
    >
      <span className="font-serif text-sm text-dark-berry group-hover:text-blush-rose transition-colors">
        ~Ur neno 🌼🌷
      </span>
    </button>
  );
};

export default NenoButton;
