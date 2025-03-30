import React from 'react';
import './CardGrid.css';
import { useAppSelector } from '../../redux/hooks';
import { selectModMetadataList } from '../../redux/modResources/modResourcesSlice';
import { ModCard } from '../ModCard/ModCard';
import { ModEditModal } from '../ModEditModal/ModEditModal';

function CardGrid() {
  const metadataList = useAppSelector(selectModMetadataList);

  

  const toggleApplyMod = (modName: string) => {
    console.log('toggleApplyMod:', modName);
  };

  const openEditModModal = (modName: string) => {
    console.log('openEditModModal:', modName);
  };

  return (
    <>
      {console.log('CardGrid rendererd')}
      <div className="CardGridContainer">

        {metadataList.map((metadata) => (
          <ModCard key={metadata.name} modName={metadata.name} />
        ))}

      </div>
      <ModEditModal />
    </>
  );
}

export default CardGrid;
