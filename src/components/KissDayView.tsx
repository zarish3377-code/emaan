import { useState } from "react";
import { Heart } from "lucide-react";
import kissDayImg from "@/assets/kiss_day.png";
import floatingTulip from "@/assets/floating_tulip.png";
import gardenDaisy from "@/assets/garden_daisy.png";

interface KissDayViewProps {
  onBack: () => void;
}

const floatingElements = [
  { src: "tulip", top: "8%", left: "5%", size: "w-7 sm:w-9", delay: 0 },
  { src: "daisy", top: "12%", right: "8%", size: "w-6 sm:w-8", delay: 0.6 },
  { src: "tulip", top: "25%", left: "2%", size: "w-5 sm:w-7", delay: 1.2 },
  { src: "daisy", top: "40%", right: "3%", size: "w-7 sm:w-9", delay: 0.3 },
  { src: "tulip", bottom: "30%", left: "4%", size: "w-6 sm:w-8", delay: 1.8 },
  { src: "daisy", bottom: "18%", right: "6%", size: "w-5 sm:w-7", delay: 1.5 },
  { src: "tulip", top: "55%", right: "2%", size: "w-6 sm:w-8", delay: 2.1 },
  { src: "daisy", bottom: "8%", left: "48%", size: "w-7 sm:w-9", delay: 0.9 },
];

const KissDayView = ({ onBack }: KissDayViewProps) => {
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
              showLetter ? "opacity-15" : "opacity-25"
            }`}
            style={{
              top: el.top,
              left: el.left,
              right: el.right,
              bottom: el.bottom,
              animation: `kissFloat 6s ease-in-out ${el.delay}s infinite, kissFadeIn 2s ease-out ${el.delay}s both`,
            }}
          />
        ))}
      </div>

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 z-10">
          {/* Central kiss day image */}
          <img
            src={kissDayImg}
            alt="Kiss Day — tender moment"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl rounded-2xl"
            style={{
              animation: "kissImageIn 2s ease-out both",
            }}
          />

          {/* Tap button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "kissFadeIn 1.2s ease-out 2.2s both" }}
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{
                  animation: "kissPulseGlow 3s ease-in-out infinite",
                  boxShadow: "0 0 25px rgba(251, 113, 133, 0.35)",
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
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground">
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">
                To Love,
              </p>

              <p className="mb-4">
                Do you remember when I kissed your cheek that day when we were making a video? I remember I was so careful. I don't know if you noticed, but I tried my best not to actually touch your cheek properly; I didn't press close, I kept a little space, because I didn't want it to feel wrong in any way, or make you to feel uncomfortable, or cross the line.
              </p>

              <p className="mb-4">
                That was maybe for the video, but behind it was just affection. I remember how I came back home so happy that you did let me, and I was thinking about your comfort—keeping it respectful—because what we have means more to me than any random action.
              </p>

              <p className="mb-4">
                And if I ever get the chance again, I wouldn't even think about your cheek. I'd give you a forehead kiss instead (only if you give permission, otherwise NEVER). The one that doesn't carry confusion. It feels protective. It says, "I care about you," without needing anything in return.
              </p>

              <p className="mb-4">
                A forehead kiss feels safe. I don't know why, but it feels like reassurance. Like telling someone you're proud of them. Like telling them they're precious without making it complicated. That's what I'd want it to mean. I've always been obsessed with forehead kisses.
              </p>

              <p className="mb-4">
                I don't ever want you to feel weird around me. I don't ever want our affection to feel heavy or awkward. What we have is built on trust and comfort, and I protect that more than anything. You matter too much to me to ever make you feel uneasy.
              </p>

              <p className="mb-4">
                If I ever get enough courage to speak in real life, I will tell you I'm grateful to have you and that I care about you very much.
              </p>

              <p className="mb-4">
                I love you for who you are, for how you think, for how you care, for how you stay. You are not just anyone in my life. You are my person. And that doesn't change easily—at least for me.
              </p>

              <p className="mb-4">
                I will never replace you. You are not someone I can swap out or move on from. You are not replaceable. You are not just "one of many." You are you, and you are the ONE, and that is rare to me. When I attach, I attach seriously. When I love, I love with intention. And I don't look around for alternatives when I already have my one who means this much.
              </p>

              <p className="mb-4">
                And I will always forgive you. No matter what small mistakes happen. No matter if we misunderstand each other. No matter if we get upset sometimes. I won't hold grudges over little things. I won't keep score. I won't make you feel like one mistake could cost you everything. You are more important to me than pride.
              </p>

              <p className="mb-4">
                We'll mess up sometimes. We'll say the wrong things sometimes. But my choice stays the same. I choose you. I choose to stay. I choose to work through things instead of walking away.
              </p>

              <p className="mb-4">
                You are safe with me. Safe in my heart. Safe in my loyalty. Safe in my forgiveness.
              </p>

              <p className="mb-4">
                And if I ever give you that forehead kiss one day, just know it carries all of that with it: love, reassurance, commitment, and the promise that I'm not going anywhere. (Wink)
              </p>

              <p className="mb-2">Always yours,</p>

              <p className="mt-4 text-right font-display text-rose-500 font-bold">
                Ur Neno~
              </p>
            </div>

            <button
              onClick={() => setShowLetter(false)}
              className="mt-4 mx-auto block text-xs text-muted-foreground hover:text-rose-400 transition-colors"
            >
              ← back to kiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KissDayView;
