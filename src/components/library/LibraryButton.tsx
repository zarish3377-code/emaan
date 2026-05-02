import { useState } from "react";
import LibraryModal from "./LibraryModal";
import { useHomeMode } from "@/home-mode/useHomeMode";

const LibraryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isActive: homeActive } = useHomeMode();

  // Hide the library button entirely while Home Mode is active
  const hidden = homeActive;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lib-btn"
        style={{
          position: 'fixed',
          top: '74px',
          right: '26px',
          zIndex: 9998,
          opacity: hidden ? 0 : 1,
          pointerEvents: hidden ? 'none' : 'auto',
          visibility: hidden ? 'hidden' : 'visible',
          background: 'linear-gradient(135deg, #f5ead7, #f2e0c0)',
          border: '1.5px solid #c9a84c',
          borderRadius: '100px',
          padding: '10px 20px',
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#5D3048',
          letterSpacing: '0.02em',
          cursor: 'pointer',
          transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 2px 12px rgba(201,168,76,0.2), 0 1px 3px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(201,168,76,0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,168,76,0.2), 0 1px 3px rgba(0,0,0,0.08)';
        }}
      >
        📚 Your Lil Library 🌷
      </button>
      {isOpen && <LibraryModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default LibraryButton;
