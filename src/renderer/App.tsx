import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import CardGrid from './components/CardGrid/CardGrid';
import LeftMenu from './components/LeftMenu/LeftMenu';
import wallpaper from '../assets/zzz_wallpaper.png';
import { useEffect } from 'react';
import { TMetadata } from '../types/metadataType';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchModResourcesPath, fetchModResourcesMetadata } from './redux/modResources/modResourcesSlice';
import { selectModResources } from './redux/modResources/modResourcesSlice';

export default function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchModResourcesPath());
    dispatch(fetchModResourcesMetadata());
  }, []);

  return (
    <>
    {console.log("Render App!")}
      <div className="AppContainer">
        <div className="MainContainer">
          <LeftMenu />
          <CardGrid />
        </div>
        <BottomBar />
      </div>

      <div
        className="BackgroundContainer"
        style={{
          backgroundImage: `url(${wallpaper})`,
        }}
      />
    </>
  );
};
