import React, { ChangeEvent, KeyboardEvent, useState } from "react";

interface NavTabProps {
    active: boolean;
    name: string;
    changeName: (newName: string) => void;
    focusTab: () => void;
}

export const NavTab = ({ active, name, changeName, focusTab }: NavTabProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState("");

    if (editing) {
        return (
            <input
                value={newName}
                onKeyDown={(event: KeyboardEvent) => {
                    if (event.key === "Enter") {
                        changeName(newName);
                        setEditing(false);
                    } else if (event.key === "Escape") {
                        setEditing(false);
                    }
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setNewName(event.currentTarget.value);
                }}
            />
        );
    } else {
        return (
            <button
                className={active ? "tabButton active" : "tabButton"}
                onClick={() => {
                    if (active) {
                        setNewName(name);
                        setEditing(true);
                    } else {
                        focusTab();
                    }
                }}
            >
                {name}
            </button>
        );
    }
};
