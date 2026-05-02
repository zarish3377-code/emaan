import { useState, useEffect, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  getBookmarks, saveBookmarks, getAnnotations, saveAnnotations,
  Bookmark, Annotation, isLibraryAdmin, getLibraryUserId
} from "./libraryData";
import AnnotationPanel from "./AnnotationPanel";
import FlowerMarker from "./FlowerMarker";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// In-memory PDF cache
const pdfCache: Record<string, pdfjsLib.PDFDocumentProxy> = {};

interface Props {
  title: string;
  url: string;
  onBack: () => void;
}

const PdfReader = ({ title, url, onBack }: Props) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [pageInput, setPageInput] = useState('');
  const [scale, setScale] = useState(1.2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [placingMarker, setPlacingMarker] = useState(false);
  const [panelState, setPanelState] = useState<
    | { mode: 'create'; position: { x: number; y: number } }
    | { mode: 'edit'; annotation: Annotation }
    | null
  >(null);

  const admin = isLibraryAdmin();
  const userId = getLibraryUserId();

  // Load PDF with retry and caching
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    const loadPdf = async (attempt: number) => {
      try {
        if (pdfCache[url]) {
          if (cancelled) return;
          setPdf(pdfCache[url]);
          setTotalPages(pdfCache[url].numPages);
          setLoading(false);
          return;
        }
        // Attempt 1: range requests (fast for large PDFs)
        // Attempt 2+: full download fallback (more reliable)
        const useRanges = attempt === 1;
        const doc = await pdfjsLib.getDocument({
          url,
          ...(useRanges
            ? { rangeChunkSize: 65536, disableAutoFetch: true, disableStream: false }
            : { disableRange: true, disableStream: true, disableAutoFetch: false }),
        }).promise;
        if (cancelled) return;
        pdfCache[url] = doc;
        setPdf(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.warn(`PDF load attempt ${attempt} failed:`, err);
        if (attempt < 3) {
          setTimeout(() => loadPdf(attempt + 1), 400);
        } else {
          console.error("PDF load error after retries:", err, "URL:", url);
          setLoading(false);
          setLoadError(true);
        }
      }
    };

    loadPdf(1);
    return () => { cancelled = true; };
  }, [url]);

  // Load bookmarks/annotations
  useEffect(() => {
    setBookmarks(getBookmarks(title));
    setAnnotations(getAnnotations(title));
  }, [title]);

  // Render page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    pdf.getPage(currentPage).then(page => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      page.render({ canvasContext: ctx, viewport }).promise;
    });
    return () => { cancelled = true; };
  }, [pdf, currentPage, scale]);

  const isBookmarked = bookmarks.some(b => b.page === currentPage && (!b.userId || b.userId === userId));

  const toggleBookmark = () => {
    // Only toggle own bookmarks
    const ownBookmarks = bookmarks.filter(b => !b.userId || b.userId === userId);
    const otherBookmarks = bookmarks.filter(b => b.userId && b.userId !== userId);
    
    let updatedOwn: Bookmark[];
    if (ownBookmarks.some(b => b.page === currentPage)) {
      updatedOwn = ownBookmarks.filter(b => b.page !== currentPage);
    } else {
      updatedOwn = [...ownBookmarks, { page: currentPage, label: '', timestamp: new Date().toISOString(), userId }];
    }
    
    const combined = admin ? [...updatedOwn, ...otherBookmarks] : updatedOwn;
    setBookmarks(combined);
    saveBookmarks(title, updatedOwn);
  };

  const saveAnnotation = (data: { content: string; drawing?: string; marker: 'tulip' | 'daisy' }) => {
    if (!panelState) return;
    const ownAnnotations = annotations.filter(a => !a.userId || a.userId === userId);
    const otherAnnotations = annotations.filter(a => a.userId && a.userId !== userId);

    let updatedOwn: Annotation[];
    if (panelState.mode === 'create') {
      const note: Annotation = {
        id: crypto.randomUUID(),
        type: 'note',
        page: currentPage,
        content: data.content,
        drawing: data.drawing,
        marker: data.marker,
        position: panelState.position,
        timestamp: new Date().toISOString(),
        userId,
      };
      updatedOwn = [...ownAnnotations, note];
    } else {
      // edit existing
      const editId = panelState.annotation.id;
      updatedOwn = ownAnnotations.map(a =>
        a.id === editId
          ? { ...a, content: data.content, drawing: data.drawing, marker: data.marker, timestamp: new Date().toISOString() }
          : a
      );
    }

    setAnnotations(admin ? [...updatedOwn, ...otherAnnotations] : updatedOwn);
    saveAnnotations(title, updatedOwn);
    setPanelState(null);
    setPlacingMarker(false);
  };

  const removeAnnotation = (id: string) => {
    const target = annotations.find(a => a.id === id);
    if (!target) return;
    // Only allow removing own annotations (or admin can remove any)
    if (!admin && target.userId && target.userId !== userId) return;
    
    const updated = annotations.filter(a => a.id !== id);
    setAnnotations(updated);
    // Only save own annotations
    saveAnnotations(title, updated.filter(a => !a.userId || a.userId === userId));
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!placingMarker) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    setPanelState({ mode: 'create', position: pos });
  };

  const bgColor = darkMode ? '#1a1008' : '#fdf6e3';
  const textColor = darkMode ? '#f5ead7' : '#3A2A2E';
  const sidebarBg = darkMode ? '#2a1f10' : '#f2e0c0';
  const toolbarBg = darkMode ? '#0f0d07' : '#e8dcc8';

  const getUserLabel = (uid?: string) => {
    if (!uid) return '??';
    if (uid === userId) return 'you';
    return uid.slice(0, 6);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99995,
      background: bgColor,
      display: 'flex',
      flexDirection: 'column',
      animation: 'lib-reader-in 400ms ease',
    }}>
      <style>{`
        @keyframes lib-reader-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .lib-toolbar-btn {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 8px;
          padding: 6px 12px;
          color: ${textColor};
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 200ms ease;
          white-space: nowrap;
        }
        .lib-toolbar-btn:hover { background: rgba(201,168,76,0.25); }
        .lib-toolbar-btn.active { background: rgba(201,168,76,0.3); border-color: #c9a84c; }
        .lib-scrollbar::-webkit-scrollbar { width: 6px; }
        .lib-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .lib-scrollbar::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 3px; }
      `}</style>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
        background: toolbarBg, borderBottom: '1px solid rgba(201,168,76,0.2)',
        flexWrap: 'wrap', minHeight: '48px',
      }}>
        <button className="lib-toolbar-btn" onClick={onBack}>← Library</button>
        <div style={{
          flex: 1, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', fontStyle: 'italic', fontWeight: 600,
          color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
        }}>{title}</div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button className={`lib-toolbar-btn ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>🗂️</button>
          <button className={`lib-toolbar-btn ${isBookmarked ? 'active' : ''}`} onClick={toggleBookmark}>
            {isBookmarked ? '🔖' : '📑'}
          </button>
          <button
            className={`lib-toolbar-btn ${placingMarker ? 'active' : ''}`}
            title={placingMarker ? 'Click on the page to place an annotation' : 'Add annotation'}
            onClick={() => setPlacingMarker(p => !p)}
          >✏️</button>
          <button className="lib-toolbar-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '☀️' : '🌙'}</button>
          <button className="lib-toolbar-btn" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>−</button>
          <button className="lib-toolbar-btn" onClick={() => setScale(s => Math.min(3, s + 0.2))}>+</button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="lib-scrollbar" style={{
            width: '260px', flexShrink: 0, background: sidebarBg,
            borderRight: '1px solid rgba(201,168,76,0.2)', overflowY: 'auto', padding: '12px',
          }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              <button className={`lib-toolbar-btn ${sidebarTab === 'bookmarks' ? 'active' : ''}`}
                onClick={() => setSidebarTab('bookmarks')} style={{ flex: 1 }}>🔖 Bookmarks</button>
              <button className={`lib-toolbar-btn ${sidebarTab === 'notes' ? 'active' : ''}`}
                onClick={() => setSidebarTab('notes')} style={{ flex: 1 }}>📝 Notes</button>
            </div>

            {sidebarTab === 'bookmarks' ? (
              bookmarks.length === 0 ? (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: textColor, opacity: 0.5, fontStyle: 'italic', textAlign: 'center' }}>
                  No bookmarks yet
                </p>
              ) : (
                bookmarks.sort((a, b) => a.page - b.page).map((bm, i) => (
                  <div key={`${bm.page}-${bm.userId || i}`} style={{
                    padding: '8px', borderRadius: '6px',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    marginBottom: '6px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }} onClick={() => goToPage(bm.page)}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: textColor }}>
                      🔖 Page {bm.page}
                      {admin && bm.userId && <span style={{ opacity: 0.5, fontSize: '11px', marginLeft: '6px' }}>@{getUserLabel(bm.userId)}</span>}
                    </span>
                    {(!bm.userId || bm.userId === userId || admin) && (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        const updated = bookmarks.filter(b => !(b.page === bm.page && b.userId === bm.userId));
                        setBookmarks(updated);
                        saveBookmarks(title, updated.filter(b => !b.userId || b.userId === userId));
                      }} style={{ background: 'none', border: 'none', color: textColor, opacity: 0.4, cursor: 'pointer', fontSize: '14px' }}>×</button>
                    )}
                  </div>
                ))
              )
            ) : (
              annotations.length === 0 ? (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: textColor, opacity: 0.5, fontStyle: 'italic', textAlign: 'center' }}>
                  No annotations yet. Tap ✏️ then a spot on the page to plant one.
                </p>
              ) : (
                annotations.sort((a, b) => a.page - b.page).map(ann => (
                  <div key={ann.id} style={{
                    padding: '8px', borderRadius: '6px',
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    marginBottom: '6px', cursor: 'pointer',
                  }} onClick={() => {
                    goToPage(ann.page);
                    if (!ann.userId || ann.userId === userId || admin) {
                      setPanelState({ mode: 'edit', annotation: ann });
                    }
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '12px', color: textColor, opacity: 0.6 }}>
                        📝 Page {ann.page}
                        {admin && ann.userId && <span style={{ opacity: 0.5, fontSize: '10px', marginLeft: '4px' }}>@{getUserLabel(ann.userId)}</span>}
                      </span>
                      {(!ann.userId || ann.userId === userId || admin) && (
                        <button onClick={(e) => { e.stopPropagation(); removeAnnotation(ann.id); }}
                          style={{ background: 'none', border: 'none', color: textColor, opacity: 0.4, cursor: 'pointer', fontSize: '14px' }}>×</button>
                      )}
                    </div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: '12px', color: textColor,
                      margin: '4px 0 0', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{ann.content}</p>
                  </div>
                ))
              )
            )}
          </div>
        )}

        {/* Page viewer */}
        <div className="lib-scrollbar" style={{
          flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center',
          alignItems: 'flex-start', padding: '20px', position: 'relative',
        }}>
          {loading ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: textColor, fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem', fontStyle: 'italic',
            }}>
              <div style={{
                width: '40px', height: '40px', border: '3px solid rgba(201,168,76,0.2)',
                borderTopColor: '#c9a84c', borderRadius: '50%',
                animation: 'lib-spin 1s linear infinite', marginBottom: '16px',
              }} />
              Opening the book...
              <style>{`@keyframes lib-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : loadError ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: textColor, fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem', fontStyle: 'italic', textAlign: 'center', padding: '20px',
            }}>
              <span style={{ fontSize: '2rem', marginBottom: '12px' }}>📜</span>
              This tome seems to be resting... try again in a moment
              <button className="lib-toolbar-btn" style={{ marginTop: '16px' }} onClick={() => {
                delete pdfCache[url];
                setLoadError(false);
                setLoading(true);
                pdfjsLib.getDocument({ url, rangeChunkSize: 65536, disableAutoFetch: true }).promise
                  .then(doc => { pdfCache[url] = doc; setPdf(doc); setTotalPages(doc.numPages); setLoading(false); })
                  .catch(() => { setLoading(false); setLoadError(true); });
              }}>Try again</button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <canvas ref={canvasRef} onClick={handleCanvasClick} style={{
                maxWidth: '100%', borderRadius: '4px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                cursor: placingMarker ? 'crosshair' : 'default',
              }} />
              {placingMarker && (
                <div style={{
                  position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(26,16,8,0.9)', color: '#f5ead7', padding: '6px 14px',
                  borderRadius: '20px', fontFamily: "'Cormorant Garamond', serif", fontSize: '13px',
                  fontStyle: 'italic', border: '1px solid rgba(201,168,76,0.4)', zIndex: 6,
                  pointerEvents: 'none',
                }}>
                  ✿ Tap anywhere on the page to plant an annotation
                </div>
              )}
              {annotations.filter(a => a.page === currentPage && a.position).map(ann => {
                const canEdit = !ann.userId || ann.userId === userId || admin;
                return (
                  <button
                    key={ann.id}
                    title={ann.content ? `${ann.content.slice(0, 60)}${ann.content.length > 60 ? '…' : ''}` : 'Open annotation'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canEdit) setPanelState({ mode: 'edit', annotation: ann });
                    }}
                    style={{
                      position: 'absolute',
                      left: `${ann.position!.x}%`, top: `${ann.position!.y}%`,
                      transform: 'translate(-50%, -100%)',
                      background: 'transparent', border: 'none', padding: 0,
                      cursor: canEdit ? 'pointer' : 'default',
                      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
                      zIndex: 5, transition: 'transform 200ms ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -100%) scale(1.25)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -100%) scale(1)'; }}
                  >
                    <FlowerMarker type={ann.marker ?? 'tulip'} size={22} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        padding: '8px 16px', background: toolbarBg, borderTop: '1px solid rgba(201,168,76,0.2)',
      }}>
        <button className="lib-toolbar-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>◀ Prev</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="number" value={pageInput || currentPage}
            onChange={e => setPageInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { goToPage(parseInt(pageInput) || currentPage); setPageInput(''); } }}
            onBlur={() => setPageInput('')} style={{
              width: '50px', textAlign: 'center', background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', padding: '4px',
              color: textColor, fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', outline: 'none',
            }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: textColor, opacity: 0.6 }}>
            of {totalPages}
          </span>
        </div>
        <button className="lib-toolbar-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>Next ▶</button>
      </div>

      {panelState && (
        <AnnotationPanel
          initial={panelState.mode === 'edit' ? panelState.annotation : null}
          page={currentPage}
          canDelete={
            panelState.mode === 'edit' &&
            (admin || !panelState.annotation.userId || panelState.annotation.userId === userId)
          }
          onSave={saveAnnotation}
          onDelete={
            panelState.mode === 'edit'
              ? () => { removeAnnotation(panelState.annotation.id); setPanelState(null); }
              : undefined
          }
          onClose={() => setPanelState(null)}
        />
      )}
    </div>
  );
};

export default PdfReader;
