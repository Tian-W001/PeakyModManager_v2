import React, { useState, useMemo, useEffect } from 'react';
import '../App.scss';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { makeSelectModMetadataByName, updateDiffList } from '../redux/slices/modResourcesSlice';
import { openModEditModal } from '../redux/slices/modEditModalSlice';
import { useTranslation } from 'react-i18next';
import { selectCharacters } from '../redux/slices/hotUpdatesSlice';

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

  const characters = useAppSelector(selectCharacters); //Force re-render after remote fetch
  const avatarName = modData?.modType === "Characters" ? t(`Characters.Nicknames.${modData.character}`) : t(`MenuItems.${modData.modType}`);
  const avatarImageSrc = useMemo(() => {
    if (modData?.modType === "Characters" && modData?.character !== "Unknown") {
      return `avatar-image://local/${modData.character}?now=${Date.now()}`;
    }
    else if (modData?.modType !== "Characters") {
      return require(`../assets/avatar_unknown.png`);
    }
    else {
      return require(`../assets/avatar_unknown.png`);
    }
  }, [modData?.modType, modData?.character, characters]);

  

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
            src={avatarImageSrc}
            alt={`${modData?.modType}`}
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
