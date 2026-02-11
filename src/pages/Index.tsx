import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import SweaterSection from "@/components/SweaterSection";
import LetterSection from "@/components/LetterSection";
import VideoSection from "@/components/VideoSection";
import BackgroundMusic from "@/components/BackgroundMusic";
import MessagePanel from "@/components/MessagePanel";
import NenoPanel from "@/components/NenoPanel";
import SecretGarden from "@/components/SecretGarden";
import NewYearCelebration from "@/components/NewYearCelebration";
import NewYearPanel from "@/components/NewYearPanel";
import CollectionPanel from "@/components/CollectionPanel";
import CountdownPanel from "@/components/CountdownPanel";
import ValentinePanel from "@/components/ValentinePanel";
import NavMenuButton from "@/components/NavMenuButton";
import PasswordGate from "@/components/PasswordGate";
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

        {/* Nav Menu */}
        <NavMenuButton
          onOpenNeno={() => setIsNenoPanelOpen(true)}
          onOpenGarden={() => setIsGardenOpen(true)}
          onOpenNewYear={() => setIsNewYearPanelOpen(true)}
          onOpenCollection={() => setIsCollectionOpen(true)}
          onOpenValentine={() => setIsValentineOpen(true)}
          onOpenCountdown={() => setIsCountdownOpen(true)}
          onOpenMessage={() => setIsMessagePanelOpen(true)}
        />

        {/* Panels */}
        <NenoPanel isOpen={isNenoPanelOpen} onClose={() => setIsNenoPanelOpen(false)} />
        <SecretGarden isOpen={isGardenOpen} onClose={() => setIsGardenOpen(false)} />
        <NewYearPanel isOpen={isNewYearPanelOpen} onClose={() => setIsNewYearPanelOpen(false)} />
        <CollectionPanel isOpen={isCollectionOpen} onClose={() => setIsCollectionOpen(false)} />
        <CountdownPanel isOpen={isCountdownOpen} onClose={() => setIsCountdownOpen(false)} />
        <ValentinePanel isOpen={isValentineOpen} onClose={() => setIsValentineOpen(false)} />
        <MessagePanel isOpen={isMessagePanelOpen} onClose={() => setIsMessagePanelOpen(false)} />
      </main>
    </PasswordGate>
  );
};

export default Index;
