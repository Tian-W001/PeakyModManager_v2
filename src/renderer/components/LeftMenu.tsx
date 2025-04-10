import React from 'react';
import '../App.css';
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCurrentModType, updateSelectedModType } from '../redux/slices/menuSlice';
import { modTypeList, TModType } from '../../types/modType';


interface MenuButtonProps { 
  direction: "UP"|"DOWN",
  active: boolean,
  onClick: ()=>void,
}
const MenuButton = ({ direction, active, onClick }: MenuButtonProps) => {

  return (
    <button onClick={onClick} disabled={!active} className={`MenuButton ${direction==='UP' ? 'up' : 'down'}`} >
      {direction==="UP" ? 
        <TiArrowSortedUp size={"80%"} /> : 
        <TiArrowSortedDown size={"80%"} />}
    </button>
  );
};

const MenuList = ({ currentModType }: {currentModType: TModType}) => {
  const dispatch = useAppDispatch();
  const handleSelectModType = (newModType: TModType) => {
    dispatch(updateSelectedModType(newModType));
  }

  return (
    <div className="MenuList">
      {modTypeList.map((modType, index) => (
        <MenuItem key={index} 
          active={currentModType === modType}
          onClick={()=>handleSelectModType(modType)}
        >
          <span>
            {modType}
          </span>
        </MenuItem>
      ))}
    </div>
  );
};

const MenuItem = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: ()=>void }) => {

  return (
    <div onClick={onClick} className={`MenuItem ${active?'active':''}`} >
      {children}
    </div>
  );
};

const Menu = () => {
  const dispatch = useAppDispatch();

  const currentModType = useAppSelector(selectCurrentModType);

  //updated via rerender
  const currentIndex = modTypeList.indexOf(currentModType);

  const handleSelectUp = () => {
    dispatch(updateSelectedModType(modTypeList[currentIndex - 1]));
  };

  const handleSelectDown = () => {
    dispatch(updateSelectedModType(modTypeList[currentIndex + 1]));
  }

  return (
    <div className="MenuBox">
      <MenuButton direction='UP' active={currentIndex!==0} onClick={handleSelectUp}/>
      <MenuList currentModType={currentModType} />
      <MenuButton direction='DOWN' active={currentIndex!==modTypeList.length-1} onClick={handleSelectDown}/>
    </div>
  );
};


function LeftMenu() {

  return (
    <>
      {console.log('BottomBar rendererd')}
      <div className="LeftMenuContainer">
        <Menu />
      </div>
    </>
  );
}

export default LeftMenu;
