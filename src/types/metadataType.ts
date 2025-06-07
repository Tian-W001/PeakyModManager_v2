import { TKeybinds } from "./KeybindType";
import { DEFAULT_MOD_TYPE, TModType } from "./modType"

export type TMetadata = {
  modType: TModType,
  character: string | null, 
  description: string,
  image: string,
  sourceUrl: string,
  keybinds: TKeybinds,
  broken: boolean,
  active: boolean,
};

export const DEFAULT_METADATA: TMetadata = {
  modType: DEFAULT_MOD_TYPE,
  character: null, 
  description: '',
  image: '',
  sourceUrl: '',
  keybinds: {},
  broken: false,
  active: false,
};
