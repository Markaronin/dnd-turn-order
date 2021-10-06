import React, { Component, createElement } from "react";
import ReactDOM from "react-dom";
import { Player } from "./Player";
import { PlayerCard } from "./PlayerCard";

interface MainDivState {
    players: Record<string, Player>;
    turn: number;
    nextId: number;
}
interface MainDivProps {}
class MainDiv extends Component<MainDivProps, MainDivState> {
    private static readonly PlayerStateKey = "playerState";
    private static readonly DefaultState = '{"players": {}, "turn": 0, "nextId": 0}';
    constructor(props: MainDivProps) {
        super(props);
        this.state = JSON.parse(window.localStorage.getItem(MainDiv.PlayerStateKey) || MainDiv.DefaultState);
    }

    componentDidUpdate() {
        window.localStorage.setItem(MainDiv.PlayerStateKey, JSON.stringify(this.state));
    }

    private handleNewPlayer = (): void => {
        const newPlayers = this.state.players;
        const id = this.state.nextId;
        newPlayers[id] = {
            id,
            initiative: undefined,
            dexterity: undefined,
            hp: undefined,
            name: "",
            heldTurn: false,
            color: "#222222",
        };
        this.setState({players: newPlayers, nextId: id + 1})
    }

    render() {
        return <div style={{width: "100%"}}>
            <div style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
                {Object.entries(this.state.players)
                    .sort((a, b) => {
                        if (a[1].initiative === b[1].initiative) {
                            return (b[1].dexterity || 0) - (a[1].dexterity || 0)
                        } else {
                            return (b[1].initiative || 0) - (a[1].initiative || 0)
                        }
                    })
                    .map((player, i) => 
                        <PlayerCard 
                            player={player[1]} 
                            key={player[0]}
                            turn={this.state.turn == i} 
                            handleChangePlayer={(playerInfo: Partial<Player>) => {
                                const newPlayers = this.state.players;
                                newPlayers[player[0]] = {...newPlayers[player[0]], ...playerInfo};
                                this.setState({players: newPlayers});
                            }}
                            handleDeletePlayer={() => {
                                const newPlayers = this.state.players;
                                delete newPlayers[player[0]];
                                this.setState({players: newPlayers, turn: this.state.turn < Object.values(this.state.players).length ? this.state.turn : 0});
                            }}
                        />
                    )
                }
            </div>
            <button onClick={this.handleNewPlayer} id="newPlayerButton">Add New</button>
            {Object.values(this.state.players).length > 0 && <button onClick={() => this.setState({turn: (this.state.turn + 1) % Object.values(this.state.players).length})} id="nextTurnButton">Next Turn</button>}
        </div>;
    }
}

const domContainer = document.querySelector("#reactDom");
ReactDOM.render(createElement(MainDiv), domContainer);
