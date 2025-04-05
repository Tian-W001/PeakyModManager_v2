import React from 'react';
import '../App.css';
import { useAppSelector } from '../redux/hooks';
import { selectModMetadataList } from '../redux/slices/modResourcesSlice';
import { ModCard } from './ModCard';
import { ModEditModal } from './ModEditModal';

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

        {
          Object.keys(metadataList).map(modName => (
            <ModCard key={modName} modName={modName} />
          ))
        }

      </div>
      <ModEditModal />
    </>
  );
}

export default CardGrid;
