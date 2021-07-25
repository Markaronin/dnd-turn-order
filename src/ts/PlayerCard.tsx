import React, { ChangeEvent, Component } from "react";
import { Player } from "./Player";

interface PlayerCardProps {
    player: Player
    handleChangePlayer: (newPlayer: Partial<Player>) => void;
    handleDeletePlayer: () => void;
    turn: boolean;
}
interface PlayerCardState {}
export class PlayerCard extends Component<PlayerCardProps, PlayerCardState> {
    constructor(props: PlayerCardProps) {
        super(props);
        this.state = {};
    }

    private handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.handleChangePlayer({name: event.currentTarget.value});
    }
    private handleInitiativeChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let initiative = undefined;
        if (event.currentTarget.value.length > 0) {
            initiative = parseInt(event.currentTarget.value);
        }
        this.props.handleChangePlayer({initiative});
    }
    private handleDexterityChange = (event: ChangeEvent<HTMLInputElement>): void => {
        let dexterity = undefined;
        if (event.currentTarget.value.length > 0) {
            dexterity = parseInt(event.currentTarget.value);
        }
        this.props.handleChangePlayer({dexterity});
    }
    private handleColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.handleChangePlayer({color: event.currentTarget.value});
    }
    private handleHeldTurnChange = (event: ChangeEvent<HTMLInputElement>): void => {
        this.props.handleChangePlayer({heldTurn: event.currentTarget.checked});
    }

    render() {
        const borderColor = this.props.turn ? "gold" : "black"
        return <div style={{
                border: `3px solid ${borderColor}`,
                margin: "2px",
                padding: "5px",
                borderRadius: "5px",
            }}>
            <input type="text" size={12} onChange={this.handleNameChange} placeholder="Name" value={this.props.player.name} />
            <br />
            <input type="number" style={{
                width: "55pt",
            }} onChange={this.handleInitiativeChange} placeholder="Initiative" value={this.props.player.initiative || ""} />
            <input type="number" style={{
                width: "55pt",
            }} onChange={this.handleDexterityChange} placeholder="Dexterity" value={this.props.player.dexterity || ""} />
            <br />
            <input type="color" onChange={this.handleColorChange} value={this.props.player.color}
                style={{
                    height: "50px",
                    width: "50px",
                    border: "none",
                    outline: "none",
                }}
            />
            <br />
            <label htmlFor={`heldTurn${this.props.player.id}`}>Held Turn: </label>
            <input 
                type="checkbox" 
                onChange={this.handleHeldTurnChange} 
                id={`heldTurn${this.props.player.id}`}
                checked={this.props.player.heldTurn} 
            />
            <br />
            <button onClick={this.props.handleDeletePlayer}>Delete</button>
        </div>;
    }
}