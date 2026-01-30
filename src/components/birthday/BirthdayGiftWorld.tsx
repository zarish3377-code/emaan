import { useState } from "react";
import BirthdayGiftButton from "./BirthdayGiftButton";
import GiftWorldTransition from "./GiftWorldTransition";
import GiftHouse from "./GiftHouse";

const BirthdayGiftWorld = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <>
      <BirthdayGiftButton onClick={handleOpen} />
      <GiftWorldTransition isOpen={isOpen}>
        <GiftHouse 
          onClose={handleClose} 
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      </GiftWorldTransition>
    </>
  );
};

export default BirthdayGiftWorld;
