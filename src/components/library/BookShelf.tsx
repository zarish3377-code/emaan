import { useState, useEffect, useRef, useCallback } from "react";
import { BOOKS, getBookUrl } from "./libraryData";
import * as pdfjsLib from "pdfjs-dist";

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface Props {
  onBookClick: (index: number) => void;
}

// Spine colors for variety
const SPINE_COLORS = [
  '#8B2500', '#2F4F4F', '#4B0082', '#8B6914', '#556B2F',
  '#800020', '#1C3A5F', '#5C4033', '#6B3A5E', '#2E4C3E',
  '#703030', '#3B3B6D', '#654321', '#4A3728', '#7B3F00',
  '#2C3E50', '#6B4423', '#4A2C2A', '#3D5C3A', '#5B3256',
  '#8C5E3C', '#4E3524', '#395144', '#6D3B47', '#4B3621',
  '#5D3954', '#3A4E3F', '#6B3030', '#2D4A5E', '#7A5C2E',
  '#4E2A3A', '#3B5E4A', '#6A4B2A', '#5A3040', '#3E5A3A',
  '#704828', '#4B3A5E', '#5E3A28', '#3A5048', '#6B4A3E',
];

const BookShelf = ({ onBookClick }: Props) => {
  const [covers, setCovers] = useState<Record<number, string>>({});
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const loadedRef = useRef<Set<number>>(new Set());

  // Generate cover thumbnails
  const loadCover = useCallback(async (index: number) => {
    if (loadedRef.current.has(index)) return;
    loadedRef.current.add(index);
    try {
      const url = getBookUrl(BOOKS[index].fileName);
      const pdf = await pdfjsLib.getDocument({ url, disableAutoFetch: true, disableStream: true }).promise;
      const page = await pdf.getPage(1);
      const vp = page.getViewport({ scale: 0.4 });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      setCovers(prev => ({ ...prev, [index]: canvas.toDataURL('image/jpeg', 0.6) }));
      pdf.destroy();
    } catch (err) {
      console.warn(`Failed to load cover for ${BOOKS[index].title}`, err);
    }
  }, []);

  useEffect(() => {
    // Load covers in batches to avoid overwhelming
    BOOKS.forEach((_, i) => {
      setTimeout(() => loadCover(i), i * 200);
    });
  }, [loadCover]);

  // Split books into rows of 8
  const rows: typeof BOOKS[] = [];
  for (let i = 0; i < BOOKS.length; i += 8) {
    rows.push(BOOKS.slice(i, i + 8));
  }

  let globalIdx = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx}>
          {/* Shelf row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '8px',
            flexWrap: 'wrap',
            paddingBottom: '6px',
          }}>
            {row.map((book, colIdx) => {
              const bookIndex = rowIdx === 0 ? colIdx : rowIdx === 1 ? 7 + colIdx : rowIdx === 2 ? 13 + colIdx : 19 + colIdx;
              const height = 120 + (bookIndex % 5) * 8 - (bookIndex % 3) * 4;
              const isHovered = hoveredBook === bookIndex;
              const cover = covers[bookIndex];

              return (
                <div
                  key={bookIndex}
                  style={{ position: 'relative', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredBook(bookIndex)}
                  onMouseLeave={() => setHoveredBook(null)}
                  onClick={() => onBookClick(bookIndex)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      bottom: `${height + 12}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(20,12,5,0.92)',
                      border: '1px solid #c9a84c',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      whiteSpace: 'nowrap',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '13px',
                      fontStyle: 'italic',
                      color: '#f2e0c0',
                      zIndex: 20,
                      pointerEvents: 'none',
                      animation: 'lib-tooltip-in 200ms ease',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    }}>
                      🌷 {book.title}
                    </div>
                  )}
                  {/* Book spine/cover */}
                  <div style={{
                    width: cover ? '70px' : '38px',
                    height: `${height}px`,
                    borderRadius: cover ? '3px' : '2px',
                    overflow: 'hidden',
                    transition: 'all 300ms ease',
                    transform: isHovered ? 'translateY(-10px) scale(1.05)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? '4px 6px 20px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.15)'
                      : '3px 4px 12px rgba(0,0,0,0.5)',
                    filter: isHovered ? 'brightness(1.1) sepia(5%)' : 'sepia(15%) contrast(1.05) brightness(0.95)',
                    position: 'relative',
                  }}>
                    {cover ? (
                      <img
                        src={cover}
                        alt={book.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(180deg, ${SPINE_COLORS[bookIndex]}, ${SPINE_COLORS[bookIndex]}dd)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                      }}>
                        <span style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '9px',
                          color: '#f5ead7',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          maxHeight: `${height - 16}px`,
                        }}>
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Shelf bar */}
          <div style={{
            height: '8px',
            background: 'linear-gradient(180deg, #5C4033, #3A2718)',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            maxWidth: '860px',
            margin: '0 auto',
          }} />
        </div>
      ))}
      <style>{`
        @keyframes lib-tooltip-in {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BookShelf;
