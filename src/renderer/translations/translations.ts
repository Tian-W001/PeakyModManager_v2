import { TCharacter } from "../../types/characterType"

export type TTranslations = {
  characters: {
    fullnames: Record<TCharacter, string>,
    nicknames: Record<TCharacter, string>,
  }
};

