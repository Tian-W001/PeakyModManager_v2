import React, { useEffect, useRef, useState } from "react";
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
import { TKeybinds } from "../../types/KeybindType";

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

interface KeybindItemProps {
  currentkey: string;
  currentDesc: string;
  setKey: (newKey: string)=>void;
  setDesc: (newDesc: string)=>void;
}

const KeybindItem = ({ currentkey, currentDesc, setKey, setDesc }: KeybindItemProps) => {

  const listenerRef = useRef<(e: KeyboardEvent) => void | null>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  const getKeybind = (e: KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    if (e.ctrlKey)  return `Ctrl+${key}`;
    if (e.altKey)   return `Alt+${key}`;
    if (e.shiftKey) return `Shift+${key}`;
    return key;
  };

  const handleKeyInput = () => {

    const listener = (e: KeyboardEvent) => {
      e.preventDefault();
      if (['Control', 'Shift', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        return;
      }
      const newKeybind = getKeybind(e);
      if (newKeybind && newKeybind !== 'Escape') {
        setKey(newKeybind);
      }
      keyInputRef.current?.blur();
      descInputRef.current?.focus();
    };

    console.log("+++Add key listener+++");
    listenerRef.current = listener;
    window.addEventListener("keydown", listener);
  };

  const handleKeyInputOnBlur = () => {
    console.log("blur");
    if (listenerRef.current) {
      console.log("---Remove key listener---");
      window.removeEventListener("keydown", listenerRef.current);
    }
  }

  const handleDescChange = (newDesc: string) => {
    setDesc(newDesc);
  };
  
  return (
    <div className="KeybindItem">
      <input className="KeybindKeyInput"
        type="text"
        value={currentkey}
        onFocus={()=>handleKeyInput()}
        onBlur={handleKeyInputOnBlur}
        readOnly
        ref={keyInputRef}
      />
      <input className="KeybindDescInput"
        type="text"
        value={currentDesc}
        onChange={(e) => handleDescChange(e.target.value)}
        ref={descInputRef}
      />
    </div>
  );
};


const KeybindMenuList = ({ keybinds, setKeybinds }: { keybinds: TKeybinds, setKeybinds: (newKeybinds: TKeybinds) => void }) => {

  const handleSetKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) {
      console.error("Same keybind!");
      return;
    }
    const updatedKeybinds = ({[oldKey]: desc, ...rest}: TKeybinds) => ({...rest, [newKey]: desc});
    setKeybinds(updatedKeybinds(keybinds));
  }
  const handleSetDesc = (key: string, newDesc: string) => {
    setKeybinds({...keybinds, [key]: newDesc});
  }
  const handleAddKeybind = () => {
    setKeybinds({ ...keybinds, ['']: ''});
  };

  return (
    <div>
      {Object.entries(keybinds).map(([key, desc], index) => (
        <KeybindItem 
          key={index} 
          currentkey={key} 
          currentDesc={desc} 
          setKey={(newKeybind)=>handleSetKey(key, newKeybind)}
          setDesc={(newDesc)=>handleSetDesc(key, newDesc)}
        />
      ))}
      <button onClick={handleAddKeybind}> Add new Keybind</button>
    </div>
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
      shouldCloseOnEsc={false}
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
                <KeybindMenuList keybinds={newModData.keybinds} setKeybinds={(newKeybinds)=>setNewModData({...newModData, keybinds: newKeybinds})} />
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
