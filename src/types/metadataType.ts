import { TCharacter } from "./characterType"
import { Tmod } from "./modType"

export type TMetadata = {
  character: TCharacter, 
  description: string,
  name: string,
  modType: Tmod,
  image: string,
  sourceUrl: string,
  active: boolean,
  metadataVersion: number,
}