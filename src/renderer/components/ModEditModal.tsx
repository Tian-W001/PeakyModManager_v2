import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import "../App.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectModEditModalModMetadata } from "../redux/slices/modEditModalSlice";
import { selectModEditModalIsOpen, selectModEditModalModName } from "../redux/slices/modEditModalSlice";
import { closeModEditModal } from "../redux/slices/modEditModalSlice";
import { deleteMod, updateMod } from "../redux/slices/modResourcesSlice";
import ExitButton from "./ExitButton";
import { EditableTextBox } from "./EditableTextBox";
import { TMetadata } from "../../types/metadataType";
import { characters, TCharacter } from "../../types/characterType";

Modal.setAppElement('#root');


const CharacterSelector = ({currentCharacter, setCharacter}: {currentCharacter: TCharacter, setCharacter: (c:TCharacter)=>void}) => {
  return (
    <>
      <span>Character: </span>
      <select value={currentCharacter} onChange={e=>setCharacter(e.target.value as TCharacter)}>
        {characters.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </>
  );
};



export const ModEditModal = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectModEditModalIsOpen);
  const modName = useAppSelector(selectModEditModalModName);
  const modData = useAppSelector(selectModEditModalModMetadata);
  
  const [newModData, setNewModData] = useState<TMetadata|undefined>(undefined);

  console.log("ModEditModal Rendered");

  useEffect(() => {
    setNewModData(modData);
  }, [modData]);

  const onRequestClose = () => {
    dispatch(closeModEditModal());
  };

  const handleSave = () => {
    if (!modName || !modData) return;

    dispatch(updateMod({
      modName, newMetadata: { //replace the old metadata with the new one
        ...modData,
        ...newModData,
      }
    }));
    onRequestClose();
  };

  const handleDelete = () => {
    console.log("Delete mod:", modName);
    if (!modName) return;
    dispatch(deleteMod(modName));
    onRequestClose();
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ModalOverlay"
      className="ModalContainer"
      shouldCloseOnOverlayClick={false}
    >
      <ExitButton onClick={onRequestClose} className="ModalExitButton"/>
      <div className="Modal ModalShape flexCol">
        <div className="ModEditModalTitleBar">
          {modName}
        </div>
        <div className="ModEditModalMainContainer">

          <div className="ModEditModalLeftContainer">
            {newModData && (
              <>
                <EditableTextBox title="Description" text={newModData?.description} 
                  handleChange={(e) => {
                    setNewModData({ ...newModData, description: e.target.value });
                  }}
                />
                <EditableTextBox title="Source" text={newModData?.sourceUrl}
                  handleChange={(e) => {
                    setNewModData({ ...newModData, sourceUrl: e.target.value });
                  }}
                />
                <CharacterSelector currentCharacter={newModData?.character} setCharacter={c=>setNewModData({...newModData, character: c})} />
              </>
            )}
          </div>

          <div className="ModEditModalRightContainer">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete}>Delete</button>
          </div>

        </div>
      </div>
      
    </Modal>
  );
};
