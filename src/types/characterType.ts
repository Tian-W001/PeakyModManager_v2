
export const characters = [
  "Anby Demara", 
  "Billy Kid",
  "Nicole Demara",
  "Nekomiya Mana",
  "Koleda Belobog",
  "Ben Bigger",
  "Grace Howard",
  "Anton Ivanov",
  "Von Lycaon",
  "Alexandrina Sebastiane",
  "Corin Wickes",
  "Soldier 11",
  "Soukaku",
  "Luciana de Montefio",
  "Piper Wheel",
  //Released After 1.0
  "Ellen Joe",
  "Zhu Yuan",
  "Qingyi",
  "Jane Doe",
  "Seith Lowell",
  "Caesar King",
  "Burnice White",
  "Tsukishiro Yanagi",
  "Lighter",
  "Asaba Harumasa",
  "Hoshimi Miyabi",
  "Astra Yao",
  "Evelyn Chevalier",
  "Pulchra Fellini",
  "Soldier 0 - Anby",
  "Trigger",
  "Hugo",
  "Vivian",
  "Unknown",
] as const;

export type TCharacter = typeof characters[number] | null;

export const defaultCharacter: TCharacter = null;
