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

      {/* Floating Tulips - MANY MORE everywhere including center! */}
      {/* Top Row */}
      <FloatingTulip style={{ top: "3%", left: "3%" }} delay={0} size={70} />
      <FloatingTulip style={{ top: "5%", left: "15%" }} delay={1} size={55} />
      <FloatingTulip style={{ top: "2%", left: "30%" }} delay={2} size={60} />
      <FloatingTulip style={{ top: "6%", left: "45%" }} delay={3} size={50} />
      <FloatingTulip style={{ top: "4%", left: "55%" }} delay={4} size={65} />
      <FloatingTulip style={{ top: "3%", left: "70%" }} delay={5} size={55} />
      <FloatingTulip style={{ top: "5%", right: "10%" }} delay={0} size={70} />
      <FloatingTulip style={{ top: "8%", right: "3%" }} delay={1} size={60} />
      
      {/* Upper Middle */}
      <FloatingTulip style={{ top: "15%", left: "5%" }} delay={2} size={65} />
      <FloatingTulip style={{ top: "18%", left: "20%" }} delay={3} size={50} />
      <FloatingTulip style={{ top: "12%", left: "38%" }} delay={4} size={55} />
      <FloatingTulip style={{ top: "16%", right: "35%" }} delay={5} size={60} />
      <FloatingTulip style={{ top: "14%", right: "18%" }} delay={0} size={55} />
      <FloatingTulip style={{ top: "20%", right: "5%" }} delay={1} size={70} />

      {/* Center Area */}
      <FloatingTulip style={{ top: "30%", left: "8%" }} delay={2} size={60} />
      <FloatingTulip style={{ top: "35%", left: "18%" }} delay={3} size={50} />
      <FloatingTulip style={{ top: "28%", left: "28%" }} delay={4} size={55} />
      <FloatingTulip style={{ top: "32%", right: "28%" }} delay={5} size={50} />
      <FloatingTulip style={{ top: "38%", right: "15%" }} delay={0} size={60} />
      <FloatingTulip style={{ top: "30%", right: "5%" }} delay={1} size={65} />

      {/* Middle Row */}
      <FloatingTulip style={{ top: "45%", left: "3%" }} delay={2} size={55} />
      <FloatingTulip style={{ top: "50%", left: "12%" }} delay={3} size={50} />
      <FloatingTulip style={{ top: "48%", right: "12%" }} delay={4} size={55} />
      <FloatingTulip style={{ top: "52%", right: "3%" }} delay={5} size={60} />

      {/* Lower Middle */}
      <FloatingTulip style={{ top: "60%", left: "5%" }} delay={0} size={65} />
      <FloatingTulip style={{ top: "65%", left: "20%" }} delay={1} size={50} />
      <FloatingTulip style={{ top: "58%", left: "35%" }} delay={2} size={55} />
      <FloatingTulip style={{ top: "62%", right: "30%" }} delay={3} size={50} />
      <FloatingTulip style={{ top: "68%", right: "18%" }} delay={4} size={60} />
      <FloatingTulip style={{ top: "60%", right: "5%" }} delay={5} size={55} />

      {/* Bottom Area */}
      <FloatingTulip style={{ bottom: "25%", left: "8%" }} delay={0} size={60} />
      <FloatingTulip style={{ bottom: "22%", left: "25%" }} delay={1} size={55} />
      <FloatingTulip style={{ bottom: "28%", left: "40%" }} delay={2} size={50} />
      <FloatingTulip style={{ bottom: "20%", right: "38%" }} delay={3} size={55} />
      <FloatingTulip style={{ bottom: "25%", right: "22%" }} delay={4} size={60} />
      <FloatingTulip style={{ bottom: "22%", right: "8%" }} delay={5} size={65} />

      {/* Very Bottom */}
      <FloatingTulip style={{ bottom: "12%", left: "5%" }} delay={0} size={55} />
      <FloatingTulip style={{ bottom: "8%", left: "18%" }} delay={1} size={50} />
      <FloatingTulip style={{ bottom: "15%", left: "32%" }} delay={2} size={45} />
      <FloatingTulip style={{ bottom: "10%", right: "30%" }} delay={3} size={50} />
      <FloatingTulip style={{ bottom: "14%", right: "15%" }} delay={4} size={55} />
      <FloatingTulip style={{ bottom: "8%", right: "5%" }} delay={5} size={60} />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* FOR LOVE Title with FILLED Tulips on sides */}
        <div
          className={`flex items-center gap-2 transition-all duration-1000 md:gap-4 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Left side tulips - filled/stacked */}
          <div className="flex items-center -space-x-2 md:-space-x-4">
            <img src={floatingTulip} alt="" className="h-10 w-auto animate-float md:h-16 lg:h-20" />
            <img src={floatingTulip} alt="" className="float-animation-delay-1 h-12 w-auto md:h-20 lg:h-24" />
            <img src={floatingTulip} alt="" className="float-animation-delay-2 h-10 w-auto md:h-16 lg:h-20" />
          </div>
          
          <h1 className="font-display text-5xl font-bold tracking-wider text-foreground text-glow-pink md:text-7xl lg:text-9xl">
            FOR LOVE
          </h1>
          
          {/* Right side tulips - filled/stacked */}
          <div className="flex items-center -space-x-2 md:-space-x-4">
            <img src={floatingTulip} alt="" className="float-animation-delay-3 h-10 w-auto md:h-16 lg:h-20" />
            <img src={floatingTulip} alt="" className="float-animation-delay-4 h-12 w-auto md:h-20 lg:h-24" />
            <img src={floatingTulip} alt="" className="float-animation-delay-5 h-10 w-auto md:h-16 lg:h-20" />
          </div>
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
