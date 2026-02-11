import { useState, useCallback, useRef, useEffect } from "react";

interface NavMenuButtonProps {
  onOpenNeno: () => void;
  onOpenGarden: () => void;
  onOpenNewYear: () => void;
  onOpenCollection: () => void;
  onOpenValentine: () => void;
  onOpenCountdown: () => void;
  onOpenMessage: () => void;
}

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
  delay: number;
}

const petals = [
  { key: "collection", label: "Collection", emoji: "🎵", size: "small", particles: ["🎵", "🎶", "🎧", "💜", "✨"] },
  { key: "garden", label: "Secret Garden", emoji: "🌸", size: "small", particles: ["🌸", "🌺", "🌿", "🍃", "🌱"] },
  { key: "neno", label: "Ur Neno", emoji: "🌼", size: "large", particles: ["🌼", "🌷", "✨", "🌻", "💛"] },
  { key: "valentine", label: "My Valentine", emoji: "💌", size: "large", particles: ["❤️", "💕", "💗", "🌹", "💖"] },
  { key: "message", label: "Just Say It", emoji: "💬", size: "large", particles: ["💬", "💌", "💕", "🫶", "✨"] },
  { key: "newyear", label: "Happy New Year", emoji: "🎊", size: "small", particles: ["🎉", "🎊", "✨", "🥳", "🎆"] },
  { key: "countdown", label: "Countdown", emoji: "💗", size: "small", particles: ["💗", "⏳", "💖", "✨", "💞"] },
];

// Angles spread downward in a semi-arc, -50deg to +70deg
const petalAngles = [-50, -30, -12, 8, 28, 50, 70];
const RADIUS = 120;

const NavMenuButton = ({
  onOpenNeno,
  onOpenGarden,
  onOpenNewYear,
  onOpenCollection,
  onOpenValentine,
  onOpenCountdown,
  onOpenMessage,
}: NavMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [burstParticles, setBurstParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlers: Record<string, () => void> = {
    neno: onOpenNeno,
    garden: onOpenGarden,
    newyear: onOpenNewYear,
    collection: onOpenCollection,
    valentine: onOpenValentine,
    countdown: onOpenCountdown,
    message: onOpenMessage,
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen]);

  const handlePetalClick = useCallback(
    (e: React.MouseEvent, featureKey: string, particleEmojis: string[]) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const newParticles: Particle[] = [];
      for (let i = 0; i < 10; i++) {
        newParticles.push({
          id: idCounter.current++,
          emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
          x: cx,
          y: cy,
          angle: (360 / 10) * i + (Math.random() * 20 - 10),
          distance: 50 + Math.random() * 60,
          delay: Math.random() * 80,
        });
      }
      setBurstParticles(newParticles);

      setTimeout(() => {
        setBurstParticles([]);
        setIsOpen(false);
        handlers[featureKey]();
      }, 500);
    },
    [handlers]
  );

  return (
    <>
      {/* Particle burst */}
      {burstParticles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <span
            key={p.id}
            className="fixed z-[60] pointer-events-none text-xl"
            style={{
              left: p.x,
              top: p.y,
              animation: `navBurst 500ms ${p.delay}ms ease-out forwards`,
              ["--tx" as string]: `${tx}px`,
              ["--ty" as string]: `${ty}px`,
            }}
          >
            {p.emoji}
          </span>
        );
      })}

      <div ref={containerRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        {/* Radial glow behind petals */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none transition-all duration-500"
          style={{
            width: isOpen ? 300 : 0,
            height: isOpen ? 300 : 0,
            marginTop: isOpen ? 40 : 0,
            background: "radial-gradient(circle, hsla(330, 70%, 90%, 0.35) 0%, transparent 70%)",
            opacity: isOpen ? 1 : 0,
          }}
        />

        {/* Main button */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="relative z-10 h-14 w-14 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 border border-pink-300/50 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-400"
          style={{
            boxShadow: "0 4px 25px rgba(243, 184, 211, 0.5)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s",
          }}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span className="text-2xl" style={{ transition: "transform 0.4s", transform: isOpen ? "rotate(-45deg)" : "none" }}>🌷</span>
        </button>

        {/* Petals */}
        {petals.map((petal, i) => {
          const angleDeg = petalAngles[i];
          const angleRad = ((angleDeg + 90) * Math.PI) / 180; // +90 so 0deg = straight down
          const tx = Math.cos(angleRad) * RADIUS;
          const ty = Math.sin(angleRad) * RADIUS;
          const isLarge = petal.size === "large";
          const petalSize = isLarge ? 68 : 58;

          return (
            <button
              key={petal.key}
              onClick={(e) => handlePetalClick(e, petal.key, petal.particles)}
              className="absolute top-0 left-1/2 flex flex-col items-center justify-center group"
              style={{
                width: petalSize,
                height: petalSize,
                marginLeft: -petalSize / 2,
                marginTop: (56 - petalSize) / 2, // center with main button
                transform: isOpen
                  ? `translate(${tx}px, ${ty}px) scale(1)`
                  : `translate(0px, 0px) scale(0.3)`,
                opacity: isOpen ? 1 : 0,
                transition: `transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms, opacity 0.35s ease ${i * 60}ms`,
                pointerEvents: isOpen ? "auto" : "none",
                zIndex: 5,
              }}
              aria-label={petal.label}
            >
              {/* Petal image */}
              <img
                src="/images/petal.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-200 group-hover:scale-110"
                draggable={false}
              />
              {/* Emoji + Label */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
                <span className="text-lg leading-none drop-shadow-sm">{petal.emoji}</span>
                <span className="text-[8px] font-serif text-foreground/80 leading-tight mt-0.5 text-center max-w-[54px]">
                  {petal.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default NavMenuButton;
