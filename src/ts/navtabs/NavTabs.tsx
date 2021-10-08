import React from "react";
import "./NavTabs.less";

interface NavTabsProps {
    name: string;
    tabs: { id: string; name: string }[];
    currentTabId: string;
    changeTab: (newId: string) => void;
    addNewTab: () => void;
}

export const NavTabs = ({ name, tabs, currentTabId, changeTab, addNewTab }: NavTabsProps): JSX.Element => {
    return (
        <div>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={currentTabId === tab.id ? "tabButton active" : "tabButton"}
                    onClick={() => changeTab(tab.id)}
                >
                    {tab.name}
                </button>
            ))}
            <button onClick={addNewTab} className="addNewTabButton">
                Add new {name}
            </button>
        </div>
    );
};
