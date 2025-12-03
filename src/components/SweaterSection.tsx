import { useEffect, useRef, useState } from "react";
import sweaterImage from "@/assets/sweater.png";
import FloatingTulip from "./FloatingTulip";

const SweaterSection = () => {
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
      className="relative min-h-screen bg-warm-white py-20"
    >
      {/* Floating Tulips */}
      <FloatingTulip style={{ top: "10%", left: "5%" }} delay={0} size={60} />
      <FloatingTulip style={{ top: "20%", right: "8%" }} delay={1} size={70} />
      <FloatingTulip style={{ bottom: "15%", left: "8%" }} delay={2} size={55} />
      <FloatingTulip style={{ bottom: "25%", right: "5%" }} delay={3} size={65} />
      <FloatingTulip style={{ top: "50%", left: "3%" }} delay={4} size={50} />
      <FloatingTulip style={{ top: "40%", right: "3%" }} delay={5} size={55} />

      {/* Corner love texts */}
      <p className="absolute left-6 top-8 font-body text-sm italic text-primary/60">
        ✨ made with love ✨
      </p>
      <p className="absolute right-6 top-8 font-body text-sm italic text-primary/60">
        🌷 just for u 🌷
      </p>

      <div className="container mx-auto flex flex-col items-center justify-center px-4">
        {/* Sweater Image */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <img
            src={sweaterImage}
            alt="A cozy sweater made with love"
            className="mx-auto max-w-xs rounded-3xl shadow-soft md:max-w-md lg:max-w-lg"
          />
        </div>

        {/* Heading */}
        <h2
          className={`mt-10 text-center font-display text-3xl font-medium text-foreground transition-all delay-300 duration-1000 md:text-4xl lg:text-5xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          here's your sweater, love
        </h2>

        <p
          className={`mt-4 text-center font-body text-lg text-muted-foreground transition-all delay-500 duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          🌷 to keep u warm when i'm not there 🌷
        </p>
      </div>

      {/* Bottom love texts */}
      <p className="absolute bottom-8 left-6 font-body text-sm italic text-primary/60">
        💕 i'll always be here 💕
      </p>
      <p className="absolute bottom-8 right-6 font-body text-sm italic text-primary/60">
        🌸 thinking of u always 🌸
      </p>
    </section>
  );
};

export default SweaterSection;
