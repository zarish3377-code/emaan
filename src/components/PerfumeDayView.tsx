import { useState } from "react";
import { Heart } from "lucide-react";
import perfumeDayImg from "@/assets/perfume_day.png";

interface PerfumeDayViewProps {
  onBack: () => void;
}

const PerfumeDayView = ({ onBack }: PerfumeDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
      {/* Floating mist particles */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          width: "100vw",
          height: "100vh",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${40 + (i % 4) * 25}px`,
              height: `${40 + (i % 4) * 25}px`,
              left: `${5 + (i * 7.2) % 88}%`,
              top: `${8 + (i * 11.3) % 78}%`,
              background: `radial-gradient(circle, rgba(251,207,232,${0.12 + (i % 3) * 0.04}) 0%, transparent 70%)`,
              animation: `perfumeMist ${8 + (i % 5) * 2}s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
      </div>

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 z-10">
          {/* Perfume day image — slow fade-in */}
          <img
            src={perfumeDayImg}
            alt="Perfume Day"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl rounded-2xl"
            style={{
              animation: "perfumeFadeIn 2s ease-out both",
            }}
          />

          {/* Tap button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "perfumeFadeIn 1.2s ease-out 2.4s both" }}
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{
                  animation: "perfumePulse 3s ease-in-out infinite",
                  boxShadow: "0 0 25px rgba(251, 207, 232, 0.4)",
                }}
              >
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-body whitespace-nowrap">
                tap me~
              </span>
            </div>
          </button>

          {/* Back button */}
          <button
            onClick={onBack}
            className="mt-4 text-xs text-white/40 hover:text-white/70 transition-colors font-body"
          >
            ← back
          </button>
        </div>
      ) : (
        /* Letter */
        <div className="animate-scale-in w-full max-h-[80vh] overflow-y-auto z-10 px-2">
          <div
            className="relative rounded-3xl bg-cream-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl mx-auto max-w-lg"
            style={{
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(244, 63, 94, 0.15)",
            }}
          >
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To Love,
              </p>

              <p className="mb-4">
                Shall I gift you perfume?<br />
                When you are the fragrance that has already marked my memory?
              </p>

              <p className="mb-4">
                Tell me, what bottle could I possibly choose that would compare to the scent of December 19 still living in my memory? About how my arms were shaking and I was trying so hard to act normal, but nothing about that moment felt normal to me. It felt overwhelming. What perfume could I wrap and hand to you when you are the one whose warmth lingers in my thoughts without even trying?
              </p>

              <p className="mb-4">
                And you were warm. Warm that felt grounding. Like I could finally stop imagining and just feel. I didn't want to move. I didn't want to pull away. I didn't want the air to come back between us.
              </p>

              <p className="mb-4">And your scent.</p>

              <p className="mb-4 italic">
                Ohh, to sacrifice everything just to feel it… again.
              </p>

              <p className="mb-4">
                I didn't even realize how much I was taking it in until later when I kept replaying the moment in my head. Now, every time I think about that hug, I can almost smell it again. It lingers in my memory so clearly that it feels unfair.
              </p>

              <p className="mb-4">
                So tell me, shall I gift you perfume?<br />
                When you are the only fragrance my mind returns to without trying. When I can be sitting somewhere random and suddenly feel like I'm back in that hug, my hands slightly trembling, that soft scent surrounding us, belongs to neither of us alone, but ours.
              </p>

              <p className="mb-4">
                What bottle could compete with that?<br />
                What brand could possibly mean more?
              </p>

              <p className="mb-4">
                Shall I give you flowers?<br />
                When you are the essence of every precious fragrance I could ever hold?
              </p>

              <p className="mb-4">
                Flowers fade. Their scent weakens. They dry out. But that hug hasn't faded. The way my heart was racing hasn't faded. The way I tried to steady my breathing so you wouldn't notice how overwhelmed I was—that hasn't faded either.
              </p>

              <p className="mb-4">
                You don't need perfume. You don't need flowers.<br />
                You are the scent that stays on my thoughts.<br />
                You are the warmth my body remembers.<br />
                You are the sweetness that makes time feel lighter.
              </p>

              <p className="mb-4">
                Sometimes I close my eyes and I can still feel the exact way my arms wrapped around you. I can still feel that small tremble in my hands. I can still feel how natural it felt, like my body already knew where it belonged.
              </p>

              <p className="mb-4">
                So how do I gift you something scented?<br />
                When you are the only scent I don't want to forget?
              </p>

              <p className="mb-4">
                How do I hand you flowers?<br />
                When being with you already feels like the sweetest part of my days?
              </p>

              <p className="mb-4">
                If anything, the only thing I want is another moment like that. Another hug where my hands shake again because it feels like too much to take, but enough to take at the same time. Another second where you quieten the noise in my head. Another breath of that soft scent that somehow feels like comfort.
              </p>

              <p className="mb-4">
                So shall I gift you perfume?<br />
                Or should I just hold you again and let the only fragrance that ever mattered stay between us?
              </p>

              <p className="mb-2">Always yours,</p>

              <p className="mt-4 text-right font-display text-rose-500 font-bold">
                Your Neno~
              </p>
            </div>

            <button
              onClick={() => setShowLetter(false)}
              className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
            >
              ← back to perfume
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes perfumeFadeIn {
          0% { opacity: 0; transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes perfumeMist {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          25% { transform: translate(8px, -12px) scale(1.1); opacity: 0.25; }
          50% { transform: translate(-5px, -20px) scale(1.15); opacity: 0.2; }
          75% { transform: translate(10px, -8px) scale(1.05); opacity: 0.18; }
        }
        @keyframes perfumePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(251,207,232,0.4); }
          50% { transform: scale(1.06); box-shadow: 0 0 35px rgba(251,207,232,0.55); }
        }
      `}</style>
    </div>
  );
};

export default PerfumeDayView;
