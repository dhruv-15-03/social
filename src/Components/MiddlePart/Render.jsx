import React, { useEffect, useState } from 'react';
import TimedModal from "./StoryModal";

const Render = ({ items, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localOpen, setLocalOpen] = useState(open); 

  const handleClose = async () => {
    await new Promise((resolve) => {
      setLocalOpen(false);
      resolve();
    });

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLocalOpen(true); 
    } else {
      setCurrentIndex(0); 
      onClose(); 
    }
  };

  useEffect(() => {
    if (open) {
      setLocalOpen(true); 
    } else {
      setCurrentIndex(0);
      setLocalOpen(false); 
    }
  }, [open]);

  return (
    <div>
      {items.length > 0 && (
        <TimedModal 
          item={items[currentIndex]} 
          open={localOpen} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
};

export default Render;



