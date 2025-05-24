import path from "path";
import fs from "fs-extra";
import axios from "axios";
import { app, ipcMain } from "electron";

const REMOTE_URL = 'https://raw.githubusercontent.com/Tian-W001/PeakyModManager_v2/hot-updates/hot_updates/';
const INFOLIST_NAME = 'CharacterInfoList.json';
const IMAGE_FOLDER_NAME = "character_images";
const CACHE_PATH = path.join(app.getPath('userData'), 'hot-updates');


export function registerCharacterHandlers() {

  async function fetchCharacters() {
    console.log('Fetching Character InfoList...');
    await fs.mkdir(CACHE_PATH, { recursive: true });
    const infoListUrl = REMOTE_URL + INFOLIST_NAME;
    const response = await axios.get(infoListUrl);
    const data = response.data;
    await fs.writeJSON(path.join(CACHE_PATH, INFOLIST_NAME), data, { spaces: 2 });
    
    await downloadCharacterImages(data.characterList);
    return data;
  }



  ipcMain.handle('get-characters', async () => {
    const infoListPath = path.join(CACHE_PATH, INFOLIST_NAME);
    if (!await fs.pathExists(infoListPath)) {
      await fetchCharacters();
    }
    const data = await fs.readJSON(infoListPath);
    return data;
    
  });

  ipcMain.handle('fetch-characters', async () => {
    return await fetchCharacters();
  });

  async function downloadCharacterImages(characterList: string[]) {
    const imageFolderPath = path.join(CACHE_PATH, IMAGE_FOLDER_NAME);
    await fs.mkdir(imageFolderPath, { recursive: true });

    for (const character of characterList) {
      const imageName = `${character}.png`;
      const imagePath = path.join(imageFolderPath, imageName);
      const imageUrl = `${REMOTE_URL}${IMAGE_FOLDER_NAME}/${imageName}`;
      if (await fs.pathExists(imagePath)) {
        console.log(`${imageName} exists - skipping`);
        continue;
      }

      try {
        console.log(`Downloading ${imageName}...`);
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await fs.writeFile(imagePath, response.data);
        console.log(`Saved ${imageName}`);
      } catch (error) {
        console.log(`Failed to download ${imageName}:`, error);
      }
    }

  }

}

export function getCharacterImagePath(characterName: string) {
  return path.join(CACHE_PATH, IMAGE_FOLDER_NAME, `${characterName}.png`);
}