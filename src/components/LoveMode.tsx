import { useState, useEffect, useCallback, useRef } from "react";

// ─── Messages ───────────────────────────────────────────
const gardenMessages = [
  "you are softer than you think",
  "someone notices every little thing about you",
  "you don't need to try so hard to be loved",
  "you are exactly enough, right now",
  "rest. you've earned it.",
];
const bedroomMessages: Record<string, string[]> = {
  lamp: ["you can rest now. the world will still be there."],
  pillow: ["you deserve softness."],
  window: ["someone is thinking of you right now."],
};
const kitchenMessages: Record<string, string[]> = {
  mug: ["drink water, please. your body asked nicely."],
  kettle: ["sit down. rest a little. I mean it."],
  plate: ["did you eat today? no judgment. just checking."],
};
const heartMessages = [
  "you are so loveable.",
  "your laugh is genuinely contagious.",
  "this world is better because you're in it.",
];
const starMessages = [
  "you're doing better than you think.",
  "a little bit of magic follows you around.",
];

// ─── Bubble ─────────────────────────────────────────────
const Bubble = ({ msg, x, y, onDone }: { msg: string; x: number; y: number; onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="lm-bubble"
      style={{ left: x, top: y }}
    >
      <p>{msg}</p>
    </div>
  );
};

// ─── Petal ───────────────────────────────────────────────
const petalColors = ["#F7C5D0", "#D4B8E0", "#B8D4C8"];
const Petal = ({ index }: { index: number }) => {
  const size = 8 + Math.random() * 10;
  const left = Math.random() * 100;
  const dur = 6 + Math.random() * 6;
  const delay = Math.random() * 6;
  const color = petalColors[index % 3];
  return (
    <div
      className="lm-petal"
      style={{
        left: `${left}%`,
        width: size,
        height: size * 1.4,
        backgroundColor: color,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// ─── Garden Room ─────────────────────────────────────────
const flowerColors = ["#F9C6D0", "#C9E8D4", "#D4C9E8", "#F9E0C6", "#C9D4E8"];
const GardenRoom = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => (
  <div className="lm-room lm-garden">
    <span className="lm-room-label">garden</span>
    {/* Butterflies */}
    <svg className="lm-butterfly lm-butterfly-1" width="20" height="14" viewBox="0 0 20 14"><ellipse cx="5" cy="7" rx="5" ry="6" fill="#D4C9E8" opacity=".7"/><ellipse cx="15" cy="7" rx="5" ry="6" fill="#F7C5D0" opacity=".7"/></svg>
    <svg className="lm-butterfly lm-butterfly-2" width="16" height="12" viewBox="0 0 16 12"><ellipse cx="4" cy="6" rx="4" ry="5" fill="#B8D4C8" opacity=".7"/><ellipse cx="12" cy="6" rx="4" ry="5" fill="#D4C9E8" opacity=".7"/></svg>
    {/* Flowers */}
    <div className="lm-flowers">
      {flowerColors.map((c, i) => (
        <button
          key={i}
          className="lm-flower"
          onClick={(e) => onBubble(gardenMessages[Math.floor(Math.random() * gardenMessages.length)], e)}
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <ellipse key={deg} cx="16" cy="6" rx="5" ry="6" fill={c} transform={`rotate(${deg} 16 16)`} opacity=".85"/>
            ))}
            <circle cx="16" cy="16" r="4" fill="#F9D56E"/>
          </svg>
        </button>
      ))}
    </div>
    {/* Grass */}
    <div className="lm-grass" />
  </div>
);

// ─── Bedroom Room ────────────────────────────────────────
const BedroomRoom = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => (
  <div className="lm-room lm-bedroom">
    <span className="lm-room-label">bedroom</span>
    {/* Window */}
    <button className="lm-window" onClick={(e) => onBubble(bedroomMessages.window[0], e)}>
      <div className="lm-window-sky">
        <div className="lm-star-dot" style={{ top: "20%", left: "25%" }} />
        <div className="lm-star-dot" style={{ top: "40%", left: "65%" }} />
        <div className="lm-star-dot" style={{ top: "60%", left: "40%" }} />
      </div>
      <div className="lm-window-cross-h" />
      <div className="lm-window-cross-v" />
      <div className="lm-curtain lm-curtain-l" />
      <div className="lm-curtain lm-curtain-r" />
    </button>
    {/* Lamp */}
    <button className="lm-lamp" onClick={(e) => onBubble(bedroomMessages.lamp[0], e)}>
      <div className="lm-lamp-glow" />
      <div className="lm-lamp-shade" />
      <div className="lm-lamp-base" />
    </button>
    {/* Bed */}
    <div className="lm-bed">
      <button className="lm-pillow" onClick={(e) => onBubble(bedroomMessages.pillow[0], e)} />
      <div className="lm-blanket" />
    </div>
  </div>
);

// ─── Kitchen Room ────────────────────────────────────────
const KitchenRoom = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => (
  <div className="lm-room lm-kitchen">
    <span className="lm-room-label">kitchen</span>
    <div className="lm-table">
      {/* Mug */}
      <button className="lm-mug" onClick={(e) => onBubble(kitchenMessages.mug[0], e)}>
        <div className="lm-mug-body" />
        <div className="lm-mug-handle" />
        <div className="lm-steam lm-steam-1" />
        <div className="lm-steam lm-steam-2" />
        <div className="lm-steam lm-steam-3" />
      </button>
      {/* Kettle */}
      <button className="lm-kettle" onClick={(e) => onBubble(kitchenMessages.kettle[0], e)}>
        <div className="lm-kettle-body" />
        <div className="lm-kettle-spout" />
      </button>
      {/* Plate */}
      <button className="lm-plate" onClick={(e) => onBubble(kitchenMessages.plate[0], e)} />
    </div>
  </div>
);

// ─── Play Corner ─────────────────────────────────────────
const PlayCorner = ({ onBubble }: { onBubble: (msg: string, e: React.MouseEvent) => void }) => (
  <div className="lm-room lm-play">
    <span className="lm-room-label">play corner</span>
    <div className="lm-play-items">
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={`h${i}`}
          className="lm-play-heart"
          style={{ animationDelay: `${i * 0.7}s`, left: `${15 + i * 16}%`, fontSize: `${14 + (i % 3) * 4}px` }}
          onClick={(e) => onBubble(heartMessages[Math.floor(Math.random() * heartMessages.length)], e)}
        >
          ♥
        </button>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <button
          key={`s${i}`}
          className="lm-play-star"
          style={{ animationDelay: `${i * 0.5}s`, left: `${10 + i * 22}%`, top: `${30 + (i % 2) * 30}%` }}
          onClick={(e) => onBubble(starMessages[Math.floor(Math.random() * starMessages.length)], e)}
        >
          ✦
        </button>
      ))}
      {/* Toy shapes */}
      <div className="lm-toy" style={{ left: "20%", top: "65%", width: 18, height: 18, borderRadius: "50%", background: "#F7C5D0" }} />
      <div className="lm-toy" style={{ left: "60%", top: "70%", width: 14, height: 14, borderRadius: 2, background: "#D4C9E8", transform: "rotate(45deg)" }} />
    </div>
  </div>
);

