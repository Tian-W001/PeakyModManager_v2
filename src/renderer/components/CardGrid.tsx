import React, { useCallback } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addNewMod, selectModMetadataList } from '../redux/slices/modResourcesSlice';
import { ModCard } from './ModCard';
import { ModEditModal } from './ModEditModal';

function CardGrid() {
  const dispatch = useAppDispatch();
  const metadataList = useAppSelector(selectModMetadataList);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    for (const item of e.dataTransfer.items) {
      if (item.kind === 'file' && (item.webkitGetAsEntry())?.isDirectory) {
        const file = item.getAsFile() as File;
        const srcPath = await window.electron.getModPath(file);
        dispatch(addNewMod({ modName: file.name, srcModPath: srcPath }));
      } else {
        console.log('Invalid mod directory');
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <>
      {console.log('CardGrid rendererd')}
      <div className="CardGridContainer" onDrop={handleDrop} onDragOver={handleDragOver}>

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
