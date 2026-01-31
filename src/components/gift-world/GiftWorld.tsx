import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import GiftWorldButton from "./GiftWorldButton";
import GiftWorldTransition from "./GiftWorldTransition";
import HouseHub from "./HouseHub";

const GiftWorld = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHouse, setShowHouse] = useState(false);

  const handleOpen = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setShowHouse(true);
  }, []);

  const handleExit = () => {
    setShowHouse(false);
  };

  return (
    <>
      {/* Entry button - only show when not in gift world */}
      {!showHouse && !isTransitioning && (
        <GiftWorldButton onClick={handleOpen} />
      )}

      {/* Transition animation */}
      <GiftWorldTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
      />

      {/* The House Hub */}
      <AnimatePresence>
        {showHouse && <HouseHub onExit={handleExit} />}
      </AnimatePresence>
    </>
  );
};

export default GiftWorld;
