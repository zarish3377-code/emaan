import { useState } from "react";
import { Heart } from "lucide-react";
import promiseImg from "@/assets/promise_img.png";

const comfortMessages = [
  "I'm not going anywhere",
  "You are safe with me",
  "You don't have to face things alone",
  "I choose you every day",
  "You can rest here",
  "I will stay",
  "Even on your hardest days",
  "You don't have to be perfect",
  "I'm here for every moment",
];

// Positions in a loose circle around center
const positions = [
  { top: "4%", left: "50%", transform: "translateX(-50%)" },
  { top: "12%", right: "6%" },
  { top: "35%", right: "2%" },
  { bottom: "30%", right: "4%" },
  { bottom: "10%", left: "50%", transform: "translateX(-50%)" },
  { bottom: "30%", left: "4%" },
  { top: "35%", left: "2%" },
  { top: "12%", left: "6%" },
  { top: "55%", right: "3%" },
];

interface PromiseDayViewProps {
  onBack: () => void;
}

const PromiseDayView = ({ onBack }: PromiseDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
      {/* Floating comfort messages */}
      <div className="absolute inset-0 pointer-events-none" style={{ width: "100vw", height: "100vh", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        {comfortMessages.map((msg, i) => (
          <span
            key={i}
            className={`absolute font-body text-xs sm:text-sm text-white/60 italic transition-opacity duration-1000 ${
              showLetter ? "opacity-20" : "opacity-70"
            }`}
            style={{
              ...positions[i],
              animation: `promiseFloat 4s ease-in-out ${i * 0.6}s infinite, promiseFadeIn 1.2s ease-out ${i * 0.35}s both`,
            }}
          >
            {msg}
          </span>
        ))}
      </div>

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 animate-fade-in z-10">
          {/* Central image */}
          <img
            src={promiseImg}
            alt="Promise Day — pinky promise tulips"
            className="w-56 sm:w-72 md:w-80 h-auto drop-shadow-2xl rounded-2xl"
            style={{
              animation: "promiseImageIn 1.2s ease-out both",
            }}
          />

          {/* Tap me button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "promiseFadeIn 1s ease-out 1.5s both" }}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{ animation: "promisePulseGlow 2.5s ease-in-out infinite", boxShadow: "0 0 25px rgba(251, 113, 133, 0.4)" }}>
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
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(244, 63, 94, 0.15)" }}
          >
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground">
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To love,
              </p>

              <p className="mb-4">
                Today is Promise Day, and I don't want to give you pretty promises that sound good for a moment and disappear later. I want to give you the ones that stay, hold weight, that you can come back to on your worst days and say, <span className="italic">"She said this, and she meant it."</span>
              </p>

              <p className="mb-4">
                So first, <span className="font-bold">I promise</span> to stay honest with you, even when it's uncomfortable, even when it would be easier to stay quiet. You deserve truth, not half-answers, not confusion, not guessing games. <span className="font-bold">I promise</span> to talk things through instead of letting distance grow. I know I lie many times when you ask me questions but today <span className="font-bold">I promise</span> to not lie.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> I will not disappear on you when things get hard. If we argue, if we misunderstand each other, if emotions run high, I will not use distance as punishment. I will not make you feel abandoned. We will sit with it, even if it's bad. Especially if it's messy.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to listen to you fully. Not to reply, not to defend myself, but to actually understand you. Your feelings will never be something I brush off. If something hurts you, it matters. If something makes you anxious, it matters. If something makes you happy, it matters even more.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to protect your heart the way I would protect my love. I will not play with it. I will not test it. I will not make you question where you stand with me. You will not have to compete for my attention or beg for reassurance. If you ever feel unsure, <span className="font-bold">I promise</span> to remind you clearly that you are chosen.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to support you in your growth. If you want to change something about your life, I will encourage you. If you have dreams that feel too big, I will not laugh at them or shrink them. I will stand next to you and help you believe you can reach them. I will never try to dim your light to make myself feel bigger.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to be patient with your bad days: the days when you overthink, the days when you feel insecure, the days when you don't feel like yourself. I will not get tired of reassuring you. I will not treat your vulnerability like a burden. If your mind is loud, I will stay calm for both of us.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to take responsibility when I'm wrong. I will not let pride destroy our beautiful love. If I hurt you, even unintentionally, I will own it and fix it. You deserve someone who can say, "I messed up," without turning it into your fault.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to keep choosing you. Not just in the beginning when everything feels exciting and new, but later too, when life gets busy, when routine settles in, when love becomes deeper. I will choose you daily in every moment no matter small or big.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to make you feel safe: safe to speak, safe to cry, safe to laugh too loud, safe to be serious, safe to be soft, safe to say, "I'm not okay." You should never feel like you have to hide parts of yourself to keep me.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to never make you feel replaceable. You are not temporary. You are not convenient. You are not just someone passing through my life. If I am with you, it is because I see myself for you. I may not be perfect but I will try; and <span className="font-bold">I promise</span> to treat you like someone I want long term, not like someone I'm testing out.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> to celebrate your wins like they are mine; to be proud of you openly; to tell you when you look good; to remind you when you doubt yourself; to hold your hand in public and in private; to make you feel wanted, not assumed.
              </p>

              <p className="mb-4">
                <span className="font-bold">I promise</span> that if you ever feel like the world is too much, you can come to me without fear. I will not judge your breakdowns. I will not call you dramatic. I will not minimize your pain. I will sit with you until you feel it breathable again.
              </p>

              <p className="mb-4">
                And <span className="font-bold">I promise</span> something that feels simple but actually big: <span className="font-bold">I promise</span> consistency. I will not be warm one day and cold the next. I will not make you chase affection. The love you see today is the love I intend to keep showing.
              </p>

              <p className="mb-4">
                This doesn't mean I'll be perfect. I won't be. I will have flaws. I will have moments where I need myself to shut up. But <span className="font-bold">I promise</span> effort, real effort. Not a temporary change. Not words without action. If something needs fixing, I will work on it.
              </p>

              <p className="mb-4">
                Most importantly, <span className="font-bold">I promise</span> that loving you is not something I take lightly. It's not casual to me. It's not entertainment. It's serious. It's intentional. It's something I hold with care because you are someone I hold with care.
              </p>

              <p className="mb-4">
                On this Promise Day, I won't promise fairy tales. I'm promising presence, communication, loyalty, patience, growth, softness, strength when you need it, honesty even when it's hard, and love that does not disappear when things aren't perfect.
              </p>

              <p className="mb-4">
                If one day you feel unsure, come back to me. Remember that someone chooses you clearly and promises you things with intention, not impulse.
              </p>

              <p className="mb-4">
                I'm here. And I intend to stay here.
              </p>

              <p className="mt-6 text-right font-display text-rose-500 font-bold">
                Always, Your Neno~ 🌷
              </p>
            </div>

            <button
              onClick={() => setShowLetter(false)}
              className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
            >
              ← back to promise
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromiseDayView;
