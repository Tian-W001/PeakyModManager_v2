import { TCharacter } from "../../types/characterType"
import { TModType } from "../../types/modType";

export type TTranslations = {
  Characters: {
    Fullnames: Record<TCharacter, string>,
    Nicknames: Record<TCharacter, string>,
  },
  MenuItems: Record<TModType|"All", string>,
  BottomBar: Record<string, string>,
  ModEditModal: Record<string, string>,
  SettingsModal: Record<string, string>,
};

