import './assets/fonts/fonts.css'
import './App.scss';
import BottomBar from './components/BottomBar';
import CardGrid from './components/CardGrid';
import LeftMenu from './components/LeftMenu';
import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchModResourcesMetadata } from './redux/slices/modResourcesSlice';
import { fetchGamePath, fetchLanguage, fetchLauncherPath, fetchModResourcesPath, fetchTargetPath, selectLanguage, updateGamePath, updateLauncherPath, updateModResourcesPath, updateTargetPath } from './redux/slices/settingsSlice';

import wallpaper from './assets/zzz_wallpaper.png';
import i18n from './i18n';
import { getCharacters, selectCharacters } from './redux/slices/hotUpdatesSlice';

function App() {

  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);

  useEffect(() => {
    const runOnLaunch = async () => {
      await dispatch(fetchModResourcesPath());
      await dispatch(fetchTargetPath());
      await dispatch(fetchLauncherPath());
      await dispatch(fetchGamePath());

      await dispatch(getCharacters());

      await dispatch(fetchLanguage());

      await dispatch(fetchModResourcesMetadata());
    };

    runOnLaunch();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

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

export default React.memo(App);
