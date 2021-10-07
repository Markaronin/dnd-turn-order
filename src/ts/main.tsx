import React, { Component, createElement } from "react";
import ReactDOM from "react-dom";
import { Encounter } from "./Encounter";
import { EncounterPage } from "./encounterpage/EncounterPage";
import { LatestState, StateVersionHandler, stateVersionHandler } from "./StateVersionHandler";
import { UnitData, UnitEncounterData } from "./Unit";

interface MainDivProps {}
class MainDiv extends Component<MainDivProps, LatestState> {
    private static readonly PlayerStateKey = "playerState";
    constructor(props: MainDivProps) {
        super(props);
        const loadedState = JSON.parse(
            window.localStorage.getItem(MainDiv.PlayerStateKey) || StateVersionHandler.DefaultStateString,
        );
        if (loadedState.version !== StateVersionHandler.DefaultState.version) {
            this.state = stateVersionHandler.update(loadedState);
        } else {
            this.state = loadedState;
        }
    }

    componentDidUpdate() {
        window.localStorage.setItem(MainDiv.PlayerStateKey, JSON.stringify(this.state));
    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                <EncounterPage
                    encounters={this.state.encounters}
                    currentEncounterId={this.state.currentEncounterId}
                    units={this.state.units}
                    unitEncounterData={this.state.unitEncounterData}
                    getNextUnitId={() => {
                        const nextUnitId = this.state.nextUnitId;
                        this.setState({ nextUnitId: nextUnitId + 1 });
                        return nextUnitId.toString();
                    }}
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
                    changeEncounter={(newEncounterId: string) => this.setState({ currentEncounterId: newEncounterId })}
                    changeUnitEncounterData={(unitEncounterData: UnitEncounterData[]) =>
                        this.setState({ unitEncounterData })
                    }
                    changeUnits={(units: Record<string, UnitData>) => this.setState({ units })}
                    changeEncounters={(encounters: Record<string, Encounter>) => this.setState({ encounters })}
                />
            </div>
        );
    }
}

const domContainer = document.querySelector("#reactDom");
ReactDOM.render(createElement(MainDiv), domContainer);
