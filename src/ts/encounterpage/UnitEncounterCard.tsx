import React, { ChangeEvent, Component } from "react";
import { UnitData, UnitEncounterData } from "../Unit";
import { parseColor } from "../util";

interface UnitEncounterCardProps {
    unitData: UnitData;
    unitEncounterData: UnitEncounterData;
    handleChangeEncounterData: (newEncounterData: Partial<Omit<UnitEncounterData, "unitId">>) => void;
    handleChangeUnitData: (newUnitData: Partial<Omit<UnitData, "id">>) => void;
    handleDeleteEncounterData: () => void;
    handleSaveUnit: (unitId: string) => void;
    myTurn: boolean;
}
interface UnitEncounterCardState {}
export class UnitEncounterCard extends Component<UnitEncounterCardProps, UnitEncounterCardState> {
    constructor(props: UnitEncounterCardProps) {
        super(props);
        this.state = {};
    }

    private handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.handleChangeUnitData({ name: event.currentTarget.value });
    };
    private handleHPChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let hp = undefined;
        if (event.currentTarget.value.length > 0) {
            hp = parseInt(event.currentTarget.value);
        }
        this.props.handleChangeEncounterData({ hp });
    };
    private handleInitiativeChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let initiative = undefined;
        if (event.currentTarget.value.length > 0) {
            initiative = parseInt(event.currentTarget.value);
        }
        this.props.handleChangeEncounterData({ initiative });
    };
    private handleDexterityChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let dexterity = undefined;
        if (event.currentTarget.value.length > 0) {
            dexterity = parseInt(event.currentTarget.value);
        }
        this.props.handleChangeUnitData({ dexterity });
    };
    private handleColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.handleChangeUnitData({ color: event.currentTarget.value });
    };
    private handleHeldTurnChange = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.handleChangeEncounterData({ heldTurn: event.currentTarget.checked });
    };

    render(): JSX.Element {
        const borderColor = this.props.myTurn ? "gold" : "rgb(60, 60, 60)";
        let textColor = "white";
        if (parseColor(this.props.unitData.color).reduce((x, y) => x + y, 0) > 255 * 2) {
            textColor = "black";
        }
        return (
            <div
                style={{
                    border: `3px solid ${borderColor}`,
                    margin: "2px",
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor: this.props.unitData.color,
                    color: textColor,
                }}
            >
                <input
                    type="text"
                    size={12}
                    onChange={this.handleNameChange}
                    placeholder="Name"
                    value={this.props.unitData.name}
                />
                <br />
                <input
                    type="number"
                    style={{
                        width: "55pt",
                    }}
                    onChange={this.handleInitiativeChange}
                    max="50"
                    min="0"
                    placeholder="Initiative"
                    value={this.props.unitEncounterData.initiative || ""}
                />
                <input
                    type="number"
                    style={{
                        width: "55pt",
                    }}
                    min="0"
                    max="50"
                    onChange={this.handleDexterityChange}
                    placeholder="DEX"
                    value={this.props.unitData.dexterity || ""}
                />
                <br />
                <input
                    type="number"
                    style={{
                        width: "110pt",
                    }}
                    min="0"
                    max="1000"
                    onChange={this.handleHPChange}
                    placeholder="HP"
                    value={this.props.unitEncounterData.hp || ""}
                />
                <br />
                <input
                    type="color"
                    onChange={this.handleColorChange}
                    value={this.props.unitData.color}
                    style={{
                        height: "50px",
                        width: "50px",
                        border: "none",
                        outline: "none",
                    }}
                />
                <br />
                <label htmlFor={`heldTurn${this.props.unitData.id}`}>Held Turn: </label>
                <input
                    type="checkbox"
                    onChange={this.handleHeldTurnChange}
                    id={`heldTurn${this.props.unitData.id}`}
                    checked={this.props.unitEncounterData.heldTurn}
                />
                <br />
                <button onClick={() => this.props.handleSaveUnit(this.props.unitData.id)}>Save</button>
                <button onClick={this.props.handleDeleteEncounterData}>Delete</button>
            </div>
        );
    }
}
