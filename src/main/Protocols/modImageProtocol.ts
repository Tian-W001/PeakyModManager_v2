import { protocol } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';
import store from '../store';
import { IMG_TYPES } from '../main';

export const modImageScheme: Electron.CustomScheme = {
  scheme: 'mod-image',
  privileges: { secure: true, standard: true },
};

export function registerImageProtocol() {
  protocol.handle('mod-image', async (request) => {
    try {
      const url = new URL(request.url);
      const imagePath = decodeURIComponent(url.pathname).replace(/^\//, '');
      const ext = path.extname(imagePath).toLowerCase();

      if (!IMG_TYPES.has(ext)) {
        console.error(`Invalid image type: ${ext}`);
        return new Response(null, { status: 400 });
      }

      const modResourcesPath = store.get('modResourcesPath');
      const absPath = path.resolve(modResourcesPath, imagePath);

      if (!absPath.startsWith(modResourcesPath)) {
        console.error(`Invalid image path: ${absPath}`);
        return new Response(null, { status: 400 });
      }

      const buffer = await fs.readFile(absPath);
      const mimeType = mime.lookup(ext);

      return new Response(buffer, {
        status: 200,
        headers: mimeType ? { 'Content-Type': mimeType } : undefined,
      });
    } catch (error) {
      console.error('Error handling image protocol:', error);
      return new Response(null, { status: 404 });
    }
  });
}
