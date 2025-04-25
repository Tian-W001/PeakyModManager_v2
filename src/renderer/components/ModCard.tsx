import React, { useState, useMemo } from 'react';
import '../App.scss';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectModResourcesPath } from '../redux/slices/settingsSlice';
import { selectModMetadataByName, updateDiffList } from '../redux/slices/modResourcesSlice';
import { openModEditModal } from '../redux/slices/modEditModalSlice';


const DEFAULT_MOD_NAME = "Default Mod Name";
const DEFAULT_MOD_DESC = "Default Mod Description";

type TActiveState = "active" | "inactive" | "preActive" | "preInactive";

interface ModCardProps {
  modName: string;
}

export const ModCard = ({ modName }: ModCardProps) => {
  console.log(`ModCard ${modName} rendered`);

  const dispatch = useAppDispatch();
  
  const modData = useAppSelector(selectModMetadataByName(modName));
  if (!modData) {
    console.error("ModCard: modData not found for modName:", modName);
  }

  //updated by re-render
  const [isActive, setIsActive] = useState(modData?.active);


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

  const handleClick = (e: React.MouseEvent) => {
    setIsActive(!isActive);
    dispatch(updateDiffList({ modName, isActive: !isActive }));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(openModEditModal(modName));
  };

  return (
    <>
      <div className={`ModCardContainer ${cardActiveState}`} onClick={handleClick} onContextMenu={handleContextMenu}>
        <div className="ModCardTitle">{modName || DEFAULT_MOD_NAME}</div>
        <div className="ModCardDesc">{modData?.description || DEFAULT_MOD_DESC}</div>
        <img src={(modName&&modData?.image) && `mod-image://local/${modName}/${modData?.image}` || undefined} alt="Mod Image" className="ModCardImage" />
      </div>
    </>
  );

};
