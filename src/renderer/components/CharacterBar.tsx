import React, { useEffect, useMemo, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import activeMask from "./../assets/character_active_mask.png";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentCharacter, updateSelectedCharacter } from "../redux/slices/menuSlice";
import { selectCharacters } from "../redux/slices/hotUpdatesSlice";

import allCharactersImage from '../assets/character_all.png';
import unknownCharacterImage from '../assets/character_unknown.png';


function useHorizontalScroll(): React.RefObject<HTMLDivElement | null> {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
      })
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return elRef;
}

interface CharacterItemProps {
  active: boolean
  char: string,
  onClick: () => void,
}
const CharacterItem = ({active, char, onClick}: CharacterItemProps) => {

  const imageSrc = useMemo(() => {
    if (char === "All")
      return allCharactersImage;
    else if (char === "Unknown")
      return unknownCharacterImage;
    else
      return `character-image://local/${char}?now=${Date.now()}`;
  }, [char]);

  return (
    <div className="CharacterBarImageContainer" key={char} onClick={onClick}>
      <img 
        src={imageSrc}
        alt={char}
        onError={(e) => {
          e.currentTarget.src = unknownCharacterImage; // Fallback to unknown image
        }}
      />
      <div 
        className={`CharacterActiveMask ${active?"active":""}`}
        style={{
          background: `url(${activeMask}) no-repeat 0 0 / 101% 101%`
        }}
      />
    </div>
  );
};

const CharacterBar = () => {
  const dispatch = useAppDispatch();
  const characters = useAppSelector(selectCharacters);
  const selectedCharacter = useAppSelector(selectCurrentCharacter);
  const scrollRef = useHorizontalScroll();

  const handleOnClickImage = (c: string) => {
    dispatch(updateSelectedCharacter(c));
  }

  console.log("CharacterBar rendered");
  return (
    <div className="CharacterBarContainer">
      <div className="CharacterBarButtonContainer">
        <FaAngleLeft size={'20px'} color="#ffffff" />
      </div>
      <div className="CharacterBarImageList" ref={scrollRef}>
        <CharacterItem key={"All"} active={selectedCharacter==="All"} char={"All"} onClick={()=>handleOnClickImage("All")} />
        {characters?.slice().reverse().map((c: string) => 
          <CharacterItem key={c} active={selectedCharacter===c} char={c} onClick={()=>handleOnClickImage(c)} />
        )}
      </div>
      <div className="CharacterBarButtonContainer">
        <FaAngleRight size={'20px'} color="#ffffff" />
      </div>
    </div>
  );
};

export default CharacterBar;