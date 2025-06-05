import React, { useEffect, useState, useTransition } from "react";
import Modal from "react-modal";

import "../App.scss";
import ExitButton from "./ExitButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectGamePath, selectLauncherPath, selectModResourcesPath, selectTargetPath, updateLauncherPath, updateModResourcesPath, updateTargetPath } from "../redux/slices/settingsSlice";
import { languageMap, TLanguage } from "../../types/languageType";
import { clearDiffList, disableAllMods, fetchModResourcesMetadata, resetDiffList } from "../redux/slices/modResourcesSlice";
import { useTranslation } from "react-i18next";
import { fetchCharacters } from "../redux/slices/hotUpdatesSlice";
import EditableTextBox from "./EditableTextBox";


const SettingsModal = ({ isOpen, onRequestClose }: { isOpen: boolean, onRequestClose: ()=>void }) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const modResourcesPath = useAppSelector(selectModResourcesPath);
  const targetPath = useAppSelector(selectTargetPath);
  const launcherPath = useAppSelector(selectLauncherPath);
  //const gamePath = useAppSelector(selectGamePath);


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
    i18n.changeLanguage(newLang);
  }

  const handleFetchCharacters = async () => {
    await dispatch(fetchCharacters());
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
      <div className="Modal SettingsModal">
        <h1>{t("SettingsModal.Settings")}</h1>
        
        <EditableTextBox 
          readOnly
          title={t("SettingsModal.ResourcesDir")}
          text={modResourcesPath}
          onClick={handleSelectModResourcesPath}
          placeholder="Click to set modResources directory"
          rows={1}
        />
        <EditableTextBox 
          readOnly
          title={t("SettingsModal.TargetDir")}
          text={targetPath}
          onClick={handleSelectTargetPath}
          placeholder="Click to set target directory"
          rows={1}
        />
        <EditableTextBox 
          readOnly
          title={t("SettingsModal.LauncherDir")}
          text={launcherPath}
          onClick={handleSelectLauncherPath}
          placeholder="Click to set launcher directory"
          rows={1}
        />

        <label>{t("SettingsModal.Language")}:</label>
        <select value={i18n.language} onChange={(e)=>handleSetLanguage(e.target.value as TLanguage)}>
          {Object.entries(languageMap).map(([languageKey, languageString]) => (
            <option key={languageKey} value={languageKey}>{languageString}</option>
          ))}
        </select>

        <button onClick={handleFetchCharacters}>Fetch Characters</button>
      </div>
      
    </Modal>
  );
};
export default SettingsModal;
