import './App.css';
import BottomBar from './components/BottomBar';
import CardGrid from './components/CardGrid';
import LeftMenu from './components/LeftMenu';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchModResourcesPath, fetchModResourcesMetadata } from './redux/slices/modResourcesSlice';

import wallpaper from './assets/zzz_wallpaper.png';

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
