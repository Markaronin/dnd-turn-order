import React, { ChangeEvent } from "react";
import { UnitData } from "../Unit";
import { parseColor } from "../util";

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
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
        handleEditUnit({ name: event.currentTarget.value });
    };
    const handleDexterityChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let dexterity = undefined;
        if (event.currentTarget.value.length > 0) {
            dexterity = parseInt(event.currentTarget.value);
        }
        handleEditUnit({ dexterity });
    };
    const handleColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
        handleEditUnit({ color: event.currentTarget.value });
    };
    let textColor = "white";
    if (parseColor(unitData.color).reduce((x, y) => x + y, 0) > 255 * 2) {
        textColor = "black";
    }
    return (
        <div
            style={{
                border: `3px solid rgb(60, 60, 60)`,
                margin: "2px",
                padding: "5px",
                borderRadius: "5px",
                backgroundColor: unitData.color,
                color: textColor,
            }}
        >
            <input type="text" size={12} onChange={handleNameChange} placeholder="Name" value={unitData.name} />
            <br />
            <input
                type="number"
                style={{
                    width: "55pt",
                }}
                min="0"
                max="50"
                onChange={handleDexterityChange}
                placeholder="DEX"
                value={unitData.dexterity || ""}
            />
            <br />
            <input
                type="color"
                onChange={handleColorChange}
                value={unitData.color}
                style={{
                    height: "50px",
                    width: "50px",
                    border: "none",
                    outline: "none",
                }}
            />
            <br />
            <button onClick={addUnitToEncounter}>Add</button>
            <button onClick={deleteUnit}>Delete</button>
        </div>
    );
};
