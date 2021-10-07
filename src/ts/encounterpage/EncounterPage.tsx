import React from "react";
import { Encounter } from "../Encounter";
import { UnitData, UnitEncounterData } from "../Unit";
import { UnitEncounterCard } from "../UnitEncounterCard";
import "./EncounterPage.less";

interface EncounterPageProps {
    encounters: Record<string, Encounter>;
    currentEncounterId: string;
    units: Record<string, UnitData>;
    unitEncounterData: UnitEncounterData[];
    getNextUnitId: () => string;
    addNewEncounter: () => void;
    changeEncounter: (newEncounterId: string) => void;
    changeUnitEncounterData: (newUnitEncounterData: UnitEncounterData[]) => void;
    changeUnits: (newUnits: Record<string, UnitData>) => void;
    changeEncounters: (newEncounters: Record<string, Encounter>) => void;
}

export const EncounterPage = ({
    encounters,
    currentEncounterId,
    unitEncounterData,
    units,
    getNextUnitId,
    addNewEncounter,
    changeEncounter,
    changeUnitEncounterData,
    changeUnits,
    changeEncounters,
}: EncounterPageProps): JSX.Element => {
    const handleNewUnitAndEncounter = (): void => {
        const newUnits = units;
        const unitId = getNextUnitId();
        newUnits[unitId] = {
            id: unitId,
            dexterity: undefined,
            name: "",
            color: "#222222",
            categoryId: undefined,
        };
        const newUnitEncounterData = unitEncounterData;
        newUnitEncounterData.push({
            unitId: unitId,
            encounterId: currentEncounterId,
            heldTurn: false,
            hp: undefined,
            initiative: undefined,
        });
        changeUnits(newUnits);
        changeUnitEncounterData(newUnitEncounterData);
    };

    return (
        <div>
            <div>
                {Object.values(encounters).map((encounter) => (
                    <button
                        key={encounter.id}
                        className={
                            currentEncounterId === encounter.id
                                ? "changeEncounterButton currentEncounter"
                                : "changeEncounterButton"
                        }
                        onClick={() => changeEncounter(encounter.id)}
                    >
                        {encounter.name}
                    </button>
                ))}
                <button onClick={addNewEncounter} className="addNewEncounterButton">
                    Add New Encounter
                </button>
            </div>
            <hr />
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                {unitEncounterData
                    .filter((encounterData) => encounterData.encounterId == currentEncounterId)
                    .sort((a, b) => {
                        if (a.initiative === b.initiative) {
                            return (units[b.unitId].dexterity || 0) - (units[a.unitId].dexterity || 0);
                        } else {
                            return (b.initiative || 0) - (a.initiative || 0);
                        }
                    })
                    .map((encounterData, i) => (
                        <UnitEncounterCard
                            unitData={units[encounterData.unitId]}
                            unitEncounterData={encounterData}
                            key={encounterData.unitId}
                            myTurn={encounters[currentEncounterId].turn == i}
                            handleChangeEncounterData={(
                                newEncounterData: Partial<Omit<UnitEncounterData, "unitId">>,
                            ) => {
                                const newEncounterDataArray = unitEncounterData;
                                newEncounterDataArray[i] = { ...newEncounterDataArray[i], ...newEncounterData };
                                changeUnitEncounterData(newEncounterDataArray);
                            }}
                            handleChangeUnitData={(newUnitData: Partial<Omit<UnitData, "id">>) => {
                                const newUnits = units;
                                newUnits[encounterData.unitId] = {
                                    ...newUnits[encounterData.unitId],
                                    ...newUnitData,
                                };
                                changeUnits(newUnits);
                            }}
                            handleDeleteEncounterData={() => {
                                const newEncounterDataArray = unitEncounterData.filter((val) => val != encounterData);
                                const newUnits = units;
                                const newEncounters = encounters;
                                if (units[encounterData.unitId].categoryId === undefined) {
                                    delete newUnits[encounterData.unitId];
                                }
                                newEncounters[currentEncounterId].turn =
                                    newEncounters[currentEncounterId].turn <
                                    newEncounterDataArray.filter(
                                        (encounterData) => encounterData.encounterId == currentEncounterId,
                                    ).length
                                        ? newEncounters[currentEncounterId].turn
                                        : 0;
                                changeUnitEncounterData(newEncounterDataArray);
                                changeUnits(newUnits);
                                changeEncounters(newEncounters);
                            }}
                        />
                    ))}
            </div>
            <hr />
            <button onClick={handleNewUnitAndEncounter} id="newUnitButton">
                Add New
            </button>
            {unitEncounterData.length > 0 && (
                <button
                    onClick={() => {
                        const newEncounters = encounters;
                        newEncounters[currentEncounterId].turn =
                            (newEncounters[currentEncounterId].turn + 1) %
                            unitEncounterData.filter((encounterData) => encounterData.encounterId == currentEncounterId)
                                .length;
                        changeEncounters(newEncounters);
                    }}
                    id="nextTurnButton"
                >
                    Next Turn
                </button>
            )}
        </div>
    );
};
