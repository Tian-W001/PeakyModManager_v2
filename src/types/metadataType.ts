import { defaultCharacter, TCharacter } from "./characterType"
import { TKeybinds } from "./KeybindType";
import { defaultModType, TModType } from "./modType"

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

export const defaultMetadata: TMetadata = {
  modType: defaultModType,
  character: defaultCharacter, 
  description: '',
  image: '',
  sourceUrl: '',
  keybinds: {},
  broken: false,
  active: false,
};
