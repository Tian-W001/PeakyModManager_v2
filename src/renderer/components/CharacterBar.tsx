import React, { useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Characters, TCharacter } from "../../types/characterType";
import activeMask from "./../assets/character_images/character_active_mask.png";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentCharacter, updateSelectedCharacter } from "../redux/slices/menuSlice";

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
  c: TCharacter|"All",
  onClick: () => void,
}
const CharacterItem = ({active, c, onClick}: CharacterItemProps) => (
  <div className="CharacterBarImageContainer" key={c} onClick={onClick}>
    <img 
      src={require(`./../assets/character_images/${c}.png`)} 
      alt='Character'
    />
    <div 
      className={`CharacterActiveMask ${active?"active":""}`}
      style={{
        // opacity: active ? 1 : 0,
        background: `url(${activeMask}) no-repeat 0 0 / 101% 101%`
      }}  
    />
  </div>
);

const CharacterBar = () => {
  const dispatch = useAppDispatch();
  const selectedCharacter = useAppSelector(selectCurrentCharacter);
  const scrollRef = useHorizontalScroll();

  const handleOnClickImage = (c: TCharacter|"All") => {
    console.log("Clicked", c);
    dispatch(updateSelectedCharacter(c));
  }

  return (
    <div className="CharacterBarContainer">
      <div className="CharacterBarButtonContainer">
        <FaAngleLeft size={'20px'} color="#ffffff" />
      </div>
      <div className="CharacterBarImageList" ref={scrollRef}>
        <CharacterItem key={"All"} active={selectedCharacter==="All"} c={"All"} onClick={()=>handleOnClickImage("All")} />
        {Characters.slice().reverse().map((c: TCharacter) => 
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