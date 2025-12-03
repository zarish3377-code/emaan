import { useEffect, useRef, useState } from "react";
import FloatingTulip from "./FloatingTulip";

const LetterSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-warm-white/80 to-soft-pink/80 py-20 backdrop-blur-sm"
    >
      {/* Floating Tulips - on sides only, NO center (letter area is center) */}
      <FloatingTulip style={{ top: "3%", left: "3%" }} delay={0} size={55} />
      <FloatingTulip style={{ top: "8%", left: "8%" }} delay={1} size={50} />
      <FloatingTulip style={{ top: "5%", right: "3%" }} delay={2} size={60} />
      <FloatingTulip style={{ top: "10%", right: "8%" }} delay={3} size={50} />
      
      <FloatingTulip style={{ top: "18%", left: "3%" }} delay={4} size={55} />
      <FloatingTulip style={{ top: "22%", right: "3%" }} delay={5} size={55} />
      
      <FloatingTulip style={{ top: "32%", left: "3%" }} delay={0} size={50} />
      <FloatingTulip style={{ top: "35%", right: "3%" }} delay={1} size={55} />
      
      <FloatingTulip style={{ top: "45%", left: "3%" }} delay={2} size={55} />
      <FloatingTulip style={{ top: "48%", right: "3%" }} delay={3} size={50} />
      
      <FloatingTulip style={{ top: "58%", left: "3%" }} delay={4} size={50} />
      <FloatingTulip style={{ top: "62%", right: "3%" }} delay={5} size={55} />
      
      <FloatingTulip style={{ top: "72%", left: "3%" }} delay={0} size={55} />
      <FloatingTulip style={{ top: "75%", right: "3%" }} delay={1} size={50} />
      
      <FloatingTulip style={{ bottom: "15%", left: "3%" }} delay={2} size={55} />
      <FloatingTulip style={{ bottom: "12%", left: "8%" }} delay={3} size={50} />
      <FloatingTulip style={{ bottom: "18%", right: "3%" }} delay={4} size={55} />
      <FloatingTulip style={{ bottom: "10%", right: "8%" }} delay={5} size={50} />

      <div className="container mx-auto px-4">
        {/* Letter Card */}
        <div
          className={`mx-auto max-w-3xl rounded-[25px] bg-cream-white p-8 shadow-letter transition-all duration-1000 md:p-12 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          <div className="font-body text-[17px] leading-[1.7] text-foreground md:text-lg">
            <p className="mb-6">(For my love, my emaan'im)</p>
            
            <p className="mb-4">
              U deserve so much more than what life has thrown at U. 🌷
            </p>
            
            <p className="mb-4">
              U deserve days that don't feel like battles, people who don't make U question Ur worth every time U breathe, and moments that feel gentle instead of exhausting. U deserve comfort, steadiness, and a kind of love that doesn't ask U to shrink or perform. 🌷
            </p>
            
            <p className="mb-4">
              U deserve to be understood without explaining a thousand times, to be loved without earning it, and to be held without having to ask. and I promise, I see U. The real U. 🌷
            </p>
            
            <div className="mb-4 pl-4">
              <p>The sides U hide when U think U're "too much."</p>
              <p>The softness under the tough days.</p>
              <p>The way U care deeper than U admit.</p>
              <p>The strength it takes for U to keep going even when everything feels heavy and drags back.</p>
            </div>
            
            <p className="mb-4">
              None of that makes U dramatic, difficult, or weak. it makes U human, MY HUMAN. it makes U beautiful. it makes U stronger than U ever give Urself credit for. 🌷
            </p>
            
            <p className="mb-4">
              And I'm not here out of pity, habit, or convenience. I'm here because I choose U, again and again. U're my person, my comfort, my constant, my safe place, my favourite kind of chaos. 🌷
            </p>
            
            <div className="mb-4 pl-4">
              <p>I don't need U to be perfect.</p>
              <p>I don't need U to hide Ur fears.</p>
              <p>I don't need U to act fine when U're breaking inside.</p>
            </div>
            
            <p className="mb-4">
              Even on the days U think U're distant, annoying, confusing, or "too much," I'm not leaving. I'm not going to disappear when things aren't pretty. I stay and I will stay. 🌷
            </p>
            
            <p className="mb-4">
              U deserve someone who listens without getting irritated, someone who holds space for Ur fears instead of brushing them off, someone who doesn't turn Ur overwhelmed moments into jokes. U deserve someone who lets U fall apart without guilt, without shame, without judgment. 🌷
            </p>
            
            <p className="mb-4">
              And I want to be that for U, in the ways U want, and in the ways I'm still learning. and if I ever fall short, I still pray that life gives U that softness and safety somewhere, because U deserve it more than U realise. 🌷
            </p>
            
            <p className="mb-4">so read this clearly:</p>
            
            <div className="mb-4 pl-4">
              <p>U are not too much.</p>
              <p>U are not hard to love.</p>
              <p>U are not replaceable.</p>
              <p>Ur presence matters more than U know. 🌷</p>
            </div>
            
            <p className="mb-4">
              And even if distance comes, even if days get messy, even if U doubt Urself again, I'm still here. same today, same tomorrow, same next week, same always. Nothing changes that. 🌷
            </p>
            
            <p className="mb-6">
              Keep this Web and open on the days when Ur mind is loud or Ur heart feels tired, read it again. Let it remind U that someone out here cares for U deeply, genuinely, and without wavering.
            </p>
            
            <p className="text-right">— me(Ur neno) 🌷</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LetterSection;
