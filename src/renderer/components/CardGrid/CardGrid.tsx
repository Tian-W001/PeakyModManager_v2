import React from 'react';
import './CardGrid.css';
import { useAppSelector } from '../../redux/hooks';
import { selectModMetadataList } from '../../redux/selectors/modResourcesSelectors';
import { ModCard } from '../ModCard/ModCard';

function CardGrid() {
  const metadataList = useAppSelector(selectModMetadataList);

  return (
    <>
      {console.log('CardGrid rendererd')}
      <div className="CardGridContainer">
        {metadataList.map((metadata) => (
          <ModCard key={metadata.name} modName={metadata.name} />
        ))}
      </div>
    </>
  );
}

export default CardGrid;
