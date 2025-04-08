import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectModResourcesPath } from '../redux/slices/settingsSlice';
import { selectModMetadataByName, updateDiffList } from '../redux/slices/modResourcesSlice';
import { openModEditModal } from '../redux/slices/modEditModalSlice';
import path from 'path-browserify';


const DEFAULT_MOD_NAME = "Default Mod Name";
const DEFAULT_MOD_DESC = "Default Mod Description";

type TActiveState = "active" | "inactive" | "preActive" | "preInactive";

interface ModCardProps {
  modName: string;
}

export const ModCard = ({ modName }: ModCardProps) => {
  console.log(`ModCard ${modName} rendered`);

  const dispatch = useAppDispatch();
  
  const modResourcesPath = useAppSelector(selectModResourcesPath);
  const modData = useAppSelector(selectModMetadataByName(modName));
  if (!modData) {
    console.error("ModCard: modData not found for modName:", modName);
  }
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (modData?.active) {
      setIsActive(modData.active);
    }
  }, [modData?.active]);

  const cardActiveState = useMemo(() => {
    if (modData?.active !== undefined) {
      if (modData.active && isActive)
        return "active";
      if (!modData.active && !isActive)
        return "inactive";
      if (modData.active && !isActive)
        return "preInactive";
      if (!modData.active && isActive)
        return "preActive";
    }
    else {
      return "inactive";
    }
  }, [modData?.active, isActive]) as TActiveState;

  //Load mod image
  const [modImageData, setModImageData] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (modData?.image) {
      console.log("fetch image for:", modName);
      window.electron.fetchImage(path.join(modResourcesPath, modName, modData.image))
        .then(setModImageData);
    }
  }, [modData?.image]);


  const handleClick = (e: React.MouseEvent) => {
    setIsActive(!isActive);
    dispatch(updateDiffList({ modName, isActive: !isActive }));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(openModEditModal(modName));
  };

  return (
    <div className={`ModCardContainer ${cardActiveState}`} onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className="ModCardTitle">{modName || DEFAULT_MOD_NAME}</div>
      <div className="ModCardDesc">{modData?.description || DEFAULT_MOD_DESC}</div>
      <img src={modImageData} alt="Mod Image" className="" />
    </div>
  );

};
