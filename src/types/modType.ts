export const modTypeList = [
    "Characters",
    "NPCs",
    "Environment",
    "UI",
    "Script/Tools",
    "Misc",
    "Unknown", 
] as const;

export type TModType = typeof modTypeList[number];

export const DEFAULT_MOD_TYPE: TModType = "Unknown";
