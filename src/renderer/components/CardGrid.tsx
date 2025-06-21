import React, { useCallback, useMemo } from 'react';
import '../App.scss';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addNewMod, selectDiffList, selectModMetadataList } from '../redux/slices/modResourcesSlice';
import ModCard from './ModCard';
import ModEditModal from './ModEditModal';
import CharacterBar from './CharacterBar';
import { selectCurrentCharacter, selectCurrentModType } from '../redux/slices/menuSlice';
import { Scrollbar } from 'react-scrollbars-custom';
import { openModEditModal } from '../redux/slices/modEditModalSlice';

const CardGrid: React.FC = () =>{
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

  const diffList = useAppSelector(selectDiffList);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (items.length !== 1) return;
    const item = items[0];
    const entry = item.webkitGetAsEntry();
    
    if (item.kind !== 'file' || !entry?.isDirectory) return;
    
    const file = item.getAsFile() as File;
    const srcPath = await window.electron.getModPath(file);
    await dispatch(addNewMod({ modName: file.name, srcModPath: srcPath }));
    dispatch(openModEditModal(file.name));

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
        <Scrollbar
          key={currentModType + '-' + currentCharacter} //force re-mount
          className='Scrollbar'
          noDefaultStyles 
          noScrollX={true}
          noScrollY={false}
          wrapperProps={{ className: "Wrapper" }}
          trackYProps={{ className: 'Track' }}
          thumbYProps={{ className: 'Thumb' }}
        >
          <div 
            className="CardGrid"
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
          >
            {
              filteredModNameList.map(modName => (
                <ModCard key={modName} modName={modName} diff={diffList[modName] ?? null}/>
              ))
            }
          </div>
        </Scrollbar>
        <ModEditModal />
        
      </div>
    </>
  );
}

export default CardGrid;
