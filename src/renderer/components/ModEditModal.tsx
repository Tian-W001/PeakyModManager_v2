import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

import "../App.scss";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectModEditModalModMetadata } from "../redux/slices/modEditModalSlice";
import { selectModEditModalIsOpen, selectModEditModalModName } from "../redux/slices/modEditModalSlice";
import { closeModEditModal } from "../redux/slices/modEditModalSlice";
import { deleteMod, updateMod } from "../redux/slices/modResourcesSlice";
import ExitButton from "./ExitButton";
import EditableTextBox from "./EditableTextBox";
import { DEFAULT_METADATA, TMetadata } from "../../types/metadataType";
import { DEFAULT_KEYBIND_KEY, DEFAULT_KEYBIND_DESC, TKeybinds } from "../../types/KeybindType";
import { selectModResourcesPath } from "../redux/slices/settingsSlice";
import path from "path-browserify";
import { modTypeList, TModType } from "../../types/modType";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { TTranslations } from "../translations/translations";
import { MdDeleteForever } from "react-icons/md";
import { t } from "i18next";
import { selectCharacters } from "../redux/slices/hotUpdatesSlice";

Modal.setAppElement('#root');


const CharacterSelector = ({currentCharacter, setCharacter}: {currentCharacter: string | null, setCharacter: (c:string)=>void}) => {
  
  const { t } = useTranslation();
  const characters = useAppSelector(selectCharacters);
  if (currentCharacter === null) return null;
  return (
    <>
      <span>{t("ModEditModal.Character")}</span>
      <select value={currentCharacter || undefined} onChange={e=>setCharacter(e.target.value)}>
        {characters?.map((c) => (
          <option key={c} value={c}>
            {t(`Characters.Fullnames.${c}`)}
          </option>
        ))}
      </select>
    </>
  );
};

