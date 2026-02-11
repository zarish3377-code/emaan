import { useState, useCallback, useRef } from "react";
import { X } from "lucide-react";

interface NavMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (handler: () => void) => void;
  onOpenNeno: () => void;
  onOpenGarden: () => void;
  onOpenNewYear: () => void;
  onOpenCollection: () => void;
  onOpenValentine: () => void;
  onOpenCountdown: () => void;
  onOpenMessage: () => void;
}

const features = [
  { key: "neno", label: "Ur Neno", emoji: "🌼", gradient: "from-yellow-300 via-pink-200 to-orange-200", ring: "ring-yellow-300/60", particles: ["🌼", "🌷", "✨", "🌻", "💛"] },
  { key: "garden", label: "Secret Garden", emoji: "🌸", gradient: "from-emerald-300 via-green-200 to-teal-100", ring: "ring-emerald-300/60", particles: ["🌸", "🌺", "🌿", "🍃", "🌱"] },
  { key: "newyear", label: "Happy New Year", emoji: "🎊", gradient: "from-amber-300 via-yellow-200 to-rose-200", ring: "ring-amber-300/60", particles: ["🎉", "🎊", "✨", "🥳", "🎆"] },
  { key: "collection", label: "Collection", emoji: "🎵", gradient: "from-violet-400 via-purple-200 to-fuchsia-200", ring: "ring-violet-400/60", particles: ["🎵", "🎶", "🎧", "💜", "✨"] },
  { key: "valentine", label: "My Valentine", emoji: "💌", gradient: "from-rose-400 via-pink-300 to-red-200", ring: "ring-rose-400/60", particles: ["❤️", "💕", "💗", "🌹", "💖"] },
  { key: "countdown", label: "Countdown", emoji: "💗", gradient: "from-pink-400 via-rose-300 to-pink-200", ring: "ring-pink-400/60", particles: ["💗", "⏳", "💖", "✨", "💞"] },
  { key: "message", label: "Just Say It", emoji: "💬", gradient: "from-[#c76b8f] via-[#d98aa8] to-[#e8b4c8]", ring: "ring-[#c76b8f]/60", particles: ["💬", "💌", "💕", "🫶", "✨"] },
];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
  delay: number;
}

const NavMenuPanel = ({
  isOpen,
  onClose,
  onSelect,
  onOpenNeno,
  onOpenGarden,
  onOpenNewYear,
  onOpenCollection,
  onOpenValentine,
  onOpenCountdown,
  onOpenMessage,
}: NavMenuPanelProps) => {
  const [burstParticles, setBurstParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);

  const handlers: Record<string, () => void> = {
    neno: onOpenNeno,
    garden: onOpenGarden,
    newyear: onOpenNewYear,
    collection: onOpenCollection,
    valentine: onOpenValentine,
    countdown: onOpenCountdown,
    message: onOpenMessage,
  };

  const handleClick = useCallback((e: React.MouseEvent, featureKey: string, particleEmojis: string[]) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: idCounter.current++,
        emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
        x: cx,
        y: cy,
        angle: (360 / 12) * i + (Math.random() * 20 - 10),
        distance: 60 + Math.random() * 80,
        delay: Math.random() * 100,
      });
    }
    setBurstParticles(newParticles);

    setTimeout(() => {
      setBurstParticles([]);
      onSelect(handlers[featureKey]);
    }, 600);
  }, [handlers, onSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Particle burst layer */}
      {burstParticles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <span
            key={p.id}
            className="fixed z-[60] pointer-events-none text-2xl"
            style={{
              left: p.x,
              top: p.y,
              animation: `navBurst 550ms ${p.delay}ms ease-out forwards`,
              ['--tx' as string]: `${tx}px`,
              ['--ty' as string]: `${ty}px`,
            }}
          >
            {p.emoji}
          </span>
        );
      })}

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Title */}
        <h2 className="font-serif text-white text-xl tracking-wide opacity-80">✨ Menu ✨</h2>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {features.map((f, i) => (
            <button
              key={f.key}
              onClick={(e) => handleClick(e, f.key, f.particles)}
              className="flex flex-col items-center gap-2 animate-scale-in group"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-xl ring-2 ${f.ring} group-hover:scale-115 group-hover:shadow-2xl group-hover:ring-4 transition-all duration-300 group-active:scale-95`}
                style={{
                  boxShadow: '0 6px 30px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.6)',
                }}
              >
                <span className="text-3xl drop-shadow-md">{f.emoji}</span>
              </div>
              <span className="text-white text-xs font-serif text-center leading-tight drop-shadow-md font-medium">
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavMenuPanel;
