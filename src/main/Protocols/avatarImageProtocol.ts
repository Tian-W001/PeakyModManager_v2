import { protocol } from "electron";
import fs from "fs-extra";
import { getAvatarImagePath } from "../hotUpdateHandler";


export const avatarImageScheme: Electron.CustomScheme = {
  scheme: 'avatar-image',
  privileges: { secure: true, standard: true },
};

export function registerAvatarImageProtocol() {
  protocol.handle('avatar-image', async (request) => {
    const url = new URL(request.url);
    const characterName = decodeURIComponent(url.pathname);
    const filePath = getAvatarImagePath(characterName);

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
