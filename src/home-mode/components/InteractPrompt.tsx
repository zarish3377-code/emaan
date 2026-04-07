interface Props {
  label: string
  x: number
  y: number
  fromBottom: boolean
}

export function InteractPrompt({ label, x, y, fromBottom }: Props) {
  const posStyle: React.CSSProperties = fromBottom
    ? { left: `${x}%`, bottom: `${y + 8}%` }
    : { left: `${x}%`, top: `${y}%` }

  return (
    <div
      className="hm-interact-prompt"
      style={{
        position: 'absolute',
        ...posStyle,
        transform: 'translateX(-50%) translateY(-100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(220,180,190,0.4)',
        borderRadius: 100,
        padding: '5px 12px 5px 8px',
        pointerEvents: 'none',
        zIndex: 20,
        animation: 'hm-prompt-in 150ms ease-out',
      }}
    >
      <span className="hm-prompt-key-desktop" style={{
        background: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)',
        borderRadius: 6,
        width: 20, height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 600,
        color: '#7B3F5E',
      }}>E</span>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 13, fontStyle: 'italic',
        color: '#5D3048',
      }}>{label}</span>

      <style>{`
        @keyframes hm-prompt-in {
          from { transform: translateX(-50%) translateY(-80%); opacity: 0; }
          to { transform: translateX(-50%) translateY(-100%); opacity: 1; }
        }
        @media (max-width: 640px) {
          .hm-prompt-key-desktop { display: none !important; }
        }
      `}</style>
    </div>
  )
}
