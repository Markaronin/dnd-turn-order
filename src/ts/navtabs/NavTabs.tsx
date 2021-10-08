import React from "react";
import { NavTab } from "./NavTab";
import "./NavTabs.less";

interface NavTabsProps {
    name: string;
    tabs: { id: string; name: string }[];
    currentTabId: string;
    changeTab: (newId: string) => void;
    addNewTab: () => void;
    editTabName: (id: string, newName: string) => void;
}

export const NavTabs = ({ name, tabs, currentTabId, changeTab, addNewTab, editTabName }: NavTabsProps): JSX.Element => {
    return (
        <div className="navTabs">
            {tabs.map((tab) => (
                <NavTab
                    key={tab.id}
                    active={currentTabId === tab.id}
                    name={tab.name}
                    changeName={(newName: string) => editTabName(tab.id, newName)}
                    focusTab={() => changeTab(tab.id)}
                />
            ))}
            <button onClick={addNewTab} className="addNewTabButton">
                Add new {name}
            </button>
        </div>
    );
};