const ModTypeSelector = ({currentType, setModType}: {currentType: TModType, setModType: (t:TModType)=>void}) => {
  return (
    <>
      <span>{t("ModEditModal.ModType")}</span>
        <select value={currentType} onChange={e=>setModType(e.target.value as TModType)}>
          {modTypeList.map((modType) => (
            <option key={modType} value={modType}>
              {t(`MenuItems.${modType}`)}
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
    if (e.shiftKey) return `Shift+${key}`;
    if (e.altKey)   return `Alt+${key}`;
    return key;
  };

  const handleKeyInput = () => {

    const listener = (e: KeyboardEvent) => {
      e.preventDefault();
      if (['Control', 'Shift', 'Alt', 'Meta', 'Tab'].includes(e.key)) {
        return;
      }
      const newKeybind = getKeybind(e);
      if (newKeybind && newKeybind !== 'Escape') {
        setKey(newKeybind);
        descInputRef.current?.focus();
      }
      keyInputRef.current?.blur();
    };

    listenerRef.current = listener;
    window.addEventListener("keydown", listener);
  };

  const handleKeyInputOnBlur = () => {
    if (listenerRef.current) {
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

interface KeybindMenuListProps {
  keybinds: TKeybinds, 
  setKeybinds: (newKeybinds: TKeybinds) => void,
};
const KeybindMenuList = ({ keybinds, setKeybinds }: KeybindMenuListProps) => {

  const handleSetKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) {
      console.error("Same keybind!");
      return;
    }
    const { [oldKey]: desc, ...rest } = keybinds;
    setKeybinds({ ...rest, [newKey]: desc });
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
      <button onClick={handleAddKeybind}>
        { t("ModEditModal.AddNewKeybind") }
      </button>
    </div>
  );
};


const ModEditModal = () => {
  const dispatch = useAppDispatch();

  const characters = useAppSelector(selectCharacters);
  const isOpen = useAppSelector(selectModEditModalIsOpen);

  const modResourcesPath = useAppSelector(selectModResourcesPath);
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

  const handleSelectCover = async () => {
    if (!modName || !newModData) return;

    const imgPath: string = await window.electron.selectFile(
      path.join(modResourcesPath, modName).replace(/\//g, '\\'), // use windows '\'
      ['png', 'jpg', 'jpeg', 'webp']
    );
    if (!imgPath) return;

    const imgName = path.basename(imgPath.replace(/\\/g, '/')); // use posix '/' for path-browserify
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

  function matchCharacterName(): string|null {
    if (!modName || !characters) return null;
    
    const characterList = characters.filter(name => name !== "Unknown");
    const loweredModName = modName.toLowerCase();
    for (const charName of characterList) {
      if (loweredModName.includes(charName.toLowerCase())) {
        return charName;
      }
    }
    return null;
  }
  const handleAutoFillModData = async () => {
    if (!newModData) return;

    const autoFillData: Partial<TMetadata> = {};

    if (newModData.modType === DEFAULT_METADATA.modType) {
      const charName = matchCharacterName();
      if (charName) {
        autoFillData.modType = "Characters",
        autoFillData.character = charName;
      }
    }

    if (newModData.description === DEFAULT_METADATA.description) {
      const readmeContent = await window.electron.getReadmeContent(modName);
      if (readmeContent) {
        autoFillData.description = readmeContent;
      }
    }

    if (newModData.image === DEFAULT_METADATA.image) {
      const firstImage = await window.electron.getFirstImage(modName);
      if (firstImage) {
        autoFillData.image = firstImage;
      }
    }

    setNewModData({ ...newModData, ...autoFillData });
  }

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

  const handleDragOverImage = (e: React.DragEvent) => {
    console.log("DragOver");
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const handleDropImage = async (e: React.DragEvent) => {
    console.log("Drop");
    e.preventDefault();
    for (const item of e.dataTransfer.items) {
      if (item.kind === 'file' && (item.webkitGetAsEntry())?.isFile) {
        const file = item.getAsFile() as File;
        const srcPath = await window.electron.getModPath(file);
        if (srcPath) {
          if (await window.electron.copyCoverImage(modName, srcPath)) {
            const imgName = path.basename(srcPath.replace(/\\/g, '/')); // use posix '/' for path-browserify
            if (!modName || !newModData) return;
            setNewModData({ ...newModData, image: imgName });
          }
        }
      }
    }
  }

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
      <div className="Modal flexCol">
        <div className="ModEditModalTitleBar">
          {modName}
        </div>
        <div className="ModEditModalMainContainer">

          <div className="ModEditModalLeftContainer">
            {newModData && (
              <>
                <EditableTextBox title={t("ModEditModal.Description")} text={newModData?.description} 
                  handleChange={(e) => {
                    setNewModData({ ...newModData, description: e.target.value });
                  }}
                />
                <EditableTextBox title={t("ModEditModal.Source")} text={newModData?.sourceUrl}
                  handleChange={(e) => {
                    setNewModData({ ...newModData, sourceUrl: e.target.value });
                  }}
                />
                <ModTypeSelector currentType={newModData?.modType} setModType={t=>setNewModData({...newModData, modType: t, character: t==="Characters"?"Unknown":null})} />


                <CharacterSelector currentCharacter={newModData?.character} setCharacter={c=>setNewModData({...newModData, character: c})} />
                <KeybindMenuList keybinds={newModData.keybinds} setKeybinds={(newKeybinds)=>setNewModData({...newModData, keybinds: newKeybinds})} />
                <button onClick={handleAutoFillModData}>{t("ModEditModal.AutoFillModInfo")}</button>
              </>
            )}
          </div>

          <div className="ModEditModalRightContainer" >
            <div className="ModEditModalImageContainer" onDragOver={handleDragOverImage} onDrop={handleDropImage}>
              <div className="ButtonGroup">
                <button className="DeleteButtonContainer" onClick={handleRemoveCover}>
                  <MdDeleteForever size={"90%"}/>
                </button>
                <button className="SelectImageButtonContainer" onClick={handleSelectCover}>
                  {t("ModEditModal.SelectImage")}
                </button>
              </div>
              <img src={modName && newModData?.image && `mod-image://local/${modName}/${newModData.image}` || require('../assets/default_cover.webp')} alt="Mod Image" />
            </div>
            <div className="ButtonGroup">
              <Button title={t("ModEditModal.Delete")} onClick={handleDelete} />
              <Button title={t("ModEditModal.Save")} onClick={handleSave} />
              <Button title={t("ModEditModal.OpenFolder")} onClick={handleOpenModFolder} />
            </div>
          </div>

        </div>
      </div>
      
    </Modal>
  );
};

export default ModEditModal;
