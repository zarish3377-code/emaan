import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { BOOKS, getBookUrl } from "./libraryData";
import BookShelf from "./BookShelf";
import PdfReader from "./PdfReader";
import {
  listUserBooks, addUserBook, getUserBookBlobUrl, deleteUserBook,
  UserBookMeta,
} from "./userBooks";
import libraryBg from "/library/background.png";

interface Props {
  onClose: () => void;
}

const LibraryModal = ({ onClose }: Props) => {
  const [visible, setVisible] = useState(false);
  const [activeBook, setActiveBook] = useState<{ title: string; url: string } | null>(null);
  const [userBooks, setUserBooks] = useState<UserBookMeta[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    // Hide Home Mode toggle while library is open
    const toggleEl = document.getElementById('hm-toggle-root');
    if (toggleEl) toggleEl.style.display = 'none';
    listUserBooks().then(setUserBooks).catch(() => {});
    return () => {
      document.body.style.overflow = '';
      const toggleEl = document.getElementById('hm-toggle-root');
      if (toggleEl) toggleEl.style.display = '';
    };
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

  const openUserBook = async (b: UserBookMeta) => {
    const url = await getUserBookBlobUrl(b.id);
    if (url) setActiveBook({ title: b.title, url });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') continue;
        await addUserBook(f);
      }
      const next = await listUserBooks();
      setUserBooks(next);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeUserBook = async (id: string) => {
    await deleteUserBook(id);
    setUserBooks(await listUserBooks());
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
          fontSize: '14px',
          color: '#f5e6c8',
          marginTop: '6px',
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          opacity: 0.85,
        }}>
          for my girl who lives in books ✨
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
        {/* User uploads shelf */}
        <div style={{ maxWidth: '900px', margin: '0 auto 22px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px 8px',
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 14,
              color: '#f5e6c8',
              letterSpacing: '0.06em',
              opacity: 0.85,
            }}>
              ✨ Your uploads {userBooks.length > 0 && `(${userBooks.length})`}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                background: 'rgba(201,168,76,0.18)',
                border: '1px solid rgba(201,168,76,0.5)',
                borderRadius: 100,
                padding: '6px 14px',
                color: '#f5ead7',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13,
                fontStyle: 'italic',
                cursor: uploading ? 'wait' : 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.32)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.18)'; }}
            >
              {uploading ? 'Adding…' : '+ Add a book'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 8,
            padding: '0 12px',
            minHeight: 140,
            flexWrap: 'wrap',
          }}>
            {userBooks.length === 0 && (
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 13,
                color: 'rgba(245,230,200,0.6)',
                padding: '20px 4px',
              }}>
                add your own PDFs — they stay here just for you
              </div>
            )}
            {userBooks.map((b, i) => {
              const colors = ['#5D3954', '#3A4E3F', '#6B3030', '#2D4A5E', '#7A5C2E', '#4E2A3A'];
              const bg = colors[i % colors.length];
              return (
                <div
                  key={b.id}
                  style={{ position: 'relative', width: 70, height: 130 }}
                  onMouseEnter={(e) => {
                    const x = e.currentTarget.querySelector('.ub-del') as HTMLElement | null;
                    if (x) x.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const x = e.currentTarget.querySelector('.ub-del') as HTMLElement | null;
                    if (x) x.style.opacity = '0';
                  }}
                >
                  <button
                    type="button"
                    onClick={() => openUserBook(b)}
                    title={b.title}
                    style={{
                      width: '100%', height: '100%',
                      background: `linear-gradient(180deg, ${bg}, ${bg}cc)`,
                      border: 'none', borderRadius: 3, cursor: 'pointer',
                      boxShadow: '3px 4px 12px rgba(0,0,0,0.5)',
                      padding: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform 250ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                  >
                    <span style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 10,
                      color: '#f5ead7',
                      letterSpacing: '0.05em',
                      fontWeight: 600,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      maxHeight: 114,
                    }}>
                      {b.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="ub-del"
                    onClick={(e) => { e.stopPropagation(); removeUserBook(b.id); }}
                    title="Remove"
                    style={{
                      position: 'absolute', top: -6, right: -6,
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(20,12,5,0.9)',
                      border: '1px solid #c9a84c', color: '#f5ead7',
                      fontSize: 11, lineHeight: 1, cursor: 'pointer',
                      opacity: 0, transition: 'opacity 200ms ease',
                      padding: 0,
                    }}
                  >×</button>
                </div>
              );
            })}
          </div>
          <div style={{
            height: 8,
            background: 'linear-gradient(180deg, #5C4033, #3A2718)',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            margin: '6px auto 0',
            maxWidth: 860,
          }} />
        </div>

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
