/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 4343;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function combineObjects<T extends object, U extends object>(oldObj: T, newObj: U): Partial<T> & U {
  const result: any = {};

  for (const key of Object.keys(newObj)) {
    if (key in oldObj) {
      result[key] = (oldObj as any)[key];
    } else {
      result[key] = (newObj as any)[key];
    }
  }

  return result as Partial<T> & U;
}