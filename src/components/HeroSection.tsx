import { useEffect, useState } from "react";
import FloatingTulip from "./FloatingTulip";
import floatingTulip from "@/assets/floating_tulip.png";
import tulipBackground from "@/assets/tulip_background.jpg";

interface HeroSectionProps {
  scrollProgress: number;
}

const HeroSection = ({ scrollProgress }: HeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const videoOpacity = Math.max(0, 1 - scrollProgress * 2);
  const imageOpacity = Math.min(1, scrollProgress * 2);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: videoOpacity }}
      >
        <source src="/videos/hero_background.mp4" type="video/mp4" />
      </video>

      {/* Tulip Garden Background Image (fades in on scroll) */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: `url(${tulipBackground})`,
          opacity: imageOpacity,
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, hsl(330 70% 92% / 0.7) 100%)",
        }}
      />

      {/* Floating Tulips - Many more! */}
      <FloatingTulip style={{ top: "5%", left: "5%" }} delay={0} size={70} />
      <FloatingTulip style={{ top: "15%", right: "8%" }} delay={1} size={90} />
      <FloatingTulip style={{ bottom: "25%", left: "10%" }} delay={2} size={65} />
      <FloatingTulip style={{ top: "40%", right: "15%" }} delay={3} size={75} />
      <FloatingTulip style={{ bottom: "15%", right: "5%" }} delay={4} size={85} />
      <FloatingTulip style={{ top: "8%", left: "35%" }} delay={5} size={60} />
      <FloatingTulip style={{ bottom: "30%", left: "25%" }} delay={0} size={55} />
      <FloatingTulip style={{ top: "25%", left: "15%" }} delay={1} size={50} />
      <FloatingTulip style={{ bottom: "10%", left: "40%" }} delay={2} size={70} />
      <FloatingTulip style={{ top: "50%", left: "3%" }} delay={3} size={60} />
      <FloatingTulip style={{ top: "35%", right: "25%" }} delay={4} size={65} />
      <FloatingTulip style={{ bottom: "40%", right: "10%" }} delay={5} size={55} />
      <FloatingTulip style={{ top: "60%", right: "35%" }} delay={0} size={50} />
      <FloatingTulip style={{ top: "20%", left: "50%" }} delay={1} size={45} />
      <FloatingTulip style={{ bottom: "20%", right: "40%" }} delay={2} size={60} />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* FOR LOVE Title with Tulips */}
        <div
          className={`flex items-center gap-4 transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <img
            src={floatingTulip}
            alt=""
            className="h-16 w-auto animate-float md:h-24"
          />
          <h1 className="font-display text-6xl font-bold tracking-wider text-foreground text-glow-pink md:text-8xl lg:text-9xl">
            FOR LOVE
          </h1>
          <img
            src={floatingTulip}
            alt=""
            className="float-animation-delay-2 h-16 w-auto md:h-24"
          />
        </div>

        {/* Cute corner texts */}
        <p
          className={`absolute left-6 top-6 font-body text-sm italic text-foreground/70 transition-all delay-300 duration-1000 md:text-base ${
            isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          ✨ you mean everything to me ✨
        </p>
        <p
          className={`absolute right-6 top-6 font-body text-sm italic text-foreground/70 transition-all delay-500 duration-1000 md:text-base ${
            isLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          🌷 my favorite person 🌷
        </p>
        <p
          className={`absolute bottom-24 left-6 font-body text-sm italic text-foreground/70 transition-all delay-700 duration-1000 md:text-base ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          💕 forever & always 💕
        </p>
        <p
          className={`absolute bottom-24 right-6 font-body text-sm italic text-foreground/70 transition-all delay-900 duration-1000 md:text-base ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          🌸 my heart is yours 🌸
        </p>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 flex flex-col items-center transition-all delay-1000 duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="mb-2 font-body text-sm text-foreground/60">scroll down, love</p>
          <div className="animate-bounce">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
