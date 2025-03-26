import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import CardGrid from './components/CardGrid/CardGrid';
import LeftMenu from './components/LeftMenu/LeftMenu';
import wallpaper from '../assets/zzz_wallpaper.png';
import { use, useEffect, useMemo, useState } from 'react';
import { TMetadata } from '../types/metadataType';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchModResourcesPath, fetchModResourcesMetadata } from './redux/slices/modResourcesSlice';
import { selectModResources } from './redux/selectors/modResourcesSelectors';

export default function App() {

  const dispatch = useAppDispatch();
  const { modResourcesPath, metadataList, loading } = useAppSelector(selectModResources);

  useEffect(() => {
    dispatch(fetchModResourcesPath());
  }, [dispatch]);

  useEffect(() => {
    if (modResourcesPath) {
      dispatch(fetchModResourcesMetadata());
    }
  }, [dispatch, modResourcesPath]);

  const groupedMetadataList = useMemo(() => {
    const groupedMetadataList = metadataList.reduce((acc, metadata) => {
      if (!acc[metadata.modType]) {
        acc[metadata.modType] = [];
      }
      acc[metadata.modType].push(metadata);
      return acc;
    }, {} as Record<string, TMetadata[]>);
    
    console.log("groupedMetadataList:", groupedMetadataList);
    return groupedMetadataList;
  }, [metadataList]);


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
