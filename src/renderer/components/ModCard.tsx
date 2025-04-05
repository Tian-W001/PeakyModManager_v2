import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectModResourcesPath } from '../redux/slices/settingsSlice';
import { selectModMetadataByName } from '../redux/slices/modResourcesSlice';
import { openModEditModal } from '../redux/slices/modEditModalSlice';
import path from 'path-browserify';


const DEFAULT_MOD_NAME = "Default Mod Name";
const DEFAULT_MOD_DESC = "Default Mod Description";

interface ModCardProps {
  modName: string;
}

export const ModCard = ({ modName }: ModCardProps) => {

  const modResourcesPath = useAppSelector(selectModResourcesPath);
  const modData = useAppSelector(selectModMetadataByName(modName));
  if (!modData) {
    console.error("ModCard: modData not found for modName:", modName);
  }

  //Load mod image
  const [modImageData, setModImageData] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (modData?.image) {
      console.log("fetch image for:", modName);
      window.electron.fetchImage(path.join(modResourcesPath, modName, modData.image))
        .then(setModImageData);
    }
  }, [modData?.image]);

  const dispatch = useAppDispatch();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(openModEditModal(modName));
  };

  return (
    <div className="ModCardContainer" onContextMenu={handleContextMenu}>
      <div className="ModCardTitle">{modName || DEFAULT_MOD_NAME}</div>
      <div className="ModCardDesc">{modData?.description || DEFAULT_MOD_DESC}</div>
      <img src={modImageData} alt="Mod Image" className="ModCardImage" />
    </div>
  );

};
