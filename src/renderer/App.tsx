import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import CardGrid from './components/CardGrid/CardGrid';
import LeftMenu from './components/LeftMenu/LeftMenu';
import wallpaper from '../assets/zzz_wallpaper.png';
import { useEffect, useState } from 'react';

export default function App() {

  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    window.electron.setModResourcesPath("C:\\Users\\Tian\\Desktop\\testModResources");
    window.electron.getModResourcesPath().then((path: string) => {
      console.log("path:", path);
    });
    window.electron.onModResourcesData((files: string[]) => {
      setFiles(files);
      console.log("resources files", files);
      setLoading(false);
    });
  }, []);

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
}
