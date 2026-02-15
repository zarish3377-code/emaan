import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import kickDayImg from "@/assets/kick_day.png";
import floatingTulip from "@/assets/floating_tulip.png";
import gardenDaisy from "@/assets/garden_daisy.png";

interface KickDayViewProps {
  onBack: () => void;
}

const negativeWords = ["doubt", "distance", "fear", "overthinking", "insecurity"];

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

const KickDayView = ({ onBack }: KickDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);
  const [wordsVisible, setWordsVisible] = useState(true);
  const [imageLanded, setImageLanded] = useState(false);

  useEffect(() => {
    // Image lands after 0.7s, then words scatter at 1.5s
    const landTimer = setTimeout(() => setImageLanded(true), 700);
    const scatterTimer = setTimeout(() => setWordsVisible(false), 2000);
    return () => {
      clearTimeout(landTimer);
      clearTimeout(scatterTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
      <style>{`
        @keyframes kickSlideIn {
          0% { transform: translateY(120%) scale(0.8); opacity: 0; }
          60% { transform: translateY(-8%) scale(1.03); opacity: 1; }
          80% { transform: translateY(3%) scale(0.99); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes kickVibrate {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px); }
          20% { transform: translateX(2px); }
          30% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          50% { transform: translateX(-1px); }
          60% { transform: translateX(1px); }
        }
        @keyframes kickFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes kickFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kickPulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 35px rgba(168, 85, 247, 0.5); }
        }
        @keyframes wordFloat {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          30% { opacity: 0.6; transform: translateY(0) scale(1); }
          100% { opacity: 0.6; transform: translateY(0) scale(1); }
        }
        @keyframes wordScatter {
          0% { opacity: 0.6; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.3) rotate(15deg); }
        }
      `}</style>

      {/* Floating decorations */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100vw", height: "100vh", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        {floatingElements.map((el, i) => (
          <img
            key={i}
            src={el.src === "tulip" ? floatingTulip : gardenDaisy}
            alt=""
            className={`absolute pointer-events-none ${el.size} transition-opacity duration-1000 ${showLetter ? "opacity-15" : "opacity-25"}`}
            style={{
              top: el.top, left: el.left, right: el.right, bottom: el.bottom,
              animation: `kickFloat 5s ease-in-out ${el.delay}s infinite, kickFadeIn 2s ease-out ${el.delay}s both`,
            }}
          />
        ))}
      </div>

      {/* Floating negative words */}
      {!showLetter && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {negativeWords.map((word, i) => {
            const positions = [
              { top: "18%", left: "12%" },
              { top: "25%", right: "10%" },
              { top: "55%", left: "8%" },
              { top: "62%", right: "12%" },
              { top: "40%", left: "75%" },
            ];
            return (
              <span
                key={word}
                className="absolute text-white/60 font-display text-sm sm:text-base italic"
                style={{
                  ...positions[i],
                  animation: wordsVisible
                    ? `wordFloat 0.8s ease-out ${0.3 + i * 0.2}s both`
                    : `wordScatter 0.6s ease-in ${i * 0.1}s forwards`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 z-10">
          {/* Kick Day image with slide-in + vibrate */}
          <img
            src={kickDayImg}
            alt="Kick Day — kicking away negativity!"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl rounded-2xl"
            style={{
              animation: "kickSlideIn 0.7s ease-out both, kickVibrate 0.3s ease-in-out 0.7s both",
            }}
          />

          {/* Tap button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "kickFadeIn 1s ease-out 1.2s both" }}
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-rose-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{ animation: "kickPulseGlow 3s ease-in-out infinite" }}
              >
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-body whitespace-nowrap">
                tap me~
              </span>
            </div>
          </button>

          <button onClick={onBack} className="mt-4 text-xs text-white/40 hover:text-white/70 transition-colors font-body">
            ← back
          </button>
        </div>
      ) : (
        /* Letter */
        <div className="animate-scale-in w-full max-h-[80vh] overflow-y-auto z-10 px-2">
          <div
            className="relative rounded-3xl bg-cream-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl mx-auto max-w-lg"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(168, 85, 247, 0.15)" }}
          >
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground">
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To Love,
              </p>

              <p className="mb-4">
                Ahmm… It's Kick Day, but let's be honest. I can't kick you obviously <span className="italic">(or should I?)</span>.
              </p>

              <p className="mb-4">
                If I could, the first thing I'd kick away is that habit you have of saying "I'm fine" when you're not. I don't want you carrying things alone just because you're used to it. You don't have to be strong all the time with me. You don't have to act okay so I don't worry. I would rather sit with your sadness than watch you hide it.
              </p>

              <p className="mb-4">
                I want to kick away the weight of your past. Not erase it, because it shaped you; even if it was ugly, you didn't let it fade your inner beauty, you still kept it. But I'd remove the part that still hurts you, that made you think you're hard to love, made you feel like you were too much or not enough at the same time. The people who didn't know how to hold your heart properly don't get to define how you see yourself.
              </p>

              <p className="mb-4">
                I want to kick away every thought that tells you you're replaceable. You're not. You never were. There isn't a backup version of you in this world. There isn't another heart that loves like yours or a soul that feels like yours. And there isn't anyone I'm keeping as an "option." I chose you. Seriously.
              </p>

              <p className="mb-4">
                I want to kick away your overthinking. I know you say you don't overthink, but you do keep replaying moments trying to connect dots, and yes, it is overthinking. It's not always just getting overwhelmed; to tell, it's overthinking. I want to remove those "What if I mess this up?" thoughts. "What if I'm not enough?" You are enough. You have always been enough. You don't need to compete, compare, or prove anything to stay loved.
              </p>

              <p className="mb-4">
                I want to kick away the silence you hide in when something hurts. Don't swallow your feelings just because you're scared of being a burden. Talk to me. Even if it's messy. Even if you don't have the right words. Even if all you can say is "I don't know what's wrong."
              </p>

              <p className="mb-4">
                I want to kick away the loneliness that still follows you sometimes. You're not alone anymore. Even if we're miles apart. Even if we're not physically next to each other. You have me. And I mean that.
              </p>

              <p className="mb-4">
                And I think the biggest thing I want to kick away is hesitation. That frozen feeling. The fear of leaning in too much. The fear of caring too openly. I don't want us holding back because we're scared of losing something that is ours to have. Let's just choose each other without flinching.
              </p>

              <p className="mb-4">
                If life tries to pull you under, I'll be there kicking at the surface so you can breathe. If something tries to make you doubt yourself, I'll be there reminding you who you are. If old memories try to sneak back in and convince you you're unlovable, I'll be there proving otherwise with consistency, not just words.
              </p>

              <p className="mb-4">
                With me:<br />
                Your heart is safe.<br />
                You are safe.
              </p>

              <p className="mb-4">
                So today, I'm kicking out anything that makes you feel small. And I'm keeping everything that makes you feel safe, wanted, and chosen. You don't have to fight alone anymore. And also, if you don't feel like fighting at all, I will fight for you.
              </p>

              <p className="mb-4">
                And I'm not going anywhere.
              </p>

              <p className="mb-2">Always yours,</p>

              <p className="mt-4 text-right font-display text-rose-500 font-bold">
                Your Neno~ 🌷
              </p>
            </div>

            <button
              onClick={() => setShowLetter(false)}
              className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
            >
              ← back to kick
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KickDayView;
