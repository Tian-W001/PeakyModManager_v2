import React, { useEffect, useMemo, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import activeMask from "./../assets/character_active_mask.png";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentCharacter, updateSelectedCharacter } from "../redux/slices/menuSlice";
import { selectCharacters } from "../redux/slices/hotUpdatesSlice";

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
  c: string,
  onClick: () => void,
}
const CharacterItem = ({active, c, onClick}: CharacterItemProps) => {

  const imageSrc = useMemo(() => {
    if (c === "All")
      return require(`./../assets/character_all.png`);
    else if (c === "Unknown")
      return require(`./../assets/character_unknown.png`);
    else
      return `character-image://local/${c}?now=${Date.now()}`;
  }, [c]);

  return (
    <div className="CharacterBarImageContainer" key={c} onClick={onClick}>
      <img 
        src={imageSrc}
        alt={require(`./../assets/character_unknown.png`)}
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
        <CharacterItem key={"All"} active={selectedCharacter==="All"} c={"All"} onClick={()=>handleOnClickImage("All")} />
        {characters?.slice().reverse().map((c: string) => 
          <CharacterItem key={c} active={selectedCharacter===c} c={c} onClick={()=>handleOnClickImage(c)} />
        )}
      </div>
      <div className="CharacterBarButtonContainer">
        <FaAngleRight size={'20px'} color="#ffffff" />
      </div>
    </div>
  );
};

export default CharacterBar;