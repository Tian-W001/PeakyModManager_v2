import { TCharacter } from "./characterType"
import { TKeybinds } from "./KeybindType";
import { Tmod } from "./modType"

export type TMetadata = {
  modType: Tmod,
  character: TCharacter, 
  description: string,
  image: string,
  sourceUrl: string,
  keybinds: TKeybinds,
  active: boolean,
};
