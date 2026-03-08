import { useState, useEffect, useCallback, useRef } from "react";

// ─── Messages ───────────────────────────────────────────
const gardenMsgs = [
  "I love you",
  "Someone(meee) notices every little thing about you",
  "You don't need to try so hard to be loved",
  "You are exactly enough, right now",
  "Rest, you've already done enough today",
  "Once again, thanks to be born",
];
const bedroomMsgs: Record<string, string> = {
  lamp: "you can rest now. the world will still be there.",
  pillow: "you deserve softness. always.",
  window: "someone is thinking of you right now.",
};
const kitchenMsgs: Record<string, string> = {
  mug: "drink water, please. your body asked nicely.",
  kettle: "Wish u were here to scold me for consuming caffeine.",
  plant: "Did you eat today? If not, I still love you the same.",
};
const heartMsgs = [
  "I lovvvveeeeeee my cutiee pattoooootieeee pookieeee(Obviously You).",
  "Your presence is a gift.",
  "Your laugh is genuinely contagious.",
  "Someone chose to live in this world because you're in it.",
];
const starMsgs = [
  "You're doing better than you think.",
  "Don't be so hard on yourself.",
  "I live in you I feel it too.",
  "You are somebody's favourite(minee!! who else huhh).",
];

// ─── Cycling helper ──────────────────────────────────────
function useCycler(pool: string[]) {
  const used = useRef<number[]>([]);
  return useCallback(() => {
    if (used.current.length >= pool.length) used.current = [];
    const avail = pool.map((_, i) => i).filter(i => !used.current.includes(i));
    const pick = avail[Math.floor(Math.random() * avail.length)];
    used.current.push(pick);
    return pool[pick];
  }, [pool]);
}

// ─── Bubble ─────────────────────────────────────────────
interface BubbleData { msg: string; x: number; y: number; flipped?: boolean }
const Bubble = ({ msg, x, y, flipped, onDone }: BubbleData & { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="lm-bubble" style={{
      left: x,
      top: flipped ? y + 20 : y - 14,
      ...(flipped && {
        animation: 'lm-bubble-in 240ms cubic-bezier(0.34,1.4,0.64,1), lm-bubble-out 300ms ease-in 2900ms forwards',
        transform: 'translate(-50%, 0)',
      }),
    }}>
      <p style={{ margin: 0 }}>{msg}</p>
      <div className={`lm-bubble-tail ${flipped ? 'lm-bubble-tail-up' : ''}`} />
    </div>
  );
};

// ─── SVG Icons ───────────────────────────────────────────
const MoonIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9">
    <path d="M7.5 5.5a4 4 0 01-5-3.8A4 4 0 107.5 5.5z" fill="#A898C8" />
  </svg>
);
const StarIcon4 = ({ size = 9, color = "var(--lm-gold)", className = "" }: { size?: number; color?: string; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" className={className}>
    <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12l-1.5-4.5L0 6l4.5-1.5z" fill={color} />
  </svg>
);
const HeartSVG = ({ size = 17, color = "var(--lm-rose)" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
    <path d="M12 21.35C6.1 16.07 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.1 7.57-10 12.85z" fill={color} />
  </svg>
);
const Star5SVG = ({ size = 18, color = "var(--lm-gold)" }: { size?: number; color?: string }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? size / 2 : size / 5;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${size / 2 + r * Math.cos(a)},${size / 2 + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
      <polygon points={pts} fill={color} />
    </svg>
  );
};

// ─── Petal ───────────────────────────────────────────────
const petalColors = ["var(--lm-lavender)", "var(--lm-rose)", "rgba(200,190,240,0.7)"];
const Petal = ({ i }: { i: number }) => {
  const ref = useRef({
    x: 5 + Math.random() * 85,
    drift: -40 + Math.random() * 80,
    dur: 8 + Math.random() * 8,
    delay: Math.random() * 6,
    size: 8 + Math.random() * 10,
    rot: Math.random() * 360,
    opa: 0.5 + Math.random() * 0.25,
    color: petalColors[i % 3],
  });
  const p = ref.current;
  return (
    <svg className="lm-petal" width={p.size} height={p.size * 1.4} viewBox="0 0 10 14"
      style={{
        '--petal-x': `${p.x}%`, '--petal-drift': `${p.drift}px`,
        '--petal-dur': `${p.dur}s`, '--petal-delay': `${p.delay}s`,
        '--petal-rot': `${p.rot}deg`, '--petal-opa': `${p.opa}`,
      } as React.CSSProperties}>
      <ellipse cx="5" cy="7" rx="4.5" ry="6.5" fill={p.color} opacity={p.opa} />
    </svg>
  );
};

// ─── Fireflies (Garden ambient) ─────────────────────────
const Fireflies = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 8 + Math.random() * 84;
      const y = 10 + Math.random() * 70;
      const dur = 4 + Math.random() * 6;
      const delay = Math.random() * 5;
      const driftX = -20 + Math.random() * 40;
      const driftY = -15 + Math.random() * 30;
      return (
        <div key={i} className="lm-firefly" style={{
          left: `${x}%`, top: `${y}%`,
          '--ff-dur': `${dur}s`, '--ff-delay': `${delay}s`,
          '--ff-dx': `${driftX}px`, '--ff-dy': `${driftY}px`,
        } as React.CSSProperties} />
      );
    })}
  </>
);

