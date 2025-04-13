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
import { DEFAULT_METADATA, TMetadata } from "../../types/metadataType";
import { characters, TCharacter } from "../../types/characterType";
import { DEFAULT_KEYBIND_KEY, DEFAULT_KEYBIND_DESC, TKeybinds } from "../../types/KeybindType";
import { selectModResourcesPath } from "../redux/slices/settingsSlice";
import path from "path-browserify";
import { modTypeList, TModType } from "../../types/modType";

Modal.setAppElement('#root');


const CharacterSelector = ({currentCharacter, setCharacter}: {currentCharacter: TCharacter, setCharacter: (c:TCharacter)=>void}) => {
  if (currentCharacter === null) return;
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

const ModTypeSelector = ({currentType, setModType}: {currentType: TModType, setModType: (t:TModType)=>void}) => {
  return (
    <>
      <span>modType: </span>
        <select value={currentType} onChange={e=>setModType(e.target.value as TModType)}>
          {modTypeList.map((t) => (
            <option key={t} value={t}>
              {t}
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
};
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
    setKeybinds({ ...keybinds, [DEFAULT_KEYBIND_KEY]: DEFAULT_KEYBIND_DESC});
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

  const modResourcesPath = useAppSelector(selectModResourcesPath);
  const modName = useAppSelector(selectModEditModalModName);
  const modData = useAppSelector(selectModEditModalModMetadata);
  
  const [newModData, setNewModData] = useState<TMetadata|undefined>(undefined);
  const [modImageData, setModImageData] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!modName) return;
    if (newModData?.image) {
      console.log("fetch image for:", modName);
      window.electron.fetchImage(path.join(modResourcesPath, modName, newModData.image))
        .then(setModImageData);
    }
  }, [newModData?.image]);

  console.log("ModEditModal Rendered");

  useEffect(() => {
    setNewModData(modData);
  }, [modData]);

  const onRequestClose = () => {
    dispatch(closeModEditModal());
  };

  const handleSelectCover = async () => {
    if (!modName || !newModData) return;

    const imgPath: string = await window.electron.selectFile(
      path.join(modResourcesPath, modName).replace(/\//g, '\\'), // use windows '\'
      ['png', 'jpg', 'jpeg', 'webp']
    );
    if (!imgPath) return;
    console.log("imgPath", imgPath);

    const imgName = path.basename(imgPath.replace(/\\/g, '/')); // use posix '/' for path-browserify
    console.log("imgname:", imgName);
    setNewModData({ ...newModData, image: imgName });
  }

  const handleRemoveCover = () => {
    if (!modName || !newModData) return;
    setNewModData({ ...newModData, image: DEFAULT_METADATA.image });
  }

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

  const handleOpenModFolder = () => {
    if (modName) {
      window.electron.openFileExplorer(path.join(modResourcesPath, modName));
    }
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
                <ModTypeSelector currentType={newModData?.modType} setModType={t=>setNewModData({...newModData, modType: t, character: t==="Characters"?"Unknown":null})} />


                <CharacterSelector currentCharacter={newModData?.character} setCharacter={c=>setNewModData({...newModData, character: c})} />
                <KeybindMenuList keybinds={newModData.keybinds} setKeybinds={(newKeybinds)=>setNewModData({...newModData, keybinds: newKeybinds})} />
              </>
            )}
          </div>

          <div className="ModEditModalRightContainer">
            <img src={modImageData} alt="Mod Image" className="ModCardImage" />
            <button onClick={handleSelectCover}>Select Cover</button>
            <button onClick={handleRemoveCover}>Remove Cover</button>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleOpenModFolder}>Open in File Explorer</button>
            <button onClick={handleDelete}>Delete</button>
          </div>

        </div>
      </div>
      
    </Modal>
  );
};
