import React, { useEffect } from 'react';
import { Card, Modal } from '@mui/material';
import TextDisplay from '../Post/TextDisplay';

const centeredStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxWidth: '80%', // Adjust to fit content
  maxHeight: '80%', // Adjust to fit content
  overflow: 'auto' // In case content overflows
};

const TimedModal = ({ item, open, onClose }) => {
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        onClose();
      }, 20000); 
    }

    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Card sx={centeredStyle}>
        <div className="flex justify-center bg-black justify-items-center">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '30rem', objectFit: 'cover' }} 
            />
          ) : item.video ? (
            <video controls loop src={item.video} style={{ width: '100%', height: 'auto' }}></video>
          ) : (
            <div>
              <TextDisplay item={item.content} />
            </div>
          )}
        </div>
      </Card>
    </Modal>
  );
};

export default TimedModal;