// ─── Shooting Star (Garden) ─────────────────────────────
const ShootingStar = () => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 20, y: 10 });

  useEffect(() => {
    const fire = () => {
      setPos({ x: 10 + Math.random() * 60, y: 5 + Math.random() * 20 });
      setVisible(true);
      setTimeout(() => setVisible(false), 800);
    };
    const interval = setInterval(fire, 12000 + Math.random() * 8000);
    const initial = setTimeout(fire, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  if (!visible) return null;
  return (
    <div className="lm-shooting-star" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
      <svg width="60" height="2" viewBox="0 0 60 2">
        <defs>
          <linearGradient id="ssG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="rgba(237,216,146,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,1)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="60" height="1.5" rx="1" fill="url(#ssG)" />
      </svg>
    </div>
  );
};

// ─── Dust Motes (Bedroom ambient) ───────────────────────
const DustMotes = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => {
      const x = 50 + Math.random() * 45;
      const y = 10 + Math.random() * 60;
      const dur = 5 + Math.random() * 7;
      const delay = Math.random() * 4;
      const size = 2 + Math.random() * 2;
      return (
        <div key={i} className="lm-dust-mote" style={{
          left: `${x}%`, top: `${y}%`, width: size, height: size,
          '--dm-dur': `${dur}s`, '--dm-delay': `${delay}s`,
        } as React.CSSProperties} />
      );
    })}
  </>
);

// ─── Candle (Kitchen ambient) ───────────────────────────
const CandleFlame = () => (
  <div className="lm-candle-wrap">
    <svg width="12" height="30" viewBox="0 0 12 30">
      <rect x="4" y="14" width="4" height="16" rx="1" fill="#E8D8C0" />
      <path className="lm-flame" d="M6 14 Q2 8 6 0 Q10 8 6 14Z" fill="url(#flameG)" />
      <defs>
        <linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#E8A040" />
          <stop offset="50%" stopColor="#F0C860" />
          <stop offset="100%" stopColor="#FFF8E0" />
        </linearGradient>
      </defs>
    </svg>
    <div className="lm-candle-glow" />
  </div>
);

// ─── Clock (Kitchen ambient) ────────────────────────────
const WallClock = () => {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSec(s => (s + 1) % 60), 1000);
    return () => clearInterval(interval);
  }, []);
  const angle = sec * 6;
  return (
    <svg className="lm-wall-clock" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="rgba(30,20,10,0.8)" stroke="var(--lm-clay)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1" fill="var(--lm-gold)" />
      <line x1="16" y1="16" x2="16" y2="6" stroke="var(--lm-peach)" strokeWidth="1" strokeLinecap="round" />
      <line x1="16" y1="16" x2="22" y2="16" stroke="var(--lm-peach)" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="16" y1="16"
        x2={16 + 10 * Math.sin(angle * Math.PI / 180)}
        y2={16 - 10 * Math.cos(angle * Math.PI / 180)}
        stroke="var(--lm-gold)" strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
};

// ─── Random Sparkle (Global ambient) ────────────────────
const RandomSparkles = () => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = idRef.current++;
      const x = 5 + Math.random() * 90;
      const y = 5 + Math.random() * 90;
      setSparkles(prev => [...prev, { id, x, y }]);
      setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 1200);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {sparkles.map(s => (
        <div key={s.id} className="lm-random-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          <StarIcon4 size={8} color="var(--lm-gold)" />
        </div>
      ))}
    </>
  );
};

// ─── Caustic Overlay ────────────────────────────────────
const CausticOverlay = () => <div className="lm-caustic" />;

// ─── Welcome Text ───────────────────────────────────────
const WelcomeText = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return <div className="lm-welcome-text">welcome home</div>;
};

// ─── Garden ──────────────────────────────────────────────
const flowerData = [
  { x: 12, y: 55, color: "rgba(232,164,192,0.8)", glow: "rgba(232,164,192,0.2)" },
  { x: 28, y: 62, color: "rgba(196,184,232,0.8)", glow: "rgba(196,184,232,0.2)" },
  { x: 48, y: 50, color: "rgba(152,196,168,0.8)", glow: "rgba(152,196,168,0.2)" },
  { x: 68, y: 60, color: "rgba(237,216,146,0.75)", glow: "rgba(237,216,146,0.2)" },
  { x: 85, y: 54, color: "rgba(240,200,168,0.8)", glow: "rgba(240,200,168,0.2)" },
];
const skyStars = [
  { x: 15, y: 12, s: 2, dur: 2.5, delay: 0 },
  { x: 35, y: 8, s: 3, dur: 3.2, delay: 0.5 },
  { x: 50, y: 18, s: 2, dur: 4, delay: 1 },
  { x: 65, y: 6, s: 3, dur: 2.8, delay: 0.3 },
  { x: 78, y: 22, s: 2, dur: 3.5, delay: 1.2 },
  { x: 20, y: 30, s: 2, dur: 5, delay: 0.8 },
  { x: 55, y: 35, s: 3, dur: 2.2, delay: 1.5 },
  { x: 88, y: 15, s: 2, dur: 4.5, delay: 0.2 },
];

