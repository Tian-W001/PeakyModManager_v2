import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import CardGrid from './components/CardGrid/CardGrid';
import LeftMenu from './components/LeftMenu/LeftMenu';
import wallpaper from '../assets/zzz_wallpaper.png';
import { useEffect, useState } from 'react';
import { TMetadata } from '../types/metadataType';

export default function App() {

  const [modResourcesPath, setModResourcesPath] = useState("");
  const [metadataList, setMetadataList] = useState<TMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    //window.electron.setModResourcesPath("C:\\Users\\Tian\\Desktop\\testModResources");
    window.electron.getModResourcesPath().then((path: string) => {
      setModResourcesPath(path);
      console.log("path:", path);
    });
  }, []);

  useEffect(() => {
    const fetchMetadata = async () => {
      const newMetadataList = await window.electron.fetchModResourcesMetadata();
      setMetadataList(newMetadataList);
      console.log("metadataList:", newMetadataList);
      setLoading(false);
    };

    fetchMetadata();
  }, [modResourcesPath]);


  return (
    <>
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
