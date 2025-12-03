import { useEffect, useRef, useState } from "react";
import FloatingTulip from "./FloatingTulip";
import FloatingText from "./FloatingText";

const floatingTexts = [
  "You're safe with me.",
  "We can weather any storm.",
  "My love is your shelter.",
  "Sending you a hug.",
  "You're stronger than you know.",
];

const VideoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-soft-pink/80 to-pastel-lavender/80 py-20 backdrop-blur-sm"
    >
      {/* Floating Tulips - Many more */}
      <FloatingTulip style={{ top: "3%", left: "3%" }} delay={0} size={60} />
      <FloatingTulip style={{ top: "5%", left: "15%" }} delay={1} size={50} />
      <FloatingTulip style={{ top: "4%", left: "30%" }} delay={2} size={55} />
      <FloatingTulip style={{ top: "6%", right: "28%" }} delay={3} size={50} />
      <FloatingTulip style={{ top: "3%", right: "12%" }} delay={4} size={60} />
      <FloatingTulip style={{ top: "8%", right: "3%" }} delay={5} size={55} />
      
      <FloatingTulip style={{ top: "18%", left: "5%" }} delay={0} size={55} />
      <FloatingTulip style={{ top: "22%", right: "5%" }} delay={1} size={60} />
      <FloatingTulip style={{ top: "35%", left: "3%" }} delay={2} size={50} />
      <FloatingTulip style={{ top: "38%", right: "3%" }} delay={3} size={55} />
      
      <FloatingTulip style={{ top: "50%", left: "5%" }} delay={4} size={60} />
      <FloatingTulip style={{ top: "55%", right: "5%" }} delay={5} size={55} />
      <FloatingTulip style={{ top: "65%", left: "3%" }} delay={0} size={50} />
      <FloatingTulip style={{ top: "70%", right: "3%" }} delay={1} size={60} />
      
      <FloatingTulip style={{ bottom: "18%", left: "8%" }} delay={2} size={55} />
      <FloatingTulip style={{ bottom: "12%", left: "22%" }} delay={3} size={50} />
      <FloatingTulip style={{ bottom: "15%", right: "20%" }} delay={4} size={55} />
      <FloatingTulip style={{ bottom: "10%", right: "5%" }} delay={5} size={60} />

      {/* Floating Texts - on sides only */}
      <FloatingText text={floatingTexts[0]} style={{ top: "12%", left: "5%" }} delay={0} />
      <FloatingText text={floatingTexts[1]} style={{ top: "28%", right: "5%" }} delay={1} />
      <FloatingText text={floatingTexts[2]} style={{ top: "45%", left: "5%" }} delay={2} />
      <FloatingText text={floatingTexts[3]} style={{ top: "62%", right: "5%" }} delay={3} />
      <FloatingText text={floatingTexts[4]} style={{ bottom: "20%", left: "5%" }} delay={4} />

      {/* Corner texts */}
      <p className="absolute left-6 top-8 font-body text-sm italic text-foreground/60">
        ✨ a moment for us ✨
      </p>
      <p className="absolute right-6 top-8 font-body text-sm italic text-foreground/60">
        🌷 with all my love 🌷
      </p>

      <div className="container mx-auto flex flex-col items-center justify-center px-4">
        {/* Heading */}
        <h2
          className={`mb-10 text-center font-display text-3xl font-medium text-foreground transition-all duration-1000 md:text-4xl lg:text-5xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          a little video for u
        </h2>

        {/* Video Container */}
        <div
          className={`w-full max-w-4xl transition-all delay-300 duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-[20px] shadow-soft">
            <video
              controls
              className="h-auto w-full"
              poster=""
            >
              <source src="/videos/final_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <p
          className={`mt-8 text-center font-body text-lg italic text-muted-foreground transition-all delay-500 duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          💕 i love u more than words can say 💕
        </p>
      </div>

      {/* Bottom love texts */}
      <p className="absolute bottom-8 left-6 font-body text-sm italic text-foreground/60">
        🌸 always & forever 🌸
      </p>
      <p className="absolute bottom-8 right-6 font-body text-sm italic text-foreground/60">
        💕 u're my everything 💕
      </p>
    </section>
  );
};

export default VideoSection;