const GardenRoom = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => {
  const getMsg = useCycler(gardenMsgs);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  const handleFlowerClick = (i: number, e: React.MouseEvent) => {
    onBubble(getMsg(), e);
    setFlashColor(flowerData[i].glow);
    setTimeout(() => setFlashColor(null), 500);
    // Scatter petals from the flower
    const btn = e.currentTarget as HTMLElement;
    const room = btn.closest('.lm-room') as HTMLElement;
    if (!room) return;
    const rect = btn.getBoundingClientRect();
    const roomRect = room.getBoundingClientRect();
    for (let p = 0; p < 6; p++) {
      const petal = document.createElement('div');
      petal.className = 'lm-scatter-petal';
      const angle = (p * 60) * Math.PI / 180;
      petal.style.cssText = `left:${rect.left - roomRect.left + rect.width/2}px;top:${rect.top - roomRect.top + rect.height/2}px;background:${flowerData[i].color};--sp-x:${Math.cos(angle)*20}px;--sp-y:${Math.sin(angle)*20}px`;
      room.appendChild(petal);
      setTimeout(() => petal.remove(), 600);
    }
  };

  return (
    <div className="lm-room lm-garden lm-room-enter">
      <span className="lm-room-label">garden</span>
      {/* Room flash */}
      {flashColor && <div className="lm-room-flash" style={{ background: flashColor }} />}
      {/* Moonlight rays */}
      <div className="lm-moonlight-rays" />
      <div className="lm-moon" />
      {skyStars.map((s, i) => (
        <div key={i} className="lm-sky-star" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s,
          '--tw-dur': `${s.dur}s`, '--tw-delay': `${s.delay}s`,
        } as React.CSSProperties} />
      ))}
      {/* Fireflies */}
      <Fireflies />
      {/* Shooting star */}
      <ShootingStar />
      {/* Grass shimmer particles */}
      <div className="lm-grass-shimmer" />
      {/* Butterflies */}
      <div className="lm-butterfly lm-butterfly-1" style={{ top: '30%' }}>
        <svg width="28" height="20" viewBox="0 0 28 20">
          <ellipse className="lm-wing" cx="7" cy="8" rx="7" ry="6" fill="rgba(196,184,232,0.55)" />
          <ellipse className="lm-wing lm-wing-lower" cx="8" cy="14" rx="5" ry="4" fill="rgba(196,184,232,0.4)" />
          <ellipse className="lm-wing lm-wing-right" cx="21" cy="8" rx="7" ry="6" fill="rgba(196,184,232,0.55)" />
          <ellipse className="lm-wing lm-wing-right lm-wing-lower" cx="20" cy="14" rx="5" ry="4" fill="rgba(196,184,232,0.4)" />
          <ellipse cx="14" cy="10" rx="1.5" ry="6" fill="rgba(180,160,220,0.7)" />
        </svg>
      </div>
      <div className="lm-butterfly lm-butterfly-2" style={{ top: '45%' }}>
        <svg width="22" height="16" viewBox="0 0 22 16">
          <ellipse className="lm-wing" cx="5" cy="6" rx="5" ry="5" fill="rgba(232,164,192,0.45)" />
          <ellipse className="lm-wing lm-wing-lower" cx="6" cy="11" rx="4" ry="3" fill="rgba(232,164,192,0.35)" />
          <ellipse className="lm-wing lm-wing-right" cx="17" cy="6" rx="5" ry="5" fill="rgba(232,164,192,0.45)" />
          <ellipse className="lm-wing lm-wing-right lm-wing-lower" cx="16" cy="11" rx="4" ry="3" fill="rgba(232,164,192,0.35)" />
          <ellipse cx="11" cy="8" rx="1" ry="5" fill="rgba(200,160,180,0.6)" />
        </svg>
      </div>
      {/* Flowers */}
      {flowerData.map((f, i) => (
        <button key={i} className="lm-flower-group" style={{ left: `${f.x}%`, bottom: '48px' }}
          onClick={(e) => handleFlowerClick(i, e)}>
          <div className="lm-flower-glow" style={{
            background: `radial-gradient(circle, ${f.glow}, transparent 70%)`,
            '--glow-delay': `${i * 0.6}s`,
          } as React.CSSProperties} />
          <svg className="lm-flower-svg" width="36" height="50" viewBox="0 0 36 50">
            <path d={`M18 50 Q${16 + i} 35 18 24`} stroke="#3A7848" strokeWidth="2" fill="none" />
            {[0, 72, 144, 216, 288].map(deg => (
              <ellipse key={deg} cx="18" cy="11" rx="5" ry="9" fill={f.color}
                transform={`rotate(${deg} 18 18)`} />
            ))}
            <circle cx="18" cy="18" r="4" fill="#FFF8E0" style={{ filter: 'drop-shadow(0 0 3px rgba(255,248,224,0.6))' }} />
          </svg>
        </button>
      ))}
      {/* Grass */}
      <svg className="lm-grass-svg" viewBox="0 0 980 45" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grassG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A4A28" />
            <stop offset="100%" stopColor="#0E2E18" />
          </linearGradient>
        </defs>
        <path d="M0 20 Q80 5 180 18 Q300 30 420 14 Q540 4 660 20 Q780 30 900 12 Q950 8 980 16 L980 45 L0 45Z" fill="url(#grassG)" />
      </svg>
    </div>
  );
};

