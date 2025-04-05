import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import "../App.css";
import ExitButton from "./ExitButton";

export const SettingsModal = ({ isOpen, onRequestClose }: { isOpen: boolean, onRequestClose: ()=>void }) => {

  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ModalOverlay"
      className="ModalContainer"
      shouldCloseOnOverlayClick={false}
    >
      <ExitButton onClick={onRequestClose} className="ModalExitButton"/>
      <div className="Modal ModalShape">
        <h1>Settings</h1>
      </div>
      
    </Modal>
  );
};