// ─── Easter Egg ──────────────────────────────────────────
const EasterEgg = () => {
  const [popped, setPopped] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setPopped(true);
    setTimeout(() => {
      setPopped(false);
      setShowModal(true);
    }, 600);
  };

  useEffect(() => {
    if (!showModal) return;
    const t = setTimeout(() => setShowModal(false), 6000);
    return () => clearTimeout(t);
  }, [showModal]);

  return (
    <>
      <button className={`lm-secret-star ${popped ? "lm-star-pop" : ""}`} onClick={handleClick}>✦</button>
      {showModal && (
        <div className="lm-secret-modal" onClick={() => setShowModal(false)}>
          <div className="lm-secret-content" onClick={(e) => e.stopPropagation()}>
            <p>you found the secret. i was hoping you would.</p>
            <span className="lm-secret-heart">♥</span>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Main LoveMode Component ─────────────────────────────
const LoveMode = () => {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState<{ msg: string; x: number; y: number } | null>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const bubbleKey = useRef(0);

  const handleToggle = useCallback(() => {
    if (!active) {
      setActive(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      setTimeout(() => setActive(false), 800);
    }
  }, [active]);

  const showBubble = useCallback((msg: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const houseRect = houseRef.current?.getBoundingClientRect();
    if (!houseRect) return;
    bubbleKey.current++;
    setBubble({
      msg,
      x: rect.left - houseRect.left + rect.width / 2,
      y: rect.top - houseRect.top - 10,
    });
    setTimeout(() => setBubble(null), 3200);
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <div className="lm-toggle-wrap">
        <button
          className={`lm-toggle ${active ? "lm-on" : ""}`}
          onClick={handleToggle}
          aria-label="Toggle Love Mode"
        >
          <span className="lm-icon-house">🏠</span>
          <span className="lm-thumb" />
          <span className="lm-icon-heart">❤️</span>
        </button>
        <span className="lm-tooltip">enter love mode</span>
      </div>

      {/* Overlay */}
      {active && (
        <div className={`lm-overlay ${visible ? "lm-visible" : "lm-hidden"}`}>
          {/* Petals */}
          <div className="lm-petals">
            {Array.from({ length: 14 }).map((_, i) => (
              <Petal key={i} index={i} />
            ))}
          </div>

          {/* House */}
          <div className={`lm-house ${visible ? "lm-house-in" : "lm-house-out"}`} ref={houseRef}>
            <EasterEgg />
            <GardenRoom onBubble={showBubble} />
            <div className="lm-mid-row">
              <PlayCorner onBubble={showBubble} />
              <BedroomRoom onBubble={showBubble} />
            </div>
            <KitchenRoom onBubble={showBubble} />
            {/* Bubble layer */}
            {bubble && (
              <Bubble key={bubbleKey.current} msg={bubble.msg} x={bubble.x} y={bubble.y} onDone={() => setBubble(null)} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoveMode;
