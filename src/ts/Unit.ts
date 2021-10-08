export interface UnitData {
    id: string;
    dexterity: number | undefined;
    name: string;
    color: string;
    categoryId: string | undefined;
}

export interface UnitEncounterData {
    id: string;
    unitId: string;
    initiative: number | undefined;
    hp: number | undefined;
    heldTurn: boolean;
    encounterId: string;
}
