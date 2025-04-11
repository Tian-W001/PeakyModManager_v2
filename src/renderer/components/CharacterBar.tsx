import React, { useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { characters, TCharacter } from "../../types/characterType";
import activeMask from "./../assets/character_images/character_active_mask.png";

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


const CharacterBar = () => {

  const scrollRef = useHorizontalScroll();
  const handleOnClickImage = (c: TCharacter) => {
    console.log("Clicked ", c);
  }

  return (
    <div className="CharacterBarContainer">
      <div className="CharacterBarButtonContainer">
        <FaAngleLeft size={'20px'} color="#ffffff" />
      </div>
      <div className="CharacterBarImageList" ref={scrollRef}>
        {characters.map(c => (
            <div className="CharacterBarImageContainer" key={c} onClick={()=>handleOnClickImage(c)}>
              <img 
                className="CharacterBarImage"
                src={require(`./../assets/character_images/${c}.png`)} 
                alt={c} 
              />
              
              <div 
                className="CharacterActiveMask"
                style={{
                  background: `url(${activeMask}) no-repeat 0 0 / 101% 101%`
                }}  
              />
            </div>
          )
        )}
      </div>
      <div className="CharacterBarButtonContainer">
        <FaAngleRight size={'20px'} color="#ffffff" />
      </div>
    </div>
  );
};

export default CharacterBar;