import React, { CSSProperties, StyleHTMLAttributes, useEffect, useState } from "react";
import Modal from "react-modal";

import "../App.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectModEditModalModMetadata } from "../redux/slices/modEditModalSlice";
import { selectModEditModalIsOpen, selectModEditModalModName } from "../redux/slices/modEditModalSlice";
import { closeModEditModal } from "../redux/slices/modEditModalSlice";
import { updateMod } from "../redux/slices/modResourcesSlice";
import ExitButton from "./ExitButton";


Modal.setAppElement('#root');

export const ModEditModal = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectModEditModalIsOpen);
  const modName = useAppSelector(selectModEditModalModName);
  const modData = useAppSelector(selectModEditModalModMetadata);
  
  const [desc, setDesc] = useState(modData?.description || "");

  console.log("ModEditModal Rendered");

  useEffect(() => {
    setDesc(modData?.description || "");
  }, [modData]);

  const onRequestClose = () => {
    dispatch(closeModEditModal());
  };

  const handleSave = () => {
    console.log("Save mod with new desc:", desc);
    if (!modName || !modData) return;

    dispatch(updateMod({
      modName, newMetadata: {
        ...modData,
        description: desc
      }
    }));
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ModEditModalOverlay"
      className="ModEditModalContainer"
      shouldCloseOnOverlayClick={false}
    >
      <ExitButton onClick={onRequestClose} className="ModalExitButton"/>
      <div className="ModEditModal ModalShape">
        
        {modData && (
          <div className="EditableTextBox">
            <span>Description:</span>
            <textarea
              id="description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        )}
        <button onClick={handleSave}>Save</button>
      </div>
      
    </Modal>
  );
};
