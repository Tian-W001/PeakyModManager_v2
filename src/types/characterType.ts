
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
  "Ellen Joe",
  "Alexandrina Sebastiane",
  "Corin Wickes",
  "Soldier 11",
  //Released After 1.0
  "Zhu Yuan",
  "Soukaku",
  "Luciana de Montefio",
  "Piper Wheel",
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
  "Unknown",
] as const;

export type TCharacter = typeof characters[number];

export const defaultCharacter: TCharacter = "Unknown";
