import { protocol } from "electron";
import fs from "fs-extra";
import { getCharacterImagePath } from "../hotUpdateHandler";


export const characterImageScheme: Electron.CustomScheme = {
  scheme: 'character-image',
  privileges: { secure: true, standard: true },
};

export function registerCharacterImageProtocol() {
  protocol.handle('character-image', async (request) => {
    const url = new URL(request.url);
    const characterName = decodeURIComponent(url.pathname);
    const filePath = getCharacterImagePath(characterName);

    if (!fs.existsSync(filePath)) {
      console.log(`Image not found for ${characterName}`);
      return new Response('', { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    return new Response(buffer, {
      headers: { 'Content-Type': 'image/png' }
    });
  });
}
