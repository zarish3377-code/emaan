import { useState, useEffect, useRef } from "react";
import { X, Heart } from "lucide-react";
import teddyImg from "@/assets/teddy.png";
import floatingBunny from "@/assets/floating_bunny.png";
import valentineDayImg from "@/assets/valentine_day.png";
import PromiseDayView from "./PromiseDayView";
import HugDayView from "./HugDayView";
import KissDayView from "./KissDayView";
import SlapDayView from "./SlapDayView";
import ValentineDayView from "./ValentineDayView";

interface ValentinePanelProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundAudioRef?: React.RefObject<HTMLAudioElement>;
}

const ValentinePanel = ({ isOpen, onClose, backgroundAudioRef }: ValentinePanelProps) => {
  const [showTeddy, setShowTeddy] = useState(false);
  const [teddyAnimated, setTeddyAnimated] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showPromise, setShowPromise] = useState(false);
  const [showHug, setShowHug] = useState(false);
  const [showKiss, setShowKiss] = useState(false);
  const [showSlap, setShowSlap] = useState(false);
  const [showValentineDay, setShowValentineDay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio: play on open, stop on close; pause/resume background music
  useEffect(() => {
    if (isOpen) {
      // Pause background music
      if (backgroundAudioRef?.current) {
        backgroundAudioRef.current.pause();
      }

      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/valentine_bgm.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0;
      }
      const audio = audioRef.current;
      audio.play().catch(() => {});
      // Fade in volume
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.02, 0.35);
        audio.volume = vol;
        if (vol >= 0.35) clearInterval(fadeIn);
      }, 80);
      return () => clearInterval(fadeIn);
    } else {
      if (audioRef.current) {
        const audio = audioRef.current;
        // Fade out
        let vol = audio.volume;
        const fadeOut = setInterval(() => {
          vol = Math.max(vol - 0.03, 0);
          audio.volume = vol;
          if (vol <= 0) {
            clearInterval(fadeOut);
            audio.pause();
            audio.currentTime = 0;
          }
        }, 60);
      }

      // Resume background music
      if (backgroundAudioRef?.current && backgroundAudioRef.current.paused) {
        let vol = 0;
        backgroundAudioRef.current.play().catch(() => {});
        const fadeIn = setInterval(() => {
          vol = Math.min(vol + 0.01, 0.25);
          if (backgroundAudioRef.current) {
            backgroundAudioRef.current.volume = vol;
          }
          if (vol >= 0.25) clearInterval(fadeIn);
        }, 120);
      }
    }
  }, [isOpen, backgroundAudioRef]);

  const handleTeddyDay = () => {
    setShowTeddy(true);
    setTimeout(() => setTeddyAnimated(true), 50);
  };

  const handleClose = () => {
    setShowTeddy(false);
    setTeddyAnimated(false);
    setShowLetter(false);
    setShowPromise(false);
    setShowHug(false);
    setShowKiss(false);
    setShowSlap(false);
    setShowValentineDay(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-pink-900/60 to-rose-950/70 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-300/20 fill-pink-300/10 animate-pulse"
            style={{
              left: `${8 + (i * 7.5) % 85}%`,
              top: `${10 + (i * 13) % 75}%`,
              width: `${16 + (i % 4) * 6}px`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center gap-6 px-4 ${showValentineDay ? 'max-w-none w-full h-full' : 'max-w-md w-full'}`}>
        {showValentineDay ? (
          <ValentineDayView onBack={() => setShowValentineDay(false)} image={valentineDayImg} />
        ) : showSlap ? (
          <SlapDayView onBack={() => setShowSlap(false)} />
        ) : showKiss ? (
          <KissDayView onBack={() => setShowKiss(false)} />
        ) : showHug ? (
          <HugDayView onBack={() => setShowHug(false)} />
        ) : showPromise ? (
          <PromiseDayView onBack={() => setShowPromise(false)} />
        ) : !showTeddy ? (
          /* Day Selection — petal layout with Valentine center */
          <div className="animate-scale-in flex flex-col items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-display text-white/90 text-center tracking-wide">
              My Valentine 🌹
            </h2>
            <p className="text-white/60 text-sm text-center font-body mb-2">
              a little something waiting for you...
            </p>

            {/* Petal layout container — expanded for 6 items */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Center: Valentine button — larger, glowing */}
              <button
                onClick={() => setShowValentineDay(true)}
                className="absolute z-10 px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-display text-lg shadow-2xl hover:scale-110 transition-all duration-500"
                style={{
                  animation: "valBreath 3s ease-in-out infinite",
                  boxShadow: "0 8px 40px rgba(244, 63, 94, 0.6), 0 0 80px rgba(251, 113, 133, 0.3)",
                }}
              >
                💝 Valentine
              </button>

              {/* Top */}
              <button
                onClick={handleTeddyDay}
                className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-display text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ boxShadow: "0 6px 24px rgba(244, 63, 94, 0.4)" }}
              >
                🧸 Teddy Day
              </button>
              {/* Top-Right */}
              <button
                onClick={() => setShowPromise(true)}
                className="absolute top-[15%] right-0 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-300 to-rose-400 text-white font-display text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ boxShadow: "0 6px 24px rgba(251, 191, 36, 0.35)" }}
              >
                🤙🏻 Promise
              </button>
              {/* Bottom-Right */}
              <button
                onClick={() => setShowHug(true)}
                className="absolute bottom-[15%] right-0 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-300 to-rose-400 text-white font-display text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ boxShadow: "0 6px 24px rgba(236, 72, 153, 0.35)" }}
              >
                🤗 Hug Day
              </button>
              {/* Bottom */}
              <button
                onClick={() => setShowSlap(true)}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-300 to-rose-400 text-white font-display text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ boxShadow: "0 6px 24px rgba(251, 146, 60, 0.35)" }}
              >
                👋 Slap Day
              </button>
              {/* Bottom-Left */}
              <button
                onClick={() => setShowKiss(true)}
                className="absolute bottom-[15%] left-0 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-300 to-pink-400 text-white font-display text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ boxShadow: "0 6px 24px rgba(244, 171, 188, 0.35)" }}
              >
                💋 Kiss Day
              </button>
            </div>
          </div>
        ) : !showLetter ? (
          /* Teddy with floating bunnies and letter button */
          <div className="flex flex-col items-center gap-4 relative">
            {/* Floating bunnies */}
            <div className="absolute inset-0 pointer-events-none" style={{ width: '100vw', height: '100vh', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              {Array.from({ length: 18 }).map((_, i) => {
                const cols = 6;
                const row = Math.floor(i / cols);
                const col = i % cols;
                const offsetX = row % 2 === 1 ? 8 : 0;
                const left = col * 16 + offsetX - 2;
                const bottomStart = -(row * 35) - 10;
                return (
                  <img
                    key={i}
                    src={floatingBunny}
                    alt=""
                    className="absolute pointer-events-none w-[120px] sm:w-[200px] md:w-[350px] lg:w-[500px]"
                    style={{
                      left: `${left}%`,
                      bottom: `${bottomStart}%`,
                      opacity: 0.22 + (i % 3) * 0.06,
                      animation: `floatBunnyUp ${10 + (i % 4) * 3}s linear ${i * 0.8}s infinite`,
                    }}
                  />
                );
              })}
            </div>

            <div
              className={`relative transition-all duration-1000 ease-out ${
                teddyAnimated
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-75 translate-y-8"
              }`}
            >
              <img
                src={teddyImg}
                alt="Teddy bear with tulips"
                className="w-64 md:w-80 h-auto drop-shadow-2xl"
              />
              {/* Letter button on the teddy */}
              <button
                onClick={() => setShowLetter(true)}
                className={`absolute bottom-[38%] left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 ${
                  teddyAnimated ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              >
                <div className="relative group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-pulse">
                    <Heart className="h-5 w-5 text-white fill-white" />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-body whitespace-nowrap">
                    tap me~
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Letter */
          <div className="animate-scale-in w-full max-h-[80vh] overflow-y-auto">
            <div
              className="relative rounded-3xl bg-cream-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl mx-auto max-w-lg"
              style={{
                boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(244, 63, 94, 0.15)",
              }}
            >
              <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground">
                <p className="mb-5 text-center font-display text-lg text-rose-500">
                  To love,
                </p>

                <p className="mb-4">
                  I don't know how to make this sound perfect, and I don't even want to.
                </p>

                <p className="mb-4">
                  You matter to me more than you probably let yourself believe, and that doesn't disappear when things get quiet, messy, or hard.
                </p>

                <p className="mb-4">
                  I love you for who you are, not for what you give, not for how strong you are, and not for how well you hold yourself together. Even on the days you feel unsure, even when you don't know what to say, and even when you think you're too much or not enough at the same time, none of that makes you harder to love. It makes you real and mine, and I love you even more for that. 🌷
                </p>

                <p className="mb-4">
                  You don't have to earn my care. You don't have to explain yourself perfectly. You don't have to hide the parts of you that feel tired, scared, or fragile. I'm not here only for the easy moments; I'm here for the heavy ones too, where you just need someone to stay without fixing anything.
                </p>

                <p className="mb-4">
                  If you ever feel like the world is pressing in on you, I want you to remember this <span className="italic">(in your empty skull)</span>: you are not alone. You don't have to carry everything by yourself. You can lean here. You can rest here. You can be soft here without feeling guilty about it. 🌷
                </p>

                <p className="mb-4">
                  Loving you doesn't feel confusing to me; it feels unconditional. It feels right. It feels like something I want to keep choosing, and I hope you know clearly that you are loved, and that love isn't going anywhere.
                </p>

                <p className="mt-6 text-right font-display text-rose-500">
                  Always, Your Neno~ 🌷
                </p>
              </div>

              {/* Back to teddy */}
              <button
                onClick={() => setShowLetter(false)}
                className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
              >
                ← back to teddy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValentinePanel;
