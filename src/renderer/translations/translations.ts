import { TCharacter } from "../../types/characterType"
import { TModType } from "../../types/modType";

export type TTranslations = {
  characters: {
    fullnames: Record<TCharacter, string>,
    nicknames: Record<TCharacter, string>,
  },
  menuItems: Record<TModType|"All", string>,
};

