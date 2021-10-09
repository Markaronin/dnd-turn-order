import React, { Component, createElement } from "react";
import ReactDOM from "react-dom";
import { APIHelper } from "./api-helper";
import { Category } from "./Category";
import { Encounter } from "./Encounter";
import { EncounterPage } from "./encounterpage/EncounterPage";
import { LatestState, StateVersionHandler, stateVersionHandler } from "./StateVersionHandler";
import { UnitData, UnitEncounterData } from "./Unit";
import { UnitPage } from "./unitpage/UnitPage";
import { getCookie } from "../../node_modules/@markaronin/jefferson-util/dist/index";

interface MainDivProps {
    state: LatestState;
}
class MainDiv extends Component<MainDivProps, LatestState> {
    private static readonly PlayerStateKey = "playerState";
    constructor(props: MainDivProps) {
        super(props);
        this.state = props.state;
    }

    private timeoutId?: number;
    componentDidUpdate() {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => {
            APIHelper.putData(this.state);
        }, 5000);
    }

    private getNextUnitId = () => {
        const nextUnitId = this.state.nextUnitId;
        this.setState({ nextUnitId: nextUnitId + 1 });
        return nextUnitId.toString();
    };
    private getNextEncounterId = () => {
        const nextEncounterId = this.state.nextEncounterId;
        this.setState({ nextEncounterId: nextEncounterId + 1 });
        return nextEncounterId.toString();
    };
    private getNextCategoryId = () => {
        const nextCategoryId = this.state.nextCategoryId;
        this.setState({ nextCategoryId: nextCategoryId + 1 });
        return nextCategoryId.toString();
    };
    private getNextUnitEncounterDataId = () => {
        const nextUnitEncounterDataId = this.state.nextUnitEncounterDataId;
        this.setState({ nextUnitEncounterDataId: nextUnitEncounterDataId + 1 });
        return nextUnitEncounterDataId.toString();
    };

    render() {
        return (
            <div style={{ display: "flex", flexWrap: "nowrap", width: "100%" }}>
                <div style={{ flexGrow: 2, flexBasis: 1, marginRight: "1ch" }}>
                    <EncounterPage
                        encounters={this.state.encounters}
                        currentEncounterId={this.state.currentEncounterId}
                        units={this.state.units}
                        unitEncounterData={this.state.unitEncounterData}
                        getNextUnitId={this.getNextUnitId}
                        getNextUnitEncounterDataId={this.getNextUnitEncounterDataId}
                        addNewEncounter={() => {
                            const id = this.state.nextEncounterId + 1;
                            const newEncounter: Encounter = {
                                id: id.toString(),
                                name: "New Encounter",
                                turn: 0,
                            };
                            const newEncounters = this.state.encounters;
                            newEncounters[id.toString()] = newEncounter;
                            this.setState({
                                nextEncounterId: id,
                                encounters: newEncounters,
                                currentEncounterId: id.toString(),
                            });
                        }}
                        changeCurrentEncounterId={(newEncounterId: string) =>
                            this.setState({ currentEncounterId: newEncounterId })
                        }
                        changeUnitEncounterData={(unitEncounterData: Record<string, UnitEncounterData>) =>
                            this.setState({ unitEncounterData })
                        }
                        changeUnits={(units: Record<string, UnitData>) => this.setState({ units })}
                        changeEncounters={(encounters: Record<string, Encounter>) => this.setState({ encounters })}
                        saveUnit={(unitId: string) => {
                            const newUnits = this.state.units;
                            newUnits[unitId].categoryId = this.state.currentCategoryId;
                            this.setState({ units: newUnits });
                        }}
                    />
                </div>
                <div style={{ flexGrow: 1, flexBasis: 1 }}>
                    <UnitPage
                        categories={this.state.categories}
                        currentCategoryId={this.state.currentCategoryId}
                        units={this.state.units}
                        getNextUnitId={this.getNextUnitId}
                        getNextCategoryId={this.getNextCategoryId}
                        changeCategoryId={(newCategoryId: string) =>
                            this.setState({ currentCategoryId: newCategoryId })
                        }
                        changeUnits={(units: Record<string, UnitData>) => this.setState({ units })}
                        changeCategories={(categories: Record<string, Category>) => this.setState({ categories })}
                        deleteUnit={(unitId: string) => {
                            const newUnitEncounterData = this.state.unitEncounterData;
                            Object.keys(newUnitEncounterData)
                                .filter(
                                    (unitEncounterDataId) =>
                                        newUnitEncounterData[unitEncounterDataId].unitId === unitId,
                                )
                                .forEach((unitEncounterDataId) => delete newUnitEncounterData[unitEncounterDataId]);
                            const newUnits = this.state.units;
                            delete newUnits[unitId];
                            this.setState({ units: newUnits, unitEncounterData: newUnitEncounterData });
                        }}
                        addUnitToEncounter={(unitId: string) => {
                            const newEncounterData: UnitEncounterData = {
                                id: this.getNextUnitEncounterDataId(),
                                unitId,
                                encounterId: this.state.currentEncounterId,
                                heldTurn: false,
                                initiative: undefined,
                                hp: undefined,
                            };
                            const newUnitEncounterData = this.state.unitEncounterData;
                            newUnitEncounterData[newEncounterData.id] = newEncounterData;

                            this.setState({ unitEncounterData: newUnitEncounterData });
                        }}
                    />
                </div>
            </div>
        );
    }
}

// TODO - handle no auth cookie
const authCookie = getCookie("Auth");
if (authCookie !== undefined) {
    APIHelper.getData().then(async (data) => {
        let state: LatestState;
        const localState = window.localStorage.getItem("playerState");
        if (localState) {
            state = JSON.parse(localState);
            if (state.version !== StateVersionHandler.DefaultState.version) {
                state = stateVersionHandler.update(JSON.parse(localState));
            }
            await APIHelper.putData(state);
            window.localStorage.removeItem("playerState");
        } else if (data.success && data.body.length > 0) {
            state = JSON.parse(data.body);
            if (state.version !== StateVersionHandler.DefaultState.version) {
                state = stateVersionHandler.update(JSON.parse(data.body));
            }
        } else {
            state = StateVersionHandler.DefaultState;
        }

        const domContainer = document.querySelector("#reactDom");
        ReactDOM.render(createElement(MainDiv, { state }), domContainer);
    });
} else {
    window.location.replace(`https://auth.markaronin.com?redirect=${encodeURIComponent(window.location.href)}`);
}
