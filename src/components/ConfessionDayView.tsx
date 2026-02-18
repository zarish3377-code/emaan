import { useState } from "react";
import { Heart } from "lucide-react";
import confessionDayImg from "@/assets/confession_day.png";

interface ConfessionDayViewProps {
  onBack: () => void;
}

const ConfessionDayView = ({ onBack }: ConfessionDayViewProps) => {
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
      {/* Floating heart particles */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100vw", height: "100vh", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-300 fill-pink-200"
            style={{
              width: `${12 + (i % 4) * 5}px`,
              left: `${6 + (i * 6.2) % 86}%`,
              top: `${5 + (i * 11.7) % 82}%`,
              opacity: 0.12 + (i % 3) * 0.05,
              animation: `confessionHeartFloat ${6 + (i % 4) * 2}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      {!showLetter ? (
        <div className="flex flex-col items-center gap-6 z-10">
          {/* Confession day image — slow fade-in */}
          <img
            src={confessionDayImg}
            alt="Confession Day"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl rounded-2xl"
            style={{ animation: "confessionFadeIn 2s ease-out both" }}
          />

          {/* Tap button */}
          <button
            onClick={() => setShowLetter(true)}
            className="mt-2 group"
            style={{ animation: "confessionFadeIn 1s ease-out 2.2s both" }}
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500"
                style={{ animation: "confessionPulse 3s ease-in-out infinite", boxShadow: "0 0 25px rgba(244,171,188,0.4)" }}
              >
                <Heart className="h-5 w-5 text-white fill-white" />
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
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(244,63,94,0.15)" }}
          >
            <div className="font-body text-[15px] md:text-base leading-[1.8] text-foreground" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              <p className="mb-5 text-center font-display text-lg text-rose-500 font-bold">To Love,</p>

              <p className="mb-4">
                So… you've read through all these letters, hm? I hope every word wrapped around you like a warm embrace. I hope each paragraph felt like my arms holding you close. Writing these isn't just something I do; it's something I feel. Every sentence carries a piece of my heart. I wanted each letter to show a different shade of our love: the laughter, the support, the passion, the comfort. Because our love isn't one-dimensional. It's layered. It's alive. It's growing.
              </p>

              <p className="mb-4">
                You have been my rock when I felt unsteady. My confidant when I needed to speak freely. My greatest cheerleader when I doubted myself. Every tear, every laugh, every challenge we've faced together has woven our hearts closer.
              </p>

              <p className="mb-4">
                Life will throw its unexpected moments at us, confusion, stress, distance, uncertainty, but remember this: we are never facing them alone. If you're tired, I'm here. If you're angry, I'm here. If you're celebrating, I'm right there beside you in spirit. My love does not change with circumstances. It remains. Constant. Steady. Sure.
              </p>

              <p className="mb-4">
                Our journey is only beginning. There are so many memories we haven't made yet. So many adventures waiting for us. So many mornings waking up next to each other, so many nights falling asleep wrapped in love. I get excited just thinking about our future: the moments, the ordinary days that will feel extraordinary simply because we are together.
              </p>

              <p className="mb-4">
                Read this whenever you miss me, when you feel unsure, when you need reassurance. They are pieces of my heart, written for you, even if cramped pieces. No matter what the future holds, no matter what paths we walk, know that my love for you is not going anywhere. Together, we can build something beautiful: a life filled with warmth, laughter, loyalty, and endless affection.
              </p>

              <p className="mb-4">
                I miss you so much, more than words can ever truly say. Every single day without you feels longer than the last, as if time itself slows down just to remind me of the distance between us. But even in the silence, even in the empty spaces where your laughter should be, I feel you with me. You live in my thoughts, in my heart, in every quiet moment when I close my eyes and picture your smile. Being apart is never easy, but loving you makes even the hardest days softer, because I know what we have is real, deep, and unshakable.
              </p>

              <p className="mb-4">
                When I think about all the beautiful memories we've created together, my heart overflows. I replay them over and over: the way you look at me when I'm talking, the sound of your laugh, the warmth of your hand in mine. Those moments are my comfort. They are my reminder that distance cannot weaken what is built on love this strong. If anything, it only makes me long for you more, appreciate you more, cherish you more. And it makes the thought of our reunion even sweeter. The day I see you again, hold you again, feel your heartbeat close to mine, that day will be everything… again.
              </p>

              <p className="mb-4">
                Until then, hold on to us. Hold on to every hug, every late-night conversation, every promise between us. Our bond is patient. It is connected so that even miles could never break it. I am counting down the days, the hours, the minutes until I can look into your eyes again and remind you face-to-face just how much you mean to me.
              </p>

              <p className="mb-4">
                Every time I look at you, even just in a picture, my heart leaps in a way I can't control. Whatever worries or pressures weigh on me instantly fade when I think about the way you hold my hand. In your touch, there is reassurance. In your presence, there is peace. I have never trusted anyone the way I trust you. You are my safe place in a world that can sometimes feel overwhelming.
              </p>

              <p className="mb-4">
                You inspire me in ways you may not even realize. You make me want to grow, to dream bigger, to become better. Loving you has changed me, softened me, strengthened me, shaped me into someone braver. Sometimes I sit and wonder what I did to deserve someone as kind, as genuine, as beautiful as you. Your heart is pure. Your soul is radiant. You are more than words could ever fully describe. When I tell you that you mean the world to me, it's the truth beating inside me.
              </p>

              <p className="mb-4">
                Now tell me… where do I even begin to describe the depth of what I feel for you?
              </p>

              <p className="mb-4">
                From the moment you entered my life, everything just shifted. You brought light into corners of my world I didn't even realize were dark. Your presence turned ordinary days into something magical. You make simple moments unforgettable. Sitting beside you feels like home, <span className="font-bold">MY HOME</span>. Hearing your voice feels like music. Being loved by you feels like the greatest gift I've ever received.
              </p>

              <p className="mb-4">
                I love you not only for who you are, but for how you make everything feel: cherished, understood, safe, no matter if it's good or bad. You accepted my flaws without hesitation. In your arms, I can be vulnerable without fear. You've shown me that real love is patient. It's kind. It's protective. It stays…
              </p>

              <p className="mb-4">
                You are my anchor when life feels stormy. My calm in chaos. With you, I feel fearless. Capable. Ready to take on anything. But what makes me love you even more are the little things: how your eyes light up when you talk about something you love, the soft smile you try to hide, the way you instinctively reach for my hand.
              </p>

              <p className="mb-4">
                I love the way you challenge me to grow. The way you believe in me when I doubt myself. The way you stand by me without hesitation. Loving you feels natural, like breathing. Effortless, yet life-taking if not there.
              </p>

              <p className="mb-4">
                Above all else, I love you simply because you are you. Your laugh. Your heart. Your strength. Your tenderness. You are everything I didn't know I needed and everything I will always choose.
              </p>

              <p className="mb-4">
                My love for you stretches beyond distance, beyond time, beyond circumstance. It exists in every place known and unknown. You are my forever. My always. My greatest blessing.
              </p>

              <p className="mb-4">
                I will never stop choosing you. I will never stop loving you. I will never stop reminding you just how extraordinary you are.
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
              ← back to confession
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confessionFadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes confessionHeartFloat {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(6px, -10px) scale(1.1) rotate(5deg); }
          50% { transform: translate(-4px, -18px) scale(1.05) rotate(-3deg); }
          75% { transform: translate(8px, -8px) scale(1.08) rotate(4deg); }
        }
        @keyframes confessionPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(244,171,188,0.4); }
          50% { transform: scale(1.06); box-shadow: 0 0 35px rgba(244,171,188,0.55); }
        }
      `}</style>
    </div>
  );
};

export default ConfessionDayView;
