import { UnitData, UnitEncounterData } from "./Unit";

interface MainStateV0 {
    players: Record<
        string,
        {
            initiative: number | undefined;
            dexterity: number | undefined;
            hp: number | undefined;
            heldTurn: boolean;
            name: string;
            color: string;
            id: number;
        }
    >;
    turn: number;
    nextId: number;
}

export interface MainStateV1 {
    version: 1;
    units: Record<
        string,
        {
            id: string;
            dexterity: number | undefined;
            name: string;
            color: string;
            categoryId: string | undefined;
        }
    >;
    unitEncounterData: {
        unitId: string;
        initiative: number | undefined;
        hp: number | undefined;
        heldTurn: boolean;
        encounterId: string;
    }[];
    encounters: Record<
        string,
        {
            id: string;
            name: string;
            turn: number;
        }
    >;
    categories: Record<
        string,
        {
            id: string;
            name: string;
        }
    >;
    nextId: number;
    nextEncounterId: number;
    nextCategoryId: number;
    currentEncounterId: string;
    currentCategoryId: string;
}

export interface MainStateV2 {
    version: 2;
    units: Record<
        string,
        {
            id: string;
            dexterity: number | undefined;
            name: string;
            color: string;
            categoryId: string | undefined;
        }
    >;
    unitEncounterData: {
        unitId: string;
        initiative: number | undefined;
        hp: number | undefined;
        heldTurn: boolean;
        encounterId: string;
    }[];
    encounters: Record<
        string,
        {
            id: string;
            name: string;
            turn: number;
        }
    >;
    categories: Record<
        string,
        {
            id: string;
            name: string;
        }
    >;
    nextUnitId: number;
    nextEncounterId: number;
    nextCategoryId: number;
    currentEncounterId: string;
    currentCategoryId: string;
}

// Remember not to use interface types in state versions - it's too easy to make a change to the UnitData type and forget to make a new state version

export type OldState = MainStateV0 | MainStateV1;
export type LatestState = MainStateV2;

export class StateVersionHandler {
    public static readonly DefaultState: LatestState = {
        version: 2,
        units: {},
        unitEncounterData: [],
        encounters: { "0": { id: "0", name: "Default Encounter", turn: 0 } },
        categories: { "0": { id: "0", name: "Default Category" } },
        nextUnitId: 0,
        nextEncounterId: 1,
        nextCategoryId: 1,
        currentEncounterId: "0",
        currentCategoryId: "0",
    };
    public static readonly DefaultStateString = JSON.stringify(StateVersionHandler.DefaultState);

    private updateV0ToV1(oldState: MainStateV0): MainStateV1 {
        const units: Record<string, UnitData> = {};
        const unitEncounterData: UnitEncounterData[] = [];
        for (const player of Object.values(oldState.players)) {
            units[player.id.toString()] = {
                id: player.id.toString(),
                dexterity: player.dexterity,
                name: player.name,
                color: player.color,
                categoryId: undefined,
            };
            unitEncounterData.push({
                unitId: player.id.toString(),
                initiative: player.initiative,
                hp: player.hp,
                heldTurn: player.heldTurn,
                encounterId: "0",
            });
        }
        return {
            version: 1,
            units,
            unitEncounterData,
            encounters: { "0": { id: "0", name: "Default Encounter", turn: 0 } },
            categories: { "0": { id: "0", name: "Default Category" } },
            nextId: oldState.nextId,
            nextEncounterId: 1,
            nextCategoryId: 1,
            currentEncounterId: "0",
            currentCategoryId: "0",
        };
    }
    private updateV1ToV2(oldState: MainStateV1): MainStateV2 {
        return {
            version: 2,
            units: oldState.units,
            unitEncounterData: oldState.unitEncounterData,
            encounters: oldState.encounters,
            categories: oldState.encounters,
            nextUnitId: oldState.nextId,
            nextEncounterId: oldState.nextEncounterId,
            nextCategoryId: oldState.nextCategoryId,
            currentEncounterId: oldState.currentEncounterId,
            currentCategoryId: oldState.currentCategoryId,
        };
    }

    public update(oldState: OldState): LatestState {
        if (!("version" in oldState)) {
            oldState = this.updateV0ToV1(oldState);
        }
        if ("version" in oldState && oldState.version === 1) {
            return this.updateV1ToV2(oldState);
        }
        throw new Error("Uh oh, how did we end up here");
    }
}

export const stateVersionHandler = new StateVersionHandler();
