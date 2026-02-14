import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import floatingTulip from "@/assets/floating_tulip.png";
import gardenDaisy from "@/assets/garden_daisy.png";

interface ValentineDayViewProps {
  onBack: () => void;
  image: string;
}

// Generate many floating flowers for the "uncountable" effect
const generateFlowers = (count: number) => {
  const flowers: {
    src: "tulip" | "daisy";
    left: string;
    delay: number;
    duration: number;
    size: string;
    opacity: number;
  }[] = [];
  for (let i = 0; i < count; i++) {
    flowers.push({
      src: i % 2 === 0 ? "tulip" : "daisy",
      left: `${Math.random() * 96 + 2}%`,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 8,
      size: `w-${5 + Math.floor(Math.random() * 5)} sm:w-${7 + Math.floor(Math.random() * 5)}`,
      opacity: 0.12 + Math.random() * 0.18,
    });
  }
  return flowers;
};

const flowers = generateFlowers(40);

const ValentineDayView = ({ onBack, image }: ValentineDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);
  const [showTapButton, setShowTapButton] = useState(false);
  const [answered, setAnswered] = useState<"yes" | "no" | null>(null);
  const [flowersIntense, setFlowersIntense] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTapButton(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    setAnswered("yes");
    setFlowersIntense(true);
    setTimeout(() => {
      window.open("https://www.rosify.org/rose/28022mcv9", "_blank");
    }, 1500);
  };

  const handleNo = () => {
    setAnswered("no");
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Floating flowers — many, dreamy */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {flowers.map((fl, i) => (
          <img
            key={i}
            src={fl.src === "tulip" ? floatingTulip : gardenDaisy}
            alt=""
            className={`absolute pointer-events-none w-6 sm:w-8 md:w-10`}
            style={{
              left: fl.left,
              bottom: "-10%",
              opacity: flowersIntense ? Math.min(fl.opacity + 0.12, 0.4) : fl.opacity,
              animation: `valFloat ${fl.duration}s ease-in-out ${fl.delay}s infinite`,
              transition: "opacity 1.5s ease",
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Sad emoji / rejection screen */}
      {answered === "no" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ animation: "kissFadeIn 1s ease-out both" }}>
          <span className="text-8xl md:text-9xl mb-6">😢</span>
          <p className="text-white/80 text-xl md:text-2xl font-display text-center">
            I'll try harder next time
          </p>
          <button
            onClick={onBack}
            className="mt-8 text-sm text-white/40 hover:text-white/70 transition-colors font-body"
          >
            ← back
          </button>
        </div>
      )}

      {/* Yes celebration redirect */}
      {answered === "yes" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ animation: "kissFadeIn 1s ease-out both" }}>
          <span className="text-8xl md:text-9xl mb-4" style={{ animation: "kissPulseGlow 1.5s ease-in-out infinite" }}>💖</span>
          <p className="text-white/90 text-xl md:text-2xl font-display text-center">
            You made me the happiest...
          </p>
        </div>
      )}

      {answered === null && !showLetter && (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center">
          {/* Central Valentine image — full screen */}
          <img
            src={image}
            alt="Valentine — for you"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ animation: "valImageIn 1s ease-out both" }}
          />

          {/* Tap button — centered over image */}
          {showTapButton && (
            <button
              onClick={() => setShowLetter(true)}
              className="relative z-10 mt-auto mb-24 group"
              style={{ animation: "kissFadeIn 1s ease-out both" }}
            >
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                  style={{
                    animation: "valBreath 3s ease-in-out infinite",
                    boxShadow: "0 0 30px rgba(251, 113, 133, 0.45)",
                  }}
                >
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-body whitespace-nowrap">
                  tap me~
                </span>
              </div>
            </button>
          )}

          {/* Back */}
          <button
            onClick={onBack}
            className="relative z-10 mb-6 text-xs text-white/40 hover:text-white/70 transition-colors font-body"
          >
            ← back
          </button>
        </div>
      )}

      {answered === null && showLetter && (
        <div className="fixed inset-0 z-10 flex items-center justify-center animate-scale-in px-4 py-6 overflow-y-auto">
          <div
            className="relative rounded-3xl bg-cream-white/95 backdrop-blur-sm p-6 md:p-10 shadow-2xl mx-auto max-w-lg"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(244, 63, 94, 0.15)",
            }}
          >
            <div className="font-serif text-[15px] md:text-base leading-[1.9] text-foreground">
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To Love,
              </p>

              <p className="mb-4">
                It was always you. Why can't I go to where you are?
              </p>
              <p className="mb-4">
                I love you because something in me recognized something in you before I even understood what was happening. And I keep asking, why can't I just go to where you are? Why does loving you feel like standing at the edge of something beautiful but not being able to step fully into it? Why does distance exist at all when my heart clearly doesn't respect it?
              </p>
              <p className="mb-4">
                I loved you from afar. Do you understand how difficult that is? To love someone without knowing the small details most people build love on. I didn't know your scent. I didn't know how your hand feels when it wraps around someone else's. I didn't know the exact warmth of your embrace. I didn't know the way your heartbeat sounds when everything is quiet.
              </p>
              <p className="mb-4">And still, I loved you.</p>
              <p className="mb-4">
                I loved you without access, without guarantees, without physical proof. I loved you with imagination and faith and stubborn devotion, because that was all I was allowed to do.
              </p>
              <p className="mb-4">
                Sometimes I have to sit with this question and it genuinely hurts: Did my love ever make your pain lighter? When you cried at night, when you felt alone, when your past was heavy on your shoulders… did my love ever reach you in those moments? Did it ever feel like a hand on your back? Or was I just loving you loudly in my own chest while you were silently breaking somewhere else?
              </p>
              <p className="mb-4">Was I not enough for you to stay?</p>
              <p className="mb-4">
                That thought comes from confusion and ache, because I loved you wholeheartedly. I respected you. I admired you. I wanted your growth. I wanted your healing. I wanted your future to be softer than your past. I didn't love you for what you gave me. I loved you for who you are.
              </p>
              <p className="mb-4">
                You became part of my daily life without even being there physically. Every empty seat beside me automatically belongs to you in my mind. I catch myself turning slightly as if you're there. I hear something funny and instinctively think of telling you. I sit in silence and it feels incomplete without your thought.
              </p>
              <p className="mb-4">
                I miss you always. It sits in my chest. It makes breathing feel heavier some days. It just lingers.
              </p>
              <p className="mb-4">
                I saw this on TT: Born too late to see dinosaurs, too early to see flying cars, but exactly in time to meet you. And I don't know whether to feel lucky or cursed about that. Lucky because I got to know someone like you. Cursed because knowing you live in the same place as me, living with the constant awareness of how deeply you matter to me, and still being so far.
              </p>
              <p className="mb-4">
                No one could ever replace you. And I don't say that avein hi. You are not interchangeable. You are not someone I can distract myself from with someone else. You are not "just another love." You are the only person in this world I want to love in this way.
              </p>
              <p className="mb-4">
                Even if we're not together, even if life complicates everything, even if circumstances stretch us thin, my heart doesn't search for alternatives. It doesn't want to.
              </p>
              <p className="mb-4">
                You are everything I ever wanted. You challenge me. You calm me. You make me want to be better. You make my life feel fuller. When you are present, I want to stay alive so I could have another moment with you.
              </p>
              <p className="mb-4">
                And if one day my life is ending, if I'm old and tired and my eyes are closing for the last time, I know you will cross my mind (Cross? Why would you cross my mind? When you never left it in first place).
              </p>
              <p className="mb-4">
                You deserve to be loved so deeply that doubt never touches you. You should never have to question if you matter. You should never sit there wondering if someone truly cares. You deserve a love that is clear, steady, consistent. A love that stands firm.
              </p>
              <p className="mb-4">
                And I need you to understand it and put it in your empty ahh skull:
              </p>
              <p className="mb-4">
                I care about your problems. I care about your health. I care about your goals. I care about how your day went. I care about your voice when it sounds tired. I care about your random thoughts. I care about your calls. I care about your messages. I care about your silence. I care about what upsets you. I care about what makes you smile. I care about the parts of you you think are too much. I care about all of it. I care about you.
              </p>
              <p className="mb-4">
                I want to make you the happiest you've ever been. Not for my ego or to prove something, but because seeing you genuinely okay means everything to me. I want you to feel safe. I want you to feel loved so that makes your shoulders relax. I want you to know that when you are not okay, you don't have to pretend with me.
              </p>
              <p className="mb-4">
                If your eyes are filled with tears, I will stay. I will sit with you. I will hold you until your breathing steadies. I won't rush you to feel better. I won't make you feel dramatic. I won't disappear when things get heavy.
              </p>
              <p className="mb-4">
                I love you at your strongest. I love you at your weakest. I love you when you're confident. I love you when you're doubting yourself.
              </p>
              <p className="mb-4">Nothing about you makes me want to leave.</p>
              <p className="mb-4">
                You are my safe place. My HOME. The feeling that no matter how chaotic the world gets, there is one person my heart recognizes as its anchor: YOU.
              </p>
              <p className="mb-4">
                When I say I would do anything for you, I mean it responsibly and seriously. I would choose you every day. I would fight for us. I would communicate. I would grow. I would stay when it's easier to walk away.
              </p>
              <p className="mb-4">
                Everything is going to be okay. We are going to be okay. As long as we keep choosing each other, we build it so that it doesn't fall apart easily.
              </p>
              <p className="mb-6 text-center font-display text-lg text-rose-500">
                So I'm asking you with everything in me (OHHH LORDD HELP ME),
              </p>
              <p className="mb-6 text-center font-display text-2xl text-rose-600 font-bold">
                Will you be my Valentine?
              </p>
              <p className="mb-4 text-center text-sm text-muted-foreground italic">(Consider me dead)</p>

              {/* Yes / No buttons */}
              <div className="flex justify-center gap-6 mb-6">
                <button
                  onClick={handleYes}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-display text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
                  style={{ boxShadow: "0 8px 32px rgba(244, 63, 94, 0.5)" }}
                >
                  Yes 💖
                </button>
                <button
                  onClick={handleNo}
                  className="px-8 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-foreground/70 font-display text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 border border-rose-200/30"
                >
                  No
                </button>
              </div>

              <p className="mb-2">Always yours,</p>
              <p className="mt-4 text-right font-display text-rose-500 font-bold text-lg">
                Your Neno~
              </p>
            </div>

            <button
              onClick={() => setShowLetter(false)}
              className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
            >
              ← back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValentineDayView;
