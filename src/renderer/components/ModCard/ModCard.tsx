import React, { useMemo } from 'react';
import './ModCard.css';
import { TMetadata } from '../../../types/metadataType';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectModMetadataByName } from '../../redux/modResources/modResourcesSlice';
import { openModEditModal } from '../../redux/modEditModal/modEditModalSlice';

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

  const dispatch = useAppDispatch();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("ModCard: handleContextMenu");
    dispatch(openModEditModal(modName));
  };

  return (
    <div className="ModCardContainer" onContextMenu={handleContextMenu}>
      <div className="ModCardTitle">{modData?.name || DEFAULT_MOD_NAME}</div>
      <div className="ModCardDesc">{modData?.description || DEFAULT_MOD_DESC}</div>
    </div>
  );

};
