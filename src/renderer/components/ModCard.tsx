import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectModMetadataByName } from '../redux/modResources/modResourcesSlice';
import { openModEditModal } from '../redux/modEditModal/modEditModalSlice';

const DEFAULT_MOD_NAME = "Default Mod Name";
const DEFAULT_MOD_DESC = "Default Mod Description";

interface ModCardProps {
  modName: string;
}

export const ModCard = ({ modName }: ModCardProps) => {

  const modData = useAppSelector(selectModMetadataByName(modName));
  if (!modData) {
    console.error("ModCard: modData not found for modName:", modName);
  }

  const [modImageData, setModImageData] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (modData?.image) {
      window.electron.fetchImage(modName, modData.image)
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
