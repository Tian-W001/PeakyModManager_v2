import React, { useCallback, useMemo } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addNewMod, selectModMetadataList } from '../redux/slices/modResourcesSlice';
import { ModCard } from './ModCard';
import { ModEditModal } from './ModEditModal';
import CharacterBar from './CharacterBar';
import { selectCurrentCharacter, selectCurrentModType } from '../redux/slices/menuSlice';

function CardGrid() {
  const dispatch = useAppDispatch(); 

  const currentModType = useAppSelector(selectCurrentModType);
  const currentCharacter = useAppSelector(selectCurrentCharacter);
  const metadataList = useAppSelector(selectModMetadataList);

  const filteredModNameList = useMemo(() => {
      if (currentModType === "All") {
        return Object.keys(metadataList);
      }
      else if (currentModType === "Characters" && currentCharacter !== "All") {
        return Object.entries(metadataList)
          .filter(([__dirname, metadata]) => (metadata.modType === currentModType && metadata.character === currentCharacter))
          .map(([modName]) => modName);
      }
      else {
        return Object.entries(metadataList)
          .filter(([_, metadata]) => metadata.modType === currentModType)
          .map(([modName]) => modName);
      }
    }, [metadataList, currentModType, currentCharacter]
  );

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
      <div className="CardGridContainer">

          {currentModType === "Characters" && 
            <div className="CardGridTopBar">
              <CharacterBar />
            </div>
          }
          <div className="CardGrid" onDrop={handleDrop} onDragOver={handleDragOver}>

            {
              filteredModNameList.map(modName => (
                <ModCard key={modName} modName={modName} />
              ))
            }

          </div>
          <ModEditModal />
        
      </div>
    </>
  );
}

export default CardGrid;
