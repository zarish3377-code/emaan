import { useEffect, useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import SweaterSection from "@/components/SweaterSection";
import LetterSection from "@/components/LetterSection";
import VideoSection from "@/components/VideoSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import JustSayItButton from "@/components/JustSayItButton";
import MessagePanel from "@/components/MessagePanel";
import NenoButton from "@/components/NenoButton";
import NenoPanel from "@/components/NenoPanel";
import SecretGardenButton from "@/components/SecretGardenButton";
import SecretGarden from "@/components/SecretGarden";
import NewYearCelebration from "@/components/NewYearCelebration";
import NewYearButton from "@/components/NewYearButton";
import NewYearPanel from "@/components/NewYearPanel";
import CollectionButton from "@/components/CollectionButton";
import CollectionPanel from "@/components/CollectionPanel";
import CountdownButton from "@/components/CountdownButton";
import CountdownPanel from "@/components/CountdownPanel";
import ValentineButton from "@/components/ValentineButton";
import ValentinePanel from "@/components/ValentinePanel";
import PasswordGate from "@/components/PasswordGate";
import LoveMode from "@/components/LoveMode";
import backgroundAllway from "@/assets/background_allway.jpg";

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);
  const [isNenoPanelOpen, setIsNenoPanelOpen] = useState(false);
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const [isNewYearPanelOpen, setIsNewYearPanelOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const [isValentineOpen, setIsValentineOpen] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

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
    <PasswordGate>
      <LoveMode />
      <main className="relative">
        {/* Global Background Image (visible after scroll) */}
        <div
          className="fixed inset-0 -z-10 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundAllway})`,
          }}
        />

        {/* Background Music */}
        <BackgroundMusic ref={backgroundAudioRef} />

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

        {/* New Year Celebration (shows on Jan 1, 2026) */}
        <NewYearCelebration />

        {/* Secret Garden Button & View */}
        <SecretGardenButton onClick={() => setIsGardenOpen(true)} />
        <SecretGarden 
          isOpen={isGardenOpen} 
          onClose={() => setIsGardenOpen(false)} 
        />

        {/* Happy New Year Button & Panel */}
        <NewYearButton onClick={() => setIsNewYearPanelOpen(true)} />
        <NewYearPanel 
          isOpen={isNewYearPanelOpen} 
          onClose={() => setIsNewYearPanelOpen(false)} 
        />

        {/* Collection Button & Panel */}
        <CollectionButton onClick={() => setIsCollectionOpen(true)} />
        <CollectionPanel 
          isOpen={isCollectionOpen} 
          onClose={() => setIsCollectionOpen(false)} 
        />

        {/* Countdown Button & Panel */}
        <CountdownButton onClick={() => setIsCountdownOpen(true)} />
        <CountdownPanel 
          isOpen={isCountdownOpen} 
          onClose={() => setIsCountdownOpen(false)} 
        />

        {/* Valentine Button & Panel */}
        <ValentineButton onClick={() => setIsValentineOpen(true)} />
        <ValentinePanel 
          isOpen={isValentineOpen} 
          onClose={() => setIsValentineOpen(false)}
          backgroundAudioRef={backgroundAudioRef}
        />

        {/* Just Say It Button & Panel */}
        <JustSayItButton onClick={() => setIsMessagePanelOpen(true)} />
        <MessagePanel 
          isOpen={isMessagePanelOpen} 
          onClose={() => setIsMessagePanelOpen(false)} 
        />
      </main>
    </PasswordGate>
  );
};

export default Index;
