import React from 'react';
import '../App.css';
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCurrentModType, updateSelectedModType } from '../redux/slices/menuSlice';
import { modTypeList, TModType } from '../../types/modType';
import { useTranslation } from 'react-i18next';
import { TTranslations } from '../translations/translations';


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

interface MenuListProps {
  menuListItems: (TModType|"All")[], 
  currentModType: TModType|"All",
};
const MenuList = ({ menuListItems, currentModType }: MenuListProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const menuField = "menuItems" satisfies keyof TTranslations;

  const handleSelectModType = (newModType: TModType|"All") => {
    dispatch(updateSelectedModType(newModType));
  }

  return (
    <div className="MenuList">
      {menuListItems.map((modType, index) => (
        <MenuItem key={index} 
          active={currentModType === modType}
          onClick={()=>handleSelectModType(modType)}
        >
          <span>
            {t(`${menuField}.${modType}`)}
          </span>
        </MenuItem>
      ))}
    </div>
  );
};

interface MenuItemProps { 
  children: React.ReactNode, 
  active: boolean, 
  onClick: ()=>void,
};
const MenuItem = ({ children, active, onClick }: MenuItemProps) => {

  return (
    <div onClick={onClick} className={`MenuItem ${active?'active':''}`} >
      {children}
    </div>
  );
};

const Menu = () => {
  const dispatch = useAppDispatch();
  
  const menuListItems: (TModType|"All")[] = ["All", ...modTypeList];
  const currentModType = useAppSelector(selectCurrentModType);

  //updated via re-render
  const currentIndex = menuListItems.indexOf(currentModType);

  const handleSelectUp = () => {
    dispatch(updateSelectedModType(modTypeList[currentIndex - 1]));
  };

  const handleSelectDown = () => {
    dispatch(updateSelectedModType(modTypeList[currentIndex + 1]));
  }

  return (
    <div className="MenuBox">
      <MenuButton direction='UP' active={currentIndex!==0} onClick={handleSelectUp}/>
      <MenuList menuListItems={menuListItems} currentModType={currentModType} />
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
