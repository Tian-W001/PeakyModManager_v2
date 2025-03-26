import React from 'react';
import './ModCard.css';
import { TMetadata } from '../../../types/metadataType';
import { useAppSelector } from '../../redux/hooks';
import { selectModMetadataByName } from '../../redux/selectors/modResourcesSelectors';

interface ModCardProps {
  modName: string;
}

export const ModCard = ({ modName }: ModCardProps) => {

  const modData = useAppSelector(selectModMetadataByName(modName));
  if (!modData) {
    console.error("ModCard: modData not found for modName:", modName);
    return null;
  }

  return (
    <div className="ModCardContainer">
      <div className="ModCardTitle">{modData.name}</div>
      <div className="ModCardDesc">{modData.description}</div>
    </div>
  );

};
