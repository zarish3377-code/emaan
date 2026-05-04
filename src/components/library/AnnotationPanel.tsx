import { useEffect, useRef, useState } from "react";
import { Annotation } from "./libraryData";

interface Props {
  initial?: Annotation | null;
  page: number;
  canDelete: boolean;
  onSave: (data: { content: string; drawing?: string; marker: 'tulip' | 'daisy' }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

// No black/near-black — only warm, soft, garden-inspired hues.
const COLORS = ["#c9a84c", "#b95c7c", "#5b8a72", "#5d6fb5", "#d97742", "#a86bc4"];

const AnnotationPanel = ({ initial, page, canDelete, onSave, onDelete, onClose }: Props) => {
  const [text, setText] = useState(initial?.content ?? "");
  const [marker, setMarker] = useState<'tulip' | 'daisy'>(initial?.marker ?? 'tulip');
  const [color, setColor] = useState(COLORS[0]);
  const [stroke, setStroke] = useState(2.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hasDrawn = useRef(!!initial?.drawing);

  // Load existing drawing (transparent canvas — no fill)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (initial?.drawing) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = initial.drawing;
    }
  }, [initial?.drawing]);

  const getPos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvasRef.current!.width,
      y: ((e.clientY - r.top) / r.height) * canvasRef.current!.height,
    };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    last.current = getPos(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const p = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    hasDrawn.current = true;
  };
  const end = () => { drawing.current = false; last.current = null; };

  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#fdf6e3';
    ctx.fillRect(0, 0, c.width, c.height);
    hasDrawn.current = false;
  };

  const save = () => {
    if (!text.trim() && !hasDrawn.current) return;
    const c = canvasRef.current!;
    onSave({
      content: text.trim(),
      drawing: hasDrawn.current ? c.toDataURL('image/png') : undefined,
      marker,
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99997,
        background: 'rgba(20,12,4,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        animation: 'ann-fade 200ms ease',
      }}
    >
      <style>{`
        @keyframes ann-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ann-pop { from { opacity:0; transform: scale(0.95) translateY(8px);} to { opacity:1; transform: scale(1) translateY(0);} }
        .ann-btn { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4); border-radius: 8px; padding: 6px 12px; color: #f5ead7; font-family: 'Cormorant Garamond', serif; font-size: 13px; cursor: pointer; transition: all 200ms; }
        .ann-btn:hover { background: rgba(201,168,76,0.3); }
        .ann-btn.primary { background: linear-gradient(135deg, #c9a84c, #a88430); border: none; color: #fff; }
        .ann-btn.danger { background: rgba(180,60,60,0.2); border-color: rgba(180,60,60,0.5); color: #ffd0d0; }
        .ann-swatch { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.2); transition: transform 150ms; }
        .ann-swatch.sel { border-color: #c9a84c; transform: scale(1.15); }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 95vw)', maxHeight: '92vh',
          background: '#1a1008', border: '1px solid rgba(201,168,76,0.35)',
          borderRadius: '14px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px',
          animation: 'ann-pop 260ms cubic-bezier(.2,.9,.3,1.2)', color: '#f5ead7',
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 600 }}>
            {initial ? '📝 Edit annotation' : '📝 New annotation'} <span style={{ opacity: 0.5, fontSize: '13px' }}>· Page {page}</span>
          </div>
          <button className="ann-btn" onClick={onClose}>✕</button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here..."
          autoFocus
          style={{
            width: '100%', minHeight: '70px', resize: 'vertical',
            background: 'rgba(255,255,255,0.05)', color: '#f5ead7',
            border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px',
            padding: '10px', fontFamily: "'Cormorant Garamond', serif",
            fontSize: '14px', fontStyle: 'italic', outline: 'none',
          }}
        />

        {/* Whiteboard toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>Whiteboard:</span>
          {COLORS.map((c) => (
            <span key={c} className={`ann-swatch ${color === c ? 'sel' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
          ))}
          <input type="range" min={1} max={10} step={0.5} value={stroke} onChange={(e) => setStroke(parseFloat(e.target.value))} style={{ width: '90px' }} />
          <button className="ann-btn" onClick={clear}>Clear</button>
          <span style={{ marginLeft: 'auto', fontSize: '12px', opacity: 0.7 }}>Marker:</span>
          <button className={`ann-btn ${marker === 'tulip' ? 'primary' : ''}`} onClick={() => setMarker('tulip')}>🌷 Tulip</button>
          <button className={`ann-btn ${marker === 'daisy' ? 'primary' : ''}`} onClick={() => setMarker('daisy')}>🌼 Daisy</button>
        </div>

        <canvas
          ref={canvasRef}
          width={520}
          height={260}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          style={{
            width: '100%', height: '260px', borderRadius: '10px',
            background: '#fdf6e3', cursor: 'crosshair', touchAction: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.4)',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {canDelete && onDelete && (
            <button className="ann-btn danger" onClick={onDelete}>Delete</button>
          )}
          <button className="ann-btn" onClick={onClose}>Cancel</button>
          <button className="ann-btn primary" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AnnotationPanel;
