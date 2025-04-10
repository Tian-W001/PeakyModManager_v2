export const modTypeList = [
    "Unknown", 
    "Characters",
    "NPCs",
    "Environment",
    "UI",
    "Script/Tools",
    "Misc",
] as const;

export type TModType = typeof modTypeList[number];

export const defaultModType: TModType = "Unknown";
