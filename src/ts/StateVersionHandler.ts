import { Category } from "./Category";
import { Encounter } from "./Encounter";
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
    units: Record<string, UnitData>;
    unitEncounterData: UnitEncounterData[];
    encounters: Record<string, Encounter>;
    categories: Record<string, Category>;
    nextId: number;
    nextEncounterId: number;
    nextCategoryId: number;
    currentEncounterId: string;
    currentCategoryId: string;
}

export type OldState = MainStateV0;
export type LatestState = MainStateV1;

export class StateVersionHandler {
    public static readonly DefaultState: LatestState = {
        version: 1,
        units: {},
        unitEncounterData: [],
        encounters: { "0": { id: "0", name: "Default Encounter", turn: 0 } },
        categories: { "0": { id: "0", name: "Default Category" } },
        nextId: 0,
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

    public update(oldState: OldState): LatestState {
        // if (!("version" in oldState)) {
        //     return this.updateV0ToV1(oldState);
        // }
        return this.updateV0ToV1(oldState);
    }
}

export const stateVersionHandler = new StateVersionHandler();
