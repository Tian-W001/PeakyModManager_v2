import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import "../App.css";
import ExitButton from "./ExitButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectGamePath, selectLanguage, selectLauncherPath, selectModResourcesPath, selectTargetPath, setLanguage, updateLauncherPath, updateModResourcesPath, updateTargetPath } from "../redux/slices/settingsSlice";
import { languageMap, TLanguage } from "../../types/languageType";

export const SettingsModal = ({ isOpen, onRequestClose }: { isOpen: boolean, onRequestClose: ()=>void }) => {
  const dispatch = useAppDispatch();

  const modResourcesPath = useAppSelector(selectModResourcesPath);
  const targetPath = useAppSelector(selectTargetPath);
  const launcherPath = useAppSelector(selectLauncherPath);
  //const gamePath = useAppSelector(selectGamePath);
  const language = useAppSelector(selectLanguage);


  const handleSelectModResourcesPath = async () => {
    const path = await window.electron.selectFolder();
    if (path) {
      dispatch(updateModResourcesPath(path));
    }
  };

  const handleSelectTargetPath = async () => {
    const path = await window.electron.selectFolder();
    if (path) {
      dispatch(updateTargetPath(path));
    }
  };

  const handleSelectLauncherPath = async () => {
    const path = await window.electron.selectFile("", ['exe']);
    if (path) {
      dispatch(updateLauncherPath(path));
    }
  };

  const handleSetLanguage = (newLanguage: TLanguage) => {
    dispatch(setLanguage(newLanguage));
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