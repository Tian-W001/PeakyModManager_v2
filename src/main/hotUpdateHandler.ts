import path from "path";
import fs from "fs-extra";
import axios from "axios";
import { app, ipcMain } from "electron";

const REMOTE_URL = 'https://raw.githubusercontent.com/Tian-W001/PeakyModManager_v2/hot-updates/hot_updates/';
const INFOLIST_NAME = 'CharacterInfoList.json';
const CHARACTER_IMAGE_FOLDER_NAME = "character_images";
const AVATAR_IMAGE_FOLDER_NAME = "avatar_images";
const CACHE_PATH = path.join(app.getPath('userData'), 'hot-updates');


export function registerCharacterHandlers() {

  async function fetchCharacters() {
    console.log('Fetching Character InfoList...');
    await fs.mkdir(CACHE_PATH, { recursive: true });
    const infoListUrl = REMOTE_URL + INFOLIST_NAME;
    const response = await axios.get(infoListUrl);
    const data = response.data;
    await fs.writeJSON(path.join(CACHE_PATH, INFOLIST_NAME), data, { spaces: 2 });
    
    await downloadImages(data.characterList);
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
    console.log('Fetching characters from remote...');
    return await fetchCharacters();
  });


  async function downloadImages(characterList: string[]) {
    const characterImageFolderPath = path.join(CACHE_PATH, CHARACTER_IMAGE_FOLDER_NAME);
    const avatarImageFolderPath = path.join(CACHE_PATH, AVATAR_IMAGE_FOLDER_NAME);
    await fs.mkdir(characterImageFolderPath, { recursive: true });
    await fs.mkdir(avatarImageFolderPath, { recursive: true });

    for (const character of characterList) {
      const characterName = `${character}.png`;
      const characterImagePath = path.join(characterImageFolderPath, characterName);
      const characterImageUrl = `${REMOTE_URL}${CHARACTER_IMAGE_FOLDER_NAME}/${characterName}`;
      if (!await fs.pathExists(characterImagePath)) {
        try {
          //console.log(`Downloading ${characterName}...`);
          const response = await axios.get(characterImageUrl, { responseType: 'arraybuffer' });
          await fs.writeFile(characterImagePath, response.data);
          //console.log(`Saved ${imageName}`);
        } catch (error) {
          console.log(`Failed to download ${characterName}:`);
        }
      }

      const avatarImagePath = path.join(avatarImageFolderPath, characterName);
      const avatarImageUrl = `${REMOTE_URL}${AVATAR_IMAGE_FOLDER_NAME}/${characterName}`;
      if (!await fs.pathExists(avatarImagePath)) {
        try {
          console.log(`Downloading ${characterName}...`);
          const response = await axios.get(avatarImageUrl, { responseType: 'arraybuffer' });
          await fs.writeFile(avatarImagePath, response.data);
          console.log(`Saved ${characterName}`);
        } catch (error) {
          console.log(`Failed to download ${characterName}:`);
        }
      }
    }
  }

}

export function getCharacterImagePath(characterName: string) {
  return path.join(CACHE_PATH, CHARACTER_IMAGE_FOLDER_NAME, `${characterName}.png`);
}
export function getAvatarImagePath(avatarName: string) {
  return path.join(CACHE_PATH, AVATAR_IMAGE_FOLDER_NAME, `${avatarName}.png`);
}