import { TCharacter } from "../../types/characterType"
import { TModType } from "../../types/modType";

export type TTranslations = {

  MenuItems: Record<TModType|"All", string>,
  BottomBar: Record<string, string>,
  ModEditModal: Record<string, string>,
  SettingsModal: Record<string, string>,
};

