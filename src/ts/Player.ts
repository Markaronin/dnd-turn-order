export interface Player {
    initiative: number | undefined;
    dexterity: number | undefined;
    hp: number | undefined;
    heldTurn: boolean;
    name: string;
    color: string;
    id: number;
}
