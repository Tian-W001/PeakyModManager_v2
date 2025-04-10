
export const characters = [
    "Unknown",
    "Anby",
    "Burnice",
    "Nicole", 
    "Ellen",
] as const;

export type TCharacter = typeof characters[number];

export const defaultCharacter: TCharacter = "Unknown";