// ─── Bedroom ─────────────────────────────────────────────
const BedroomRoom = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => {
  const [lampFlare, setLampFlare] = useState(false);

  const handleLampClick = (e: React.MouseEvent) => {
    onBubble(bedroomMsgs.lamp, e);
    setLampFlare(true);
    setTimeout(() => setLampFlare(false), 600);
  };

  return (
    <div className="lm-room lm-bedroom lm-room-enter">
      <span className="lm-room-label">bedroom</span>
      <div className="lm-lamp-ambient" />
      {/* Dust motes */}
      <DustMotes />
      {/* Lamp flare */}
      {lampFlare && <div className="lm-room-flash" style={{ background: 'rgba(237,216,146,0.15)' }} />}
      {/* Window */}
      <button className="lm-window-btn" onClick={(e) => onBubble(bedroomMsgs.window, e)}>
        <svg width="60" height="80" viewBox="0 0 60 80">
          <rect x="0" y="0" width="60" height="80" rx="3" fill="#3A2810" />
          <rect x="4" y="4" width="52" height="72" fill="#0D1A3A" />
          <rect x="4" y="4" width="52" height="72" fill="rgba(100,120,180,0.15)" />
          {[[12,15],[35,25],[22,50],[40,60],[15,40],[45,18]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r={1.5} fill="#EEE8FF" opacity="0.8">
              <animate attributeName="opacity" values="1;0.1;1" dur={`${2+i*0.6}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <line x1="4" y1="40" x2="56" y2="40" stroke="rgba(58,40,16,0.8)" strokeWidth="1" />
          <line x1="30" y1="4" x2="30" y2="76" stroke="rgba(58,40,16,0.8)" strokeWidth="1" />
          <rect className="lm-curtain-l" x="-2" y="0" width="18" height="80" fill="url(#curtainG)" rx="0" />
          <rect className="lm-curtain-r" x="44" y="0" width="18" height="80" fill="url(#curtainG)" rx="0" />
          <defs>
            <linearGradient id="curtainG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(80,50,30,0.8)" />
              <stop offset="100%" stopColor="rgba(60,35,15,0.6)" />
            </linearGradient>
          </defs>
        </svg>
      </button>
      {/* Lamp */}
      <button className="lm-lamp-btn" onClick={handleLampClick}>
        <svg width="40" height="60" viewBox="0 0 40 60">
          <polygon points="6,22 34,22 30,0 10,0" fill="url(#shadeG)" />
          <rect x="18" y="22" width="4" height="16" fill="var(--lm-clay)" rx="1" />
          <rect x="12" y="38" width="16" height="6" fill="var(--lm-clay)" rx="2" />
          <defs>
            <linearGradient id="shadeG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0D890" />
              <stop offset="100%" stopColor="#E0C050" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
          width: 140, height: 120,
          background: 'radial-gradient(ellipse at center, rgba(237,216,146,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </button>
      {/* Book on nightstand */}
      <div className="lm-book" style={{ position: 'absolute', bottom: 28, right: 28 }}>
        <svg width="24" height="18" viewBox="0 0 24 18">
          <rect x="0" y="2" width="24" height="14" rx="1" fill="#4A3020" />
          <rect x="1" y="4" width="22" height="10" fill="#5A3828" />
          <line x1="3" y1="7" x2="21" y2="7" stroke="rgba(237,216,146,0.2)" strokeWidth="0.5" />
          <line x1="3" y1="10" x2="18" y2="10" stroke="rgba(237,216,146,0.15)" strokeWidth="0.5" />
          <rect x="0" y="0" width="24" height="3" rx="1" fill="#3A2018" />
        </svg>
        <div className="lm-book-glow" />
      </div>
      {/* Bed */}
      <svg style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }} width="160" height="100" viewBox="0 0 160 100">
        <rect x="30" y="0" width="100" height="36" rx="6" fill="url(#hbG)" />
        <rect x="30" y="36" width="100" height="16" fill="#3A2C20" />
        <rect x="30" y="60" width="100" height="40" rx="4" fill="url(#duvetG)" />
        <line x1="30" y1="70" x2="130" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="30" y1="80" x2="130" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="30" y1="90" x2="130" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <defs>
          <linearGradient id="hbG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A6040" /><stop offset="100%" stopColor="#6A4828" />
          </linearGradient>
          <linearGradient id="duvetG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A3A28" /><stop offset="100%" stopColor="#4A2E1E" />
          </linearGradient>
        </defs>
      </svg>
      {/* Pillow */}
      <button className="lm-pillow-btn" style={{ position: 'absolute', bottom: 64, left: 'calc(50% - 30px)' }}
        onClick={(e) => onBubble(bedroomMsgs.pillow, e)}>
        <svg width="80" height="22" viewBox="0 0 80 22">
          <rect x="5" y="2" width="70" height="18" rx="8" fill="#F0DCC4" />
          <rect x="8" y="4" width="65" height="18" rx="8" fill="#E8D0B4" />
          <line x1="15" y1="10" x2="65" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        </svg>
      </button>
    </div>
  );
};

// ─── Kitchen ─────────────────────────────────────────────
const KitchenRoom = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => (
  <div className="lm-room lm-kitchen lm-room-enter">
    <span className="lm-room-label">kitchen</span>
    {/* Clock */}
    <div style={{ position: 'absolute', top: 12, right: 20 }}>
      <WallClock />
    </div>
    {/* Candle */}
    <div style={{ position: 'absolute', bottom: 52, left: '35%' }}>
      <CandleFlame />
    </div>
    {/* Warmth haze */}
    <div className="lm-warmth-haze" />
    {/* Items on table */}
    <div style={{ position: 'absolute', bottom: 38, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end', gap: 28 }}>
      {/* Plant */}
      <button className="lm-plant-btn" onClick={(e) => onBubble(kitchenMsgs.plant, e)}>
        <svg width="30" height="50" viewBox="0 0 30 50">
          <polygon points="5,22 25,22 23,50 7,50" fill="#8A4A30" />
          <ellipse cx="15" cy="22" rx="10" ry="3" fill="#7A3A20" />
          <ellipse cx="15" cy="24" rx="8" ry="2" fill="#2A1A0A" />
          <line x1="15" y1="24" x2="15" y2="14" stroke="#4A8038" strokeWidth="1.5" />
          <path className="lm-plant-leaf" d="M15 16 Q8 8 5 2" stroke="#5A9848" strokeWidth="2" fill="none" />
          <path className="lm-plant-leaf" d="M15 14 Q22 6 26 2" stroke="#4A8038" strokeWidth="2" fill="none" style={{ animationDelay: '0.3s' }} />
          <path className="lm-plant-leaf" d="M15 18 Q6 14 2 10" stroke="#6AAE5A" strokeWidth="1.5" fill="none" style={{ animationDelay: '0.6s' }} />
        </svg>
      </button>
      {/* Mug */}
      <button className="lm-mug-btn" onClick={(e) => onBubble(kitchenMsgs.mug, e)}>
        <svg width="44" height="56" viewBox="0 0 44 56">
          <rect x="4" y="16" width="28" height="36" rx="3" fill="url(#mugG)" />
          <ellipse cx="18" cy="16" rx="14" ry="4" fill="#A07050" />
          <ellipse cx="18" cy="18" rx="12" ry="3" fill="#8A5030" />
          <path d="M32 24 Q40 26 40 34 Q40 42 32 44" stroke="var(--lm-peach)" strokeWidth="3" fill="none" />
          <path className="lm-steam-path" d="M12 12 Q10 6 14 0" stroke="rgba(240,220,200,0.5)" strokeWidth="1.5" fill="none" style={{ '--steam-delay': '0s' } as React.CSSProperties} />
          <path className="lm-steam-path" d="M18 12 Q20 4 16 -2" stroke="rgba(240,220,200,0.5)" strokeWidth="1.5" fill="none" style={{ '--steam-delay': '0.7s' } as React.CSSProperties} />
          <path className="lm-steam-path" d="M24 12 Q22 5 26 0" stroke="rgba(240,220,200,0.5)" strokeWidth="1.5" fill="none" style={{ '--steam-delay': '1.4s' } as React.CSSProperties} />
          <defs>
            <linearGradient id="mugG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C89878" /><stop offset="100%" stopColor="#B08060" />
            </linearGradient>
          </defs>
        </svg>
      </button>
      {/* Kettle */}
      <button className="lm-kettle-btn" onClick={(e) => onBubble(kitchenMsgs.kettle, e)}>
        <svg width="44" height="52" viewBox="0 0 44 52">
          <polygon points="6,10 38,10 36,48 8,48" fill="url(#kettleG)" />
          <rect x="14" y="4" width="16" height="6" rx="2" fill="#8A9A70" />
          <rect x="38" y="14" width="6" height="8" rx="2" fill="#7A8A60" transform="rotate(30 38 14)" />
          <path d="M6 24 Q-2 22 -2 30 Q-2 38 6 36" stroke="#6A7850" strokeWidth="2.5" fill="none" />
          <path className="lm-steam-path" d="M38 8 Q42 2 38 -4" stroke="rgba(240,220,200,0.4)" strokeWidth="1" fill="none" style={{ '--steam-delay': '0.3s' } as React.CSSProperties} />
          <defs>
            <linearGradient id="kettleG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7A8A60" /><stop offset="100%" stopColor="#5A6840" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
    {/* Table */}
    <svg style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)' }} width="280" height="44" viewBox="0 0 280 44">
      <rect x="0" y="0" width="280" height="14" rx="3" fill="url(#tableG)" />
      <rect x="20" y="14" width="8" height="30" fill="#6A4820" rx="1" />
      <rect x="252" y="14" width="8" height="30" fill="#6A4820" rx="1" />
      <defs>
        <linearGradient id="tableG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A6030" /><stop offset="100%" stopColor="#6A4820" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// ─── Play Corner ─────────────────────────────────────────
const heartsData = [
  { x: 15, y: 20, size: 13, color: "var(--lm-rose)", dur: 5, delay: 0, dx: 4, dy: -10 },
  { x: 40, y: 35, size: 17, color: "var(--lm-lavender)", dur: 6, delay: 0.8, dx: -5, dy: -12 },
  { x: 65, y: 25, size: 11, color: "rgba(240,180,160,0.8)", dur: 4.5, delay: 1.2, dx: 6, dy: -8 },
  { x: 30, y: 55, size: 20, color: "rgba(180,160,220,0.85)", dur: 7, delay: 0.4, dx: -4, dy: -14 },
  { x: 75, y: 50, size: 15, color: "var(--lm-rose)", dur: 5.5, delay: 2, dx: 3, dy: -11 },
];
const starsData = [
  { x: 20, y: 60, size: 18, color: "var(--lm-gold)", dur: 2.5, delay: 0 },
  { x: 55, y: 15, size: 22, color: "rgba(220,200,255,0.9)", dur: 3.5, delay: 0.5 },
  { x: 80, y: 40, size: 14, color: "var(--lm-gold)", dur: 4, delay: 1 },
  { x: 45, y: 70, size: 26, color: "rgba(255,220,180,0.85)", dur: 2.8, delay: 1.5 },
];

// Magical orbs for play corner
const magicOrbsData = [
  { x: 10, y: 15, size: 6, dur: 8, delay: 0 },
  { x: 50, y: 80, size: 5, dur: 10, delay: 2 },
  { x: 85, y: 30, size: 7, dur: 7, delay: 1 },
  { x: 35, y: 10, size: 4, dur: 9, delay: 3 },
  { x: 70, y: 65, size: 5, dur: 11, delay: 1.5 },
];

const PlayCorner = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => {
  const getHeartMsg = useCycler(heartMsgs);
  const getStarMsg = useCycler(starMsgs);
  const [poppedHeart, setPoppedHeart] = useState<number | null>(null);
  const [roseFlash, setRoseFlash] = useState(false);
  const [constellationLines, setConstellationLines] = useState<Array<{x1:number;y1:number;x2:number;y2:number}>>([]);

  const handleHeartClick = (i: number, e: React.MouseEvent) => {
    setPoppedHeart(i);
    onBubble(getHeartMsg(), e);
    setRoseFlash(true);
    setTimeout(() => setRoseFlash(false), 400);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const parent = (e.currentTarget as HTMLElement).closest('.lm-room') as HTMLElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    angles.forEach(a => {
      const p = document.createElement('div');
      p.className = 'lm-particle';
      const rad = (a * Math.PI) / 180;
      p.style.cssText = `left:${rect.left - parentRect.left + rect.width/2}px;top:${rect.top - parentRect.top + rect.height/2}px;background:${heartsData[i].color};--px:${Math.cos(rad)*24}px;--py:${Math.sin(rad)*24}px`;
      parent.appendChild(p);
      setTimeout(() => p.remove(), 500);
    });
    setTimeout(() => setPoppedHeart(null), 1200);
  };

  const handleStarClick = (i: number, e: React.MouseEvent) => {
    onBubble(getStarMsg(), e);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const parent = (e.currentTarget as HTMLElement).closest('.lm-room') as HTMLElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    // Sparkle lines
    [0, 60, 120, 180, 240, 300].forEach(a => {
      const line = document.createElement('div');
      line.className = 'lm-sparkle-line';
      line.style.cssText = `left:${rect.left - parentRect.left + rect.width/2}px;top:${rect.top - parentRect.top + rect.height/2}px;background:${starsData[i].color};--sp-angle:${a}deg`;
      parent.appendChild(line);
      setTimeout(() => line.remove(), 400);
    });
    // Constellation lines to nearby stars
    const clickedStar = starsData[i];
    const lines = starsData.filter((_, j) => j !== i).slice(0, 2).map(s => ({
      x1: clickedStar.x, y1: clickedStar.y, x2: s.x, y2: s.y,
    }));
    setConstellationLines(lines);
    setTimeout(() => setConstellationLines([]), 800);
  };

  return (
    <div className="lm-room lm-play lm-room-enter" style={{ position: 'relative' }}>
      <span className="lm-room-label">play corner</span>
      {/* Rose flash on heart click */}
      {roseFlash && <div className="lm-room-flash" style={{ background: 'rgba(232,164,192,0.12)' }} />}
      {/* Constellation lines */}
      {constellationLines.length > 0 && (
        <svg className="lm-constellation-svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {constellationLines.map((l, i) => (
            <line key={i} x1={`${l.x1}%`} y1={`${l.y1}%`} x2={`${l.x2}%`} y2={`${l.y2}%`}
              stroke="rgba(237,216,146,0.4)" strokeWidth="1" className="lm-constellation-line" />
          ))}
        </svg>
      )}
      {/* Magical orbs */}
      {magicOrbsData.map((orb, i) => (
        <div key={`orb${i}`} className="lm-magic-orb" style={{
          left: `${orb.x}%`, top: `${orb.y}%`, width: orb.size, height: orb.size,
          '--mo-dur': `${orb.dur}s`, '--mo-delay': `${orb.delay}s`,
        } as React.CSSProperties} />
      ))}
      {/* Ambient objects */}
      <div className="lm-ambient-obj lm-cloud-drift" style={{ top: '15%', left: '60%' }}>
        <svg width="32" height="18" viewBox="0 0 32 18">
          <circle cx="10" cy="12" r="6" fill="rgba(220,215,240,0.25)" />
          <circle cx="18" cy="9" r="8" fill="rgba(220,215,240,0.25)" />
          <circle cx="26" cy="13" r="5" fill="rgba(220,215,240,0.25)" />
        </svg>
      </div>
      <div className="lm-ambient-obj lm-crescent-rotate" style={{ top: '70%', left: '80%' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ filter: 'drop-shadow(0 0 4px rgba(237,216,146,0.4))' }}>
          <path d="M8 1a5 5 0 100 10 4 4 0 010-10z" fill="rgba(237,216,146,0.6)" />
        </svg>
      </div>
      <div className="lm-ambient-obj lm-orb-float" style={{ top: '40%', left: '10%' }}>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <defs>
            <radialGradient id="orbG">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(180,160,220,0.15)" />
            </radialGradient>
          </defs>
          <circle cx="5" cy="5" r="4.5" fill="url(#orbG)" stroke="rgba(200,185,235,0.4)" strokeWidth="0.5" />
        </svg>
      </div>
      {/* Hearts */}
      {heartsData.map((h, i) => (
        poppedHeart !== i && (
          <button key={`h${i}`} className="lm-float-heart" style={{
            left: `${h.x}%`, top: `${h.y}%`,
            '--hf-dur': `${h.dur}s`, '--hf-delay': `${h.delay}s`,
            '--hf-dx': `${h.dx}px`, '--hf-dy': `${h.dy}px`,
          } as React.CSSProperties} onClick={(e) => handleHeartClick(i, e)}>
            <HeartSVG size={h.size} color={h.color} />
          </button>
        )
      ))}
      {/* Stars */}
      {starsData.map((s, i) => (
        <button key={`s${i}`} className="lm-float-star-btn" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          '--si-dur': `${s.dur}s`, '--si-delay': `${s.delay}s`,
        } as React.CSSProperties} onClick={(e) => handleStarClick(i, e)}>
          <Star5SVG size={s.size} color={s.color} />
        </button>
      ))}
    </div>
  );
};

// ─── Easter Egg ──────────────────────────────────────────
const SecretStar = () => {
  const [opacity, setOpacity] = useState(0);
  const [found, setFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [heartVis, setHeartVis] = useState(false);
  const [goldFlash, setGoldFlash] = useState(false);
  const starRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!starRef.current || found) return;
    const rect = starRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
    if (dist < 35) setOpacity(1);
    else if (dist < 70) setOpacity(0.7);
    else setOpacity(0);
  }, [found]);

  const handleClick = () => {
    setFound(true);
    setOpacity(0);
    setGoldFlash(true);
    setTimeout(() => setGoldFlash(false), 800);
    setTimeout(() => {
      setShowModal(true);
      setTimeout(() => setLine1(true), 200);
      setTimeout(() => setLine2(true), 350);
      setTimeout(() => setLine3(true), 550);
      setTimeout(() => setHeartVis(true), 800);
    }, 300);
  };

  const closeModal = () => {
    setShowModal(false);
    setLine1(false);
    setLine2(false);
    setLine3(false);
    setHeartVis(false);
  };

  return (
    <div className="lm-roof" onMouseMove={handleMouseMove}>
      {goldFlash && <div className="lm-gold-shimmer" />}
      <button
        ref={starRef}
        className={`lm-secret-star ${found ? 'lm-star-found' : ''} ${opacity > 0.5 ? 'lm-star-glow' : ''}`}
        style={{ opacity: found ? 0.25 : opacity }}
        onClick={handleClick}
      >
        <Star5SVG size={14} color="var(--lm-gold)" />
      </button>
      {showModal && (
        <div className={`lm-secret-overlay ${showModal ? 'lm-secret-visible' : ''}`} onClick={closeModal}>
          <span className={`lm-secret-line ${line1 ? 'lm-line-visible' : ''}`}>you found the secret.</span>
          <span className={`lm-secret-line ${line2 ? 'lm-line-visible' : ''}`}>i was hoping you would.</span>
          <span className={`lm-secret-line ${line3 ? 'lm-line-visible' : ''}`}>this world was always here, waiting for you.</span>
          <span className={`lm-secret-heart-icon ${heartVis ? 'lm-line-visible' : ''}`}>
            <HeartSVG size={22} color="var(--lm-rose)" />
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Main LoveMode Component ─────────────────────────────
const LoveMode = () => {
  const [phase, setPhase] = useState<'off' | 'entering' | 'active' | 'exiting'>('off');
  const [bubble, setBubble] = useState<BubbleData | null>(null);
  const [worldVisible, setWorldVisible] = useState(false);
  const [roomsVisible, setRoomsVisible] = useState(false);
  const [petalsVisible, setPetalsVisible] = useState(false);
  const [petalsFading, setPetalsFading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const houseRef = useRef<HTMLDivElement>(null);
  const bubbleKey = useRef(0);

  const activate = useCallback(() => {
    setPhase('entering');
    setTimeout(() => setWorldVisible(true), 400);
    setTimeout(() => setRoomsVisible(true), 600);
    setTimeout(() => setPetalsVisible(true), 900);
    setTimeout(() => {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 3500);
    }, 1100);
    setTimeout(() => setPhase('active'), 1400);
  }, []);

  const deactivate = useCallback(() => {
    setPhase('exiting');
    setPetalsFading(true);
    setTimeout(() => setRoomsVisible(false), 100);
    setTimeout(() => setWorldVisible(false), 300);
    setTimeout(() => {
      setPetalsVisible(false);
      setPetalsFading(false);
      setPhase('off');
    }, 1000);
  }, []);

  const handleToggle = useCallback(() => {
    if (phase === 'off') activate();
    else if (phase === 'active') deactivate();
  }, [phase, activate, deactivate]);

  useEffect(() => {
    if (!roomsVisible) return;
    const rooms = document.querySelectorAll('.lm-room-enter');
    const delays = [0, 80, 80, 160];
    rooms.forEach((room, i) => {
      setTimeout(() => room.classList.add('lm-room-visible'), delays[i] || 0);
    });
    return () => {
      rooms.forEach(r => r.classList.remove('lm-room-visible'));
    };
  }, [roomsVisible]);

  const showBubble = useCallback((msg: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const houseRect = houseRef.current?.getBoundingClientRect();
    if (!houseRect) return;
    bubbleKey.current++;
    const x = rect.left - houseRect.left + rect.width / 2;
    const rawY = rect.top - houseRect.top;
    const flipped = rawY < 80;
    setBubble({ msg, x, y: flipped ? rawY + rect.height : rawY, flipped });
    setTimeout(() => setBubble(null), 3200);
  }, []);

  const isOn = phase !== 'off';

  return (
    <>
      {/* Toggle */}
      <div className="lm-toggle-wrap">
        <span className="lm-toggle-label">enter love mode</span>
        <div
          className={`lm-toggle ${isOn ? 'lm-on' : ''}`}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          aria-label="Toggle Love Mode"
        >
          <div className="lm-thumb">
            <span className="lm-thumb-icon">
              {isOn ? <StarIcon4 size={9} className="lm-thumb-star" /> : <MoonIcon />}
            </span>
          </div>
        </div>
      </div>

      {/* Veil */}
      {(phase === 'entering' || phase === 'active' || phase === 'exiting') && (
        <div className={`lm-veil ${phase === 'entering' ? 'lm-veil-in' : ''}`} />
      )}

      {/* Petals */}
      {petalsVisible && (
        <div className={`lm-petals ${petalsFading ? 'lm-petals-fading' : ''}`}>
          {Array.from({ length: 16 }).map((_, i) => <Petal key={i} i={i} />)}
        </div>
      )}

      {/* World */}
      {isOn && (
        <div className={`lm-world ${worldVisible ? 'lm-world-visible' : ''} ${phase === 'active' ? 'lm-cursor-heart' : ''}`}
          style={{ background: 'radial-gradient(ellipse at 35% 25%, #1A1428 0%, #0D0A14 60%, #130A1E 100%)' }}>
          <div className="lm-house" ref={houseRef}>
            {/* Caustic light overlay */}
            <CausticOverlay />
            {/* Random sparkles */}
            {phase === 'active' && <RandomSparkles />}
            {/* Welcome text */}
            {showWelcome && <WelcomeText />}
            <SecretStar />
            <GardenRoom onBubble={showBubble} />
            <PlayCorner onBubble={showBubble} />
            <BedroomRoom onBubble={showBubble} />
            <KitchenRoom onBubble={showBubble} />
            {bubble && (
              <Bubble key={bubbleKey.current} {...bubble} onDone={() => setBubble(null)} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoveMode;
