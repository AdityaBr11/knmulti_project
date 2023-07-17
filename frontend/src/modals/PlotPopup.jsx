import React from 'react';
import { ModalWrapper, Reoverlay } from 'reoverlay';

const PlotDetailsModal = ({ text, onConfirm }) => {
  const closeModal = () => {
    Reoverlay.hideModal();
  };

  return (
    <ModalWrapper>
      {text}
      <button onClick={onConfirm}>Yes</button>
      <button onClick={closeModal}>No</button>
    </ModalWrapper>
  );
};

export default PlotDetailsModal;
