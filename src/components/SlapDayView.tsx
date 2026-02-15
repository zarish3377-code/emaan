import { useState } from "react";
import { Heart, Zap } from "lucide-react";
import slapDayImg from "@/assets/slap_day.png";
import floatingTulip from "@/assets/floating_tulip.png";
import gardenDaisy from "@/assets/garden_daisy.png";

interface SlapDayViewProps {
  onBack: () => void;
}

const floatingElements = [
  { src: "tulip", top: "6%", left: "6%", size: "w-7 sm:w-9", delay: 0 },
  { src: "daisy", top: "14%", right: "7%", size: "w-6 sm:w-8", delay: 0.5 },
  { src: "tulip", top: "28%", left: "3%", size: "w-5 sm:w-7", delay: 1.0 },
  { src: "daisy", top: "45%", right: "4%", size: "w-7 sm:w-9", delay: 0.3 },
  { src: "tulip", bottom: "28%", left: "5%", size: "w-6 sm:w-8", delay: 1.6 },
  { src: "daisy", bottom: "15%", right: "7%", size: "w-5 sm:w-7", delay: 1.3 },
  { src: "tulip", top: "60%", right: "3%", size: "w-6 sm:w-8", delay: 2.0 },
  { src: "daisy", bottom: "6%", left: "45%", size: "w-7 sm:w-9", delay: 0.8 },
];

const SlapDayView = ({ onBack }: SlapDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
      {/* Keyframe animations */}
      <style>{`
        @keyframes slapPopIn {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          80% { transform: scale(0.98); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slapShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-3px) rotate(-1deg); }
          30% { transform: translateX(3px) rotate(1deg); }
          45% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
        }
        @keyframes slapFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes slapFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slapPulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
          50% { box-shadow: 0 0 35px rgba(251, 146, 60, 0.5); }
        }
      `}</style>

      {/* Floating elements */}
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
        {floatingElements.map((el, i) => (
          <img
            key={i}
            src={el.src === "tulip" ? floatingTulip : gardenDaisy}
            alt=""
            className={`absolute pointer-events-none ${el.size} transition-opacity duration-1000 ${
              showLetter ? "opacity-15" : "opacity-25"
            }`}
            style={{
              top: el.top,
              left: el.left,
              right: el.right,
              bottom: el.bottom,
              animation: `slapFloat 5s ease-in-out ${el.delay}s infinite, slapFadeIn 2s ease-out ${el.delay}s both`,
            }}
          />
        ))}
      </div>

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 z-10">
          {/* Slap Day image with pop + shake */}
          <img
            src={slapDayImg}
            alt="Slap Day — slapping away negativity!"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl rounded-2xl"
            style={{
              animation: "slapPopIn 0.6s ease-out both, slapShake 0.5s ease-in-out 0.6s both",
            }}
          />

          {/* Tap button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "slapFadeIn 1s ease-out 1.2s both" }}
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{
                  animation: "slapPulseGlow 3s ease-in-out infinite",
                  boxShadow: "0 0 25px rgba(251, 146, 60, 0.35)",
                }}
              >
                <Zap className="h-5 w-5 text-white fill-white" />
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
                "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(251, 146, 60, 0.15)",
            }}
          >
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground">
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To Love,
              </p>

              <p className="mb-4">
                Soooo, it's Slap Day!!!
              </p>

              <p className="mb-4">
                I stand in front of you, look you dead in the eyes, and say: Today, we're slapping out everything that hurts you.
              </p>

              <p className="mb-4">
                I want to slap away every doubt that ever made you question your worth. Every time you looked in the mirror and thought you weren't enough. Gone. <span className="italic">(Poooffff!)</span>
              </p>

              <p className="mb-4">
                I want to slap away every memory that still sneaks up on you at night, the ones that make you feel heavy, the ones that make you overthink, the ones that tell lies about you. They don't get to stay.
              </p>

              <p className="mb-4">
                I want to slap away the fear that you're too much. Too emotional. Too quiet. Too intense. Too soft. Too strong. Whatever "too" they tried to label you with, it's not yours anymore. Gone.
              </p>

              <p className="mb-4">
                I want to slap away the guilt you carry for things that were never your fault. The way you blame yourself for other people's decisions. The way you replay conversations in your head, thinking you could've done better. You don't deserve to live like that.
              </p>

              <p className="mb-4">
                I want to slap away every person who made you feel small. Every situation that made you shrink yourself. Every moment you felt like you had to earn love instead of just receiving it.
              </p>

              <p className="mb-4">
                I want to slap away the fear of being abandoned. The fear of being replaced. The fear of not being chosen. You deserve to be chosen without begging for it. You deserve consistency. You deserve peace.
              </p>

              <p className="mb-4">
                And while I'm at it, I'm slapping away the version of you that thinks you have to struggle alone. You don't <span className="font-bold">(YOU HEAR ME??!)</span>. You're not built to carry everything by yourself.
              </p>

              <p className="mb-4">
                Now.
              </p>

              <p className="mb-4">
                After I slap out all the bad, I'm keeping the good <span className="italic">(ehehe)</span>.
              </p>

              <p className="mb-4">
                Your kindness? Staying.<br />
                Your loyalty? Staying.<br />
                Your heart? Staying.<br />
                Your depth? Staying.<br />
                Your laugh? Definitely staying.<br />
                Your softness? Protected.<br />
                Your strength? Untouchable.<br />
                Your ability to love deeply? That stays. Because that's mine. That's what the world tried to harden but couldn't.
              </p>

              <p className="mb-4">
                Today is about clearing space, choosing better emotions, and deciding that the only things allowed to stay around you are peace, respect, growth, and people who genuinely care.
              </p>

              <p className="mb-4">
                If it's not healthy for you, it's getting slapped out. If it doesn't bring you peace, it's getting slapped out. If it makes you question your value, it's getting slapped out.
              </p>

              <p className="mb-4">
                Only good emotions are allowed.<br />
                Only safe people are allowed.<br />
                Only real love is allowed.<br />
                Only happiness that doesn't hurt allowed.
              </p>

              <p className="mb-4">
                This is Anti-Valentine.
              </p>

              <p className="mb-4">
                And if you don't cooperate, who knows, you might get some slippers too.
              </p>

              <p className="mb-4">
                So from today, we're not romanticizing pain anymore. We're not chasing people who don't chase back. We're not holding onto things that drain us. We are choosing better.
              </p>

              <p className="mb-4">
                And if I have to kick every negative emotion out of your empty head one by one, I will. Because you deserve a heart that feels light. You deserve days that don't feel heavy. You deserve love that doesn't confuse you.
              </p>

              <p className="mb-4">
                And I will always protect you.
              </p>

              <p className="mb-2">Always yours,</p>

              <p className="mt-4 text-right font-display text-rose-500 font-bold">
                Ur Neno~ 🌷
              </p>
            </div>

            <button
              onClick={() => setShowLetter(false)}
              className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
            >
              ← back to slap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlapDayView;
