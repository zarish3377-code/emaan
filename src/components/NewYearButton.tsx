interface NewYearButtonProps {
  onClick: () => void;
}

const NewYearButton = ({ onClick }: NewYearButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-28 left-4 z-40 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      style={{
        boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 182, 193, 0.2)'
      }}
      aria-label="Open Happy New Year Letter"
    >
      <span className="font-serif text-sm text-dark-berry group-hover:text-amber-700 transition-colors">
        Happy New Year 🎊
      </span>
    </button>
  );
};

export default NewYearButton;
