import { TCharacter } from "./characterType"
import { Tmod } from "./modType"

export type TMetadata = {
  modType: Tmod,
  character: TCharacter, 
  description: string,
  image: string,
  sourceUrl: string,
  active: boolean,
};
