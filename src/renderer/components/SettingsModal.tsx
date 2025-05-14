import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import "../App.scss";
import ExitButton from "./ExitButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectGamePath, selectLanguage, selectLauncherPath, selectModResourcesPath, selectTargetPath, updateLanguage, updateLauncherPath, updateModResourcesPath, updateTargetPath } from "../redux/slices/settingsSlice";
import { languageMap, TLanguage } from "../../types/languageType";
import { clearDiffList, disableAllMods, fetchModResourcesMetadata, resetDiffList } from "../redux/slices/modResourcesSlice";

const SettingsModal = ({ isOpen, onRequestClose }: { isOpen: boolean, onRequestClose: ()=>void }) => {
  const dispatch = useAppDispatch();

  const modResourcesPath = useAppSelector(selectModResourcesPath);
  const targetPath = useAppSelector(selectTargetPath);
  const launcherPath = useAppSelector(selectLauncherPath);
  //const gamePath = useAppSelector(selectGamePath);
  const language = useAppSelector(selectLanguage);


  const handleSelectModResourcesPath = async () => {
    const path = await window.electron.selectFolder();
    if (path && path !== modResourcesPath) {
      await dispatch(updateModResourcesPath(path));
      // refetch from the new path and update metadataList in redux
      await dispatch(fetchModResourcesMetadata());
      // clear diffList
      dispatch(clearDiffList());
      // rebuild diffList based on the assumption of empty targetFolder
      dispatch(resetDiffList());
      // clear target folder & write false to all mod.active
      await dispatch(disableAllMods());
    }
  };

  const handleSelectTargetPath = async () => {
    const path = await window.electron.selectFolder();
    if (path && path !== targetPath) {
      // rebuild diffList based on the assumption of empty targetFolder
      dispatch(resetDiffList());
      // clear old target folder & write false to all mod.active
      await dispatch(disableAllMods()); 

      await dispatch(updateTargetPath(path));
    }

  };

  const handleSelectLauncherPath = async () => {
    const path = await window.electron.selectFile("", ['exe']);
    if (path) {
      dispatch(updateLauncherPath(path));
    }
  };

  const handleSetLanguage = (newLang: TLanguage) => {
    dispatch(updateLanguage(newLang));
  }

  const handleFetchCharacters = async () => {
    const data = await window.electron.fetchCharacters();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="ModalOverlay"
      className="ModalContainer"
      shouldCloseOnOverlayClick={false}
    >
      <ExitButton onClick={onRequestClose} className="ModalExitButton"/>
      <div className="Modal flexCol ModalShape">
        <h1>Settings</h1>
        <button onClick={handleFetchCharacters}>Fetch Characters</button>
        <label>ModResources Directory</label>
        <input 
          readOnly
          type="text"
          placeholder="Click to set modResources directory"
          value={modResourcesPath}
          onClick={handleSelectModResourcesPath}
        />

        <label>Target Directory</label>
        <input 
          readOnly
          type="text"
          placeholder="Click to set target directory"
          value={targetPath}
          onClick={handleSelectTargetPath}
        />

        <label>Launcher Directory</label>
        <input
          readOnly
          type="text"
          placeholder="Click to set launcher directory"
          value={launcherPath}
          onClick={handleSelectLauncherPath}
        />

        <label>Language</label>
        <select value={language} onChange={(e)=>handleSetLanguage(e.target.value as TLanguage)}>
          {Object.entries(languageMap).map(([languageKey, languageString]) => (
            <option key={languageKey} value={languageKey}>{languageString}</option>
          ))}
        </select>
      </div>
      
    </Modal>
  );
};
export default SettingsModal;
