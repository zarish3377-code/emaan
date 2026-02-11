import { useState } from "react";
import NavMenuPanel from "./NavMenuPanel";

interface NavMenuButtonProps {
  onOpenNeno: () => void;
  onOpenGarden: () => void;
  onOpenNewYear: () => void;
  onOpenCollection: () => void;
  onOpenValentine: () => void;
  onOpenCountdown: () => void;
  onOpenMessage: () => void;
}

const NavMenuButton = (props: NavMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFeatureClick = (handler: () => void) => {
    setIsOpen(false);
    handler();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 h-12 w-12 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 border border-pink-300/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        style={{
          boxShadow: '0 4px 25px rgba(243, 184, 211, 0.5)',
        }}
        aria-label="Open menu"
      >
        <span className="text-xl">🌷</span>
      </button>

      <NavMenuPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleFeatureClick}
        {...props}
      />
    </>
  );
};

export default NavMenuButton;
