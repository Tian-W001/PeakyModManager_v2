import React from 'react';
import './ModCard.css';
import { TMetadata } from '../../../types/metadataType';
import { useAppSelector } from '../../redux/hooks';
import { selectModMetadataByName } from '../../redux/selectors/modResourcesSelectors';

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

  return (
    <div className="ModCardContainer">
      <div className="ModCardTitle">{modData?.name || DEFAULT_MOD_NAME}</div>
      <div className="ModCardDesc">{modData?.description || DEFAULT_MOD_DESC}</div>
    </div>
  );

};
