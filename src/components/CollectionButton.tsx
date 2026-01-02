interface CollectionButtonProps {
  onClick: () => void;
}

const CollectionButton = ({ onClick }: CollectionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-40 left-4 z-40 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      style={{
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), 0 0 30px rgba(196, 181, 253, 0.2)'
      }}
      aria-label="Open Collection"
    >
      <span className="font-serif text-sm text-dark-berry group-hover:text-violet-700 transition-colors">
        Collection 🎵
      </span>
    </button>
  );
};

export default CollectionButton;
