import { useState } from "react";
import { Heart } from "lucide-react";
import hugDayImg from "@/assets/hug_day.png";
import floatingTulip from "@/assets/floating_tulip.png";
import gardenDaisy from "@/assets/garden_daisy.png";

interface HugDayViewProps {
  onBack: () => void;
}

const floatingElements = [
  { src: "tulip", top: "5%", left: "8%", size: "w-8 sm:w-10", delay: 0 },
  { src: "daisy", top: "10%", right: "10%", size: "w-7 sm:w-9", delay: 0.8 },
  { src: "tulip", top: "30%", left: "3%", size: "w-6 sm:w-8", delay: 1.6 },
  { src: "daisy", top: "50%", right: "5%", size: "w-8 sm:w-10", delay: 0.4 },
  { src: "tulip", bottom: "25%", left: "6%", size: "w-7 sm:w-9", delay: 1.2 },
  { src: "daisy", bottom: "15%", right: "8%", size: "w-6 sm:w-8", delay: 2.0 },
  { src: "tulip", top: "18%", right: "3%", size: "w-5 sm:w-7", delay: 2.4 },
  { src: "daisy", bottom: "35%", left: "4%", size: "w-7 sm:w-9", delay: 1.8 },
  { src: "tulip", top: "65%", right: "4%", size: "w-6 sm:w-8", delay: 0.6 },
  { src: "daisy", bottom: "5%", left: "50%", size: "w-8 sm:w-10", delay: 1.4 },
];

const HugDayView = ({ onBack }: HugDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
      {/* Floating tulips & daisies */}
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
              showLetter ? "opacity-10" : "opacity-30"
            }`}
            style={{
              top: el.top,
              left: el.left,
              right: el.right,
              bottom: el.bottom,
              animation: `hugFloat 5s ease-in-out ${el.delay}s infinite, hugFadeIn 2s ease-out ${el.delay}s both`,
            }}
          />
        ))}
      </div>

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 z-10">
          {/* Central hug image */}
          <img
            src={hugDayImg}
            alt="Hug Day — warm embrace"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl rounded-2xl"
            style={{
              animation: "hugImageIn 2s ease-out both",
            }}
          />

          {/* Tap button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "hugFadeIn 1.2s ease-out 2.2s both" }}
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{
                  animation: "hugPulseGlow 3s ease-in-out infinite",
                  boxShadow: "0 0 25px rgba(251, 113, 133, 0.35)",
                }}
              >
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-body whitespace-nowrap">
                tap~
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
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground">
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To Love,
              </p>

              <p className="mb-4">
                I'm literally so annoyed at myself. I don't know how many times I wanted to hug you today, but I just couldn't. I maybe, I don't know, maybe I'm some coward. Ahhhh, and it frustrates me because when it comes to you, I don't want to hesitate. I don't want fear. I don't want second-guessing. I just want to love you freely and loudly and without holding back.
              </p>

              <p className="mb-4">
                But please don't mistake my silence for lack of feeling. If anything, it's the opposite. I feel too much. I care too much. Sometimes it overwhelms me, and instead of acting on it, I freeze. And that's on me, not on you. And I was just in my own head; I'm sorry for today's behavior.
              </p>

              <p className="mb-4">
                I wanted to hug you because I'm proud of you. Because I miss you even when you're right there. Because I love you. And maybe I get scared of how unreal that feels.
              </p>

              <p className="mb-4">
                Being around you makes me hyper-aware: of my hands, of my heartbeat, of the space between us. And instead of just closing that space, I overthink it. I think, "What if it's too much? What if it's the wrong moment? What if I make it awkward?" And by the time I finish thinking, the moment is gone. My hesitation and quietness are never a measure of my feelings. Sometimes my love is louder inside than I can process outside.
              </p>

              <p className="mb-4">
                I don't even know how to begin this without feeling emotional because when it comes to you, everything inside me feels bigger. You are the person who changed the way I understand love. Before you, I thought love was just a feeling, something sweet, something exciting. But with you, it became deeper. It became steady. It became something I wake up choosing every single day.
              </p>

              <p className="mb-4">
                You are the most precious person in my life. The way your presence alone can calm me down. The way your voice can shift my mood. The way your existence makes my life feel fuller. You don't even try to do these things; you just are who you are, and somehow that's enough to make everything better.
              </p>

              <p className="mb-4">
                I appreciate you more than I probably say. I appreciate the way you care. The way you listen. The way you stay patient even when I'm not at my best. I appreciate your softness and your strength at the same time. I appreciate the way you love me without making it feel conditional. You don't make me question where I stand. You stand beside me, which feels secure.
              </p>

              <p className="mb-4">
                You have no idea how much you mean to me. I can never put it into words, no matter how hard I try to. You have no idea how much I think about you randomly during the day. Sometimes I just pause and realize you're real, that you're mine, and it honestly overwhelms me in the best way.
              </p>

              <p className="mb-4">
                When I think about my future, I see you in it. Not as a "maybe" or a hope, but as someone I genuinely want there. I want to grow with you. I want to experience life with you. I want to face problems with you instead of running from them. I want to build something stable and safe with you.
              </p>

              <p className="mb-4">
                And your love, it feels like home. You make me want to be better, not because you demand it, but because loving you makes me want to show up as the best version of myself.
              </p>

              <p className="mb-4">
                Even when I get upset, even when we misunderstand each other, even when things aren't perfect, I never stop loving you. I never stop choosing you. There is no version of my life that will be okay without you in it.
              </p>

              <p className="mb-4">
                I want to be there for you. I want to support your dreams. I want to hold you when you're tired. I want to remind you of your worth when you forget it. I want to be someone you feel safe with, someone you don't have to pretend around. Someone who loves you fully, not in parts.
              </p>

              <p className="mb-4">
                You are not replaceable to me. You are not temporary. You are not "just someone." You are my person. My partner. My best friend. My love.
              </p>

              <p className="mb-4">
                If there's one thing I want you to truly understand, it's this: I am grateful so much, every single day. Grateful that you chose me. Grateful that you stay. Grateful that I get to love you and call you my love.
              </p>

              <p className="mb-4">
                My love for you is intentional and I won't go anywhere. With all my heart,
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
              ← back to hug
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HugDayView;
