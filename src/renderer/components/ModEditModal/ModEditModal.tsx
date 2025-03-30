import React from "react";
import Modal from "react-modal";

import "./ModEditModal.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectModEditModalModMetadata } from "../../redux/modEditModal/modEditModalSlice";
import { selectModEditModalIsOpen, selectModEditModalModName } from "../../redux/modEditModal/modEditModalSlice";
import { closeModEditModal } from "../../redux/modEditModal/modEditModalSlice";


Modal.setAppElement('#root');

export const ModEditModal = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectModEditModalIsOpen);
  const modName = useAppSelector(selectModEditModalModName);
  const modData = useAppSelector(selectModEditModalModMetadata);
  console.log("ModEditModal: modData:", modData);

  const onRequestClose = () => {
    dispatch(closeModEditModal());
  };

  console.log("ModEditModal: modName:", modName);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ModEditModalOverlay"
      className="ModEditModal"
      shouldCloseOnOverlayClick={false}
    >
      {modData && (
        <>
          <div>{modData.name}</div>
          <div>{modData.description}</div>
          <div>{modData.character}</div>
        </>
      )}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};
