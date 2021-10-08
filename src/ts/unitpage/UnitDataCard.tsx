import React from "react";
import { UnitData } from "../Unit";

interface UnitDataCardProps {
    unitData: UnitData;
    handleEditUnit: (newUnitData: Partial<Omit<UnitData, "id">>) => void;
    deleteUnit: () => void;
    addUnitToEncounter: () => void;
}

export const UnitDataCard = ({
    unitData,
    handleEditUnit,
    deleteUnit,
    addUnitToEncounter,
}: UnitDataCardProps): JSX.Element => {
    return (
        <div>
            {unitData.name}
            <button onClick={addUnitToEncounter}>Add</button>
            <button onClick={deleteUnit}>Delete</button>
        </div>
    );
};
