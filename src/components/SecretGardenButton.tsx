interface SecretGardenButtonProps {
  onClick: () => void;
}

const SecretGardenButton = ({ onClick }: SecretGardenButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-16 left-4 z-40 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-pink-100 border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      style={{
        boxShadow: '0 4px 20px rgba(134, 239, 172, 0.3), 0 0 30px rgba(243, 184, 211, 0.2)'
      }}
      aria-label="Open Secret Garden"
    >
      <span className="font-serif text-sm text-dark-berry group-hover:text-green-700 transition-colors">
        Secret Garden 🌸
      </span>
    </button>
  );
};

export default SecretGardenButton;
