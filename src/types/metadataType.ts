import { DEFAULT_CHARACTER, TCharacter } from "./characterType"
import { TKeybinds } from "./KeybindType";
import { DEFAULT_MOD_TYPE, TModType } from "./modType"

export type TMetadata = {
  modType: TModType,
  character: TCharacter, 
  description: string,
  image: string,
  sourceUrl: string,
  keybinds: TKeybinds,
  broken: boolean,
  active: boolean,
};

export const DEFAULT_METADATA: TMetadata = {
  modType: DEFAULT_MOD_TYPE,
  character: DEFAULT_CHARACTER, 
  description: '',
  image: '',
  sourceUrl: '',
  keybinds: {},
  broken: false,
  active: false,
};
