import Store from 'electron-store';
import { TLanguage } from '../types/languageType';


const store = new Store<{ 
  modResourcesPath: string,
  targetPath: string,
  launcherPath: string,
  gamePath: string,
  language: TLanguage,
}>();

export default store;
