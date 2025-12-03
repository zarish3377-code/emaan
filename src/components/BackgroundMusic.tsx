import { useEffect, useRef, useState } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const startMusic = () => {
      if (!musicStarted && audioRef.current) {
        setMusicStarted(true);
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          let volume = 0;
          const fadeInterval = setInterval(() => {
            volume += 0.01;
            if (audioRef.current) {
              audioRef.current.volume = Math.min(volume, 0.25);
            }
            if (volume >= 0.25) {
              clearInterval(fadeInterval);
            }
          }, 120);
        }).catch(() => {
          // Autoplay was prevented, will try again on next interaction
          setMusicStarted(false);
        });
      }
    };

    window.addEventListener("scroll", startMusic);
    window.addEventListener("click", startMusic);
    window.addEventListener("touchstart", startMusic);

    return () => {
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
  }, [musicStarted]);

  return (
    <audio ref={audioRef} loop className="hidden">
      <source src="/audio/bgm.mp3" type="audio/mpeg" />
    </audio>
  );
};

export default BackgroundMusic;
