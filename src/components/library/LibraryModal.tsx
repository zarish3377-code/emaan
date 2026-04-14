import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { BOOKS, getBookUrl } from "./libraryData";
import BookShelf from "./BookShelf";
import PdfReader from "./PdfReader";
import libraryBg from "/library/background.jpg";

interface Props {
  onClose: () => void;
}

const LibraryModal = ({ onClose }: Props) => {
  const [visible, setVisible] = useState(false);
  const [activeBook, setActiveBook] = useState<{ title: string; url: string } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 500);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const openBook = (index: number) => {
    const book = BOOKS[index];
    setActiveBook({ title: book.title, url: getBookUrl(book.fileName) });
  };

  const content = (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${libraryBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10, 5, 2, 0.55)',
      }} />
      {/* Dust particles */}
      <DustParticles />

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '20px',
          zIndex: 10,
          background: 'rgba(201,168,76,0.15)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#f5ead7',
          fontSize: '20px',
          fontFamily: 'serif',
          transition: 'all 250ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; }}
      >
        ×
      </button>

      {/* Title */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        paddingTop: '28px',
        paddingBottom: '8px',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#f5ead7',
          letterSpacing: '0.06em',
          margin: 0,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          🌷 Your Lil Library 🌷
        </h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.85rem',
          color: 'rgba(245,234,215,0.5)',
          marginTop: '4px',
          fontStyle: 'italic',
        }}>
          25 books, all yours
        </p>
      </div>

      {/* Book shelves */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        flex: 1,
        overflowY: 'auto',
        padding: '8px 20px 40px',
      }}>
        <BookShelf onBookClick={openBook} />
      </div>

      {/* PDF Reader overlay */}
      {activeBook && (
        <PdfReader
          title={activeBook.title}
          url={activeBook.url}
          onBack={() => setActiveBook(null)}
        />
      )}
    </div>
  );

  return createPortal(content, document.body);
};

// Simple CSS dust particles
function DustParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 85}%`,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 8,
    delay: Math.random() * 6,
    drift: -20 + Math.random() * 40,
    opacity: 0.2 + Math.random() * 0.4,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes lib-dust-float {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: var(--dust-op); }
          90% { opacity: var(--dust-op); }
          100% { transform: translateY(-10vh) translateX(var(--dust-drift)); opacity: 0; }
        }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.left,
          bottom: 0,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: '50%',
          background: `rgba(255,220,160,${p.opacity})`,
          animation: `lib-dust-float ${p.duration}s linear ${p.delay}s infinite`,
          '--dust-drift': `${p.drift}px`,
          '--dust-op': p.opacity,
        } as any} />
      ))}
    </div>
  );
}

export default LibraryModal;
