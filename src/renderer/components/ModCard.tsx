import React, { useState, useMemo } from 'react';
import '../App.scss';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { makeSelectModMetadataByName, updateDiffList } from '../redux/slices/modResourcesSlice';
import { openModEditModal } from '../redux/slices/modEditModalSlice';
import { useTranslation } from 'react-i18next';

type TActiveState = "active" | "inactive" | "preActive" | "preInactive";

interface ModCardProps {
  modName: string;
  diff: boolean | null;
}

const ModCard = ({ modName, diff }: ModCardProps) => {
  //console.log(`ModCard rendered: ${modName}`);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const selectMetadata = useMemo(() => makeSelectModMetadataByName(modName), [modName]);
  const modData = useAppSelector(selectMetadata);
  if (!modData) {
    console.error("ModCard: modData not found for modName:", modName);
  }

  const avatarName = modData?.modType === "Characters" ? t(`Characters.Nicknames.${modData.character}`) : t(`MenuItems.${modData.modType}`);

  const [isActive, setIsActive] = useState(diff!==null ? diff : modData?.active);

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
        <img 
          src={modData?.image && `mod-image://local/${modName}/${modData.image}` || require('../assets/default_cover.webp')} 
          alt="Mod Image" 
          className="CoverImage"
        />

        <div className={`InfoContainer CharacterCardStyle`}>
          <img 
            className="AvatarImage" 
            src={modData?.modType === "Characters" ? `character-image://local/${modData?.character}`:undefined}
            alt="Avatar Image"
          />
          <span className="AvatarNameText">{avatarName}</span>

          <div className="Title">{modName}</div>
          <div className="Desc">{modData?.description}</div>
        </div>
      </div>
    </>
  );

};

export default React.memo(ModCard);
