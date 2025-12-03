import { useEffect, useRef, useState } from "react";
import FloatingTulip from "./FloatingTulip";

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
      className="relative min-h-screen bg-gradient-to-b from-soft-pink to-pastel-lavender py-20"
    >
      {/* Floating Tulips */}
      <FloatingTulip style={{ top: "5%", left: "5%" }} delay={0} size={60} />
      <FloatingTulip style={{ top: "15%", right: "8%" }} delay={1} size={70} />
      <FloatingTulip style={{ bottom: "10%", left: "8%" }} delay={2} size={55} />
      <FloatingTulip style={{ bottom: "20%", right: "5%" }} delay={3} size={65} />
      <FloatingTulip style={{ top: "40%", left: "3%" }} delay={4} size={50} />
      <FloatingTulip style={{ top: "50%", right: "3%" }} delay={5} size={55} />

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
