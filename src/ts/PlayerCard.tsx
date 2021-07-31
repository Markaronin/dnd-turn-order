import React, { ChangeEvent, Component } from "react";
import { Player } from "./Player";
import { parseColor } from "./util";

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
        const borderColor = this.props.turn ? "gold" : "rgb(60, 60, 60)";
        let textColor = "white";
        if (parseColor(this.props.player.color).reduce((x, y) => x + y, 0) > (255 * 2)) {
            textColor = "black";
        }
        return <div style={{
                border: `3px solid ${borderColor}`,
                margin: "2px",
                padding: "5px",
                borderRadius: "5px",
                backgroundColor: this.props.player.color,
                color: textColor,
            }}>
            <input type="text" size={12} onChange={this.handleNameChange} placeholder="Name" value={this.props.player.name} />
            <br />
            <input 
                type="number" 
                style={{
                    width: "55pt",
                }} 
                onChange={this.handleInitiativeChange} 
                max="30" 
                min="0"
                placeholder="Initiative" 
                value={this.props.player.initiative || ""} 
            />
            <input 
                type="number" 
                style={{
                    width: "55pt",
                }} 
                min="0"
                max="25"
                onChange={this.handleDexterityChange} 
                placeholder="DEX" 
                value={this.props.player.dexterity || ""} 
            />
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
