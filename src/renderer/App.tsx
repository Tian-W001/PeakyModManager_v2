import './App.css';
import BottomBar from './components/BottomBar';
import CardGrid from './components/CardGrid';
import LeftMenu from './components/LeftMenu';
import { useEffect } from 'react';

import { useAppDispatch } from './redux/hooks';
import { fetchModResourcesMetadata } from './redux/slices/modResourcesSlice';
import { fetchGamePath, fetchLauncherPath, fetchModResourcesPath, fetchTargetPath, updateGamePath, updateLauncherPath, updateModResourcesPath, updateTargetPath } from './redux/slices/settingsSlice';

import wallpaper from './assets/zzz_wallpaper.png';

export default function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {

    //dispatch(updateModResourcesPath('C:\\Users\\Tian\\Desktop\\testModResources'));
    //dispatch(updateTargetPath('C:\\Users\\Tian\\Desktop\\testModFolder'));
    //dispatch(updateLauncherPath('F:\\ZZMI\\Resources\\Bin\\XXMI Launcher.exe'));
    //dispatch(updateGamePath('F:\\Program Files\\miHoYo Launcher\\games\\ZenlessZoneZero Game\\ZenlessZoneZero.exe'))

    dispatch(fetchModResourcesPath());
    dispatch(fetchTargetPath());
    dispatch(fetchLauncherPath());
    dispatch(fetchGamePath());

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
