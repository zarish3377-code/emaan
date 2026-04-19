import { useState } from "react";
import { BOOKS } from "./libraryData";

interface Props {
  onBookClick: (index: number) => void;
}

// Fixed heights per book — deterministic, never random
const FIXED_HEIGHTS: number[] = BOOKS.map((_, i) => {
  const base = 120;
  const offsets = [0, 8, 4, 12, 2, 10, 6, 14, 3, 11, 7, 1, 9, 5, 13];
  return base + offsets[i % offsets.length];
});

const SPINE_COLORS = [
  '#8B2500', '#2F4F4F', '#4B0082', '#8B6914', '#556B2F',
  '#800020', '#1C3A5F', '#5C4033', '#6B3A5E', '#2E4C3E',
  '#703030', '#3B3B6D', '#654321', '#4A3728', '#7B3F00',
  '#2C3E50', '#6B4423', '#4A2C2A', '#3D5C3A', '#5B3256',
  '#8C5E3C', '#4E3524', '#395144', '#6D3B47', '#4B3621',
  '#5D3954', '#3A4E3F', '#6B3030', '#2D4A5E', '#7A5C2E',
  '#4E2A3A', '#3B5E4A', '#6A4B2A', '#5A3040', '#3E5A3A',
  '#704828', '#4B3A5E', '#5E3A28', '#3A5048', '#6B4A3E',
  '#5A3A28',
];

const BOOK_WIDTH = 70;
const BOOKS_PER_ROW = 8;

// Static cover URL — pre-generated at build time, no PDF rendering in browser
const coverUrl = (i: number) => `/library/covers/book_${String(i).padStart(2, '0')}.webp`;

const BookShelf = ({ onBookClick }: Props) => {
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const [failedCovers, setFailedCovers] = useState<Set<number>>(new Set());

  const rows: typeof BOOKS[] = [];
  for (let i = 0; i < BOOKS.length; i += BOOKS_PER_ROW) {
    rows.push(BOOKS.slice(i, i + BOOKS_PER_ROW));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '900px', margin: '0 auto' }}>
      {rows.map((row, rowIdx) => {
        const rowHeight = Math.max(...row.map((_, ci) => FIXED_HEIGHTS[rowIdx * BOOKS_PER_ROW + ci])) + 20;
        return (
          <div key={rowIdx}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '8px',
              height: `${rowHeight}px`,
              padding: '0 12px',
              flexWrap: 'nowrap',
            }}>
              {row.map((book, colIdx) => {
                const bookIndex = rowIdx * BOOKS_PER_ROW + colIdx;
                const height = FIXED_HEIGHTS[bookIndex];
                const isHovered = hoveredBook === bookIndex;
                const showFallback = failedCovers.has(bookIndex);
                const isAboveFold = rowIdx < 2;

                return (
                  <div
                    key={bookIndex}
                    style={{
                      position: 'relative',
                      width: `${BOOK_WIDTH}px`,
                      minWidth: `${BOOK_WIDTH}px`,
                      height: `${height}px`,
                      flexShrink: 0,
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={() => setHoveredBook(bookIndex)}
                    onMouseLeave={() => setHoveredBook(null)}
                    onClick={() => onBookClick(bookIndex)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        bottom: `${height + 10}px`,
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

                    {/* Book visual — fixed size container */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      transition: 'transform 300ms ease, box-shadow 300ms ease, filter 300ms ease',
                      transform: isHovered ? 'translateY(-10px) scale(1.05)' : 'translateY(0) scale(1)',
                      boxShadow: isHovered
                        ? '4px 6px 20px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.15)'
                        : '3px 4px 12px rgba(0,0,0,0.5)',
                      filter: isHovered ? 'brightness(1.1) sepia(5%)' : 'sepia(15%) contrast(1.05) brightness(0.95)',
                      backgroundColor: SPINE_COLORS[bookIndex % SPINE_COLORS.length],
                    }}>
                      {!showFallback ? (
                        <img
                          src={coverUrl(bookIndex)}
                          alt={book.title}
                          width={BOOK_WIDTH}
                          height={height}
                          decoding="async"
                          loading={isAboveFold ? "eager" : "lazy"}
                          // @ts-ignore — fetchpriority is valid HTML5
                          fetchpriority={isAboveFold ? "high" : "low"}
                          onError={() => setFailedCovers(prev => new Set(prev).add(bookIndex))}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        /* Spine fallback if cover .webp is missing */
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px',
                          background: `linear-gradient(180deg, ${SPINE_COLORS[bookIndex % SPINE_COLORS.length]}, ${SPINE_COLORS[bookIndex % SPINE_COLORS.length]}dd)`,
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
        );
      })}
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
