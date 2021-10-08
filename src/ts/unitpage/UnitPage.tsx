import React from "react";
import { Category } from "../Category";
import { NavTabs } from "../navtabs/NavTabs";
import { UnitData } from "../Unit";
import { UnitDataCard } from "./UnitDataCard";

interface UnitPageProps {
    categories: Record<string, Category>;
    currentCategoryId: string;
    units: Record<string, UnitData>;
    getNextUnitId: () => string;
    getNextCategoryId: () => string;
    changeCategoryId: (newCategoryId: string) => void;
    changeUnits: (newUnits: Record<string, UnitData>) => void;
    changeCategories: (newCategories: Record<string, Category>) => void;
    deleteUnit: (unitId: string) => void;
    addUnitToEncounter: (unitId: string) => void;
}

export const UnitPage = ({
    categories,
    currentCategoryId,
    units,
    getNextUnitId,
    getNextCategoryId,
    changeCategoryId,
    changeUnits,
    changeCategories,
    deleteUnit,
    addUnitToEncounter,
}: UnitPageProps): JSX.Element => {
    return (
        <div>
            <NavTabs
                name="category"
                tabs={Object.values(categories)}
                currentTabId={currentCategoryId}
                changeTab={changeCategoryId}
                addNewTab={() => {
                    const id = getNextCategoryId();
                    const newCategory: Category = {
                        id,
                        name: "New Category",
                    };
                    const newCategories = categories;
                    newCategories[id] = newCategory;
                    changeCategories(newCategories);
                    changeCategoryId(id);
                }}
            />
            <hr />
            {Object.values(units)
                .filter((unit) => unit.categoryId === currentCategoryId)
                .map((unit) => (
                    <UnitDataCard
                        key={unit.id}
                        unitData={unit}
                        handleEditUnit={(newUnitData: Partial<Omit<UnitData, "id">>) => {
                            const newUnits = units;
                            newUnits[unit.id] = {
                                ...newUnits[unit.id],
                                ...newUnitData,
                            };
                            changeUnits(newUnits);
                        }}
                        deleteUnit={() => deleteUnit(unit.id)}
                        addUnitToEncounter={() => addUnitToEncounter(unit.id)}
                    />
                ))}
            <hr />
            Buttons
            <br />
            <br />
            {Object.keys(categories).length > 1 && (
                <button
                    onClick={() => {
                        Object.values(units)
                            .filter((unit) => unit.categoryId == currentCategoryId)
                            .map((unit) => unit.id)
                            .forEach((unitId) => deleteUnit(unitId));
                        const newCategories = categories;
                        delete newCategories[currentCategoryId];
                        changeCategoryId(Object.values(newCategories)[0].id);
                        changeCategories(newCategories);
                    }}
                >
                    Delete Encounter
                </button>
            )}
        </div>
    );
};
