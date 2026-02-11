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
  { key: "neno", label: "Ur Neno", emoji: "🌼", gradient: "from-yellow-200 to-pink-200" },
  { key: "garden", label: "Secret Garden", emoji: "🌸", gradient: "from-green-200 to-pink-100" },
  { key: "newyear", label: "Happy New Year", emoji: "🎊", gradient: "from-amber-100 to-rose-200" },
  { key: "collection", label: "Collection", emoji: "🎵", gradient: "from-violet-200 to-purple-100" },
  { key: "valentine", label: "My Valentine", emoji: "💌", gradient: "from-rose-200 to-pink-300" },
  { key: "countdown", label: "Countdown", emoji: "💗", gradient: "from-pink-300 to-rose-400" },
  { key: "message", label: "Just Say It", emoji: "💬", gradient: "from-[#d98aa8] to-[#c76b8f]" },
];

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
  if (!isOpen) return null;

  const handlers: Record<string, () => void> = {
    neno: onOpenNeno,
    garden: onOpenGarden,
    newyear: onOpenNewYear,
    collection: onOpenCollection,
    valentine: onOpenValentine,
    countdown: onOpenCountdown,
    message: onOpenMessage,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

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
              onClick={() => onSelect(handlers[f.key])}
              className={`flex flex-col items-center gap-2 animate-scale-in`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300`}
              >
                <span className="text-2xl">{f.emoji}</span>
              </div>
              <span className="text-white/90 text-xs font-serif text-center leading-tight">
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
