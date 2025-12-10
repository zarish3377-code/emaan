import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import SweaterSection from "@/components/SweaterSection";
import LetterSection from "@/components/LetterSection";
import VideoSection from "@/components/VideoSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import JustSayItButton from "@/components/JustSayItButton";
import MessagePanel from "@/components/MessagePanel";
import NenoButton from "@/components/NenoButton";
import NenoPanel from "@/components/NenoPanel";
import backgroundAllway from "@/assets/background_allway.jpg";

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);
  const [isNenoPanelOpen, setIsNenoPanelOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate scroll progress for the first viewport
      const progress = Math.min(scrollTop / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative">
      {/* Global Background Image (visible after scroll) */}
      <div
        className="fixed inset-0 -z-10 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundAllway})`,
        }}
      />

      {/* Background Music */}
      <BackgroundMusic />

      {/* Hero Section with Video Background */}
      <HeroSection scrollProgress={scrollProgress} />

      {/* Sweater Section */}
      <SweaterSection />

      {/* Letter Section */}
      <LetterSection />

      {/* Final Video Section */}
      <VideoSection />

      {/* Footer */}
      <footer className="bg-pastel-lavender py-12 text-center">
        <p className="font-body text-sm text-muted-foreground">
          made with all my love 🌷
        </p>
        <p className="mt-2 font-display text-lg text-foreground">
          forever yours
        </p>
      </footer>

      {/* Neno Button & Panel */}
      <NenoButton onClick={() => setIsNenoPanelOpen(true)} />
      <NenoPanel 
        isOpen={isNenoPanelOpen} 
        onClose={() => setIsNenoPanelOpen(false)} 
      />

      {/* Just Say It Button & Panel */}
      <JustSayItButton onClick={() => setIsMessagePanelOpen(true)} />
      <MessagePanel 
        isOpen={isMessagePanelOpen} 
        onClose={() => setIsMessagePanelOpen(false)} 
      />
    </main>
  );
};

export default Index;
