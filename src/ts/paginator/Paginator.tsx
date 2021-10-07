import React from "react";
import "./Paginator.less";

interface PaginatorProps {
    pages: { id: string; name: string }[];
    currentPageId: string;
    items: JSX.Element[];
    changePage: (newPageId: string) => void;
    addNewPage: () => void;
}

export const Paginator = ({ pages, currentPageId, items, changePage, addNewPage }: PaginatorProps): JSX.Element => {
    return (
        <div>
            <div>
                {pages.map((page) => (
                    <button
                        key={page.id}
                        className={currentPageId === page.id ? "changePageButton currentPage" : "changePageButton"}
                        onClick={() => changePage(page.id)}
                    >
                        {page.name}
                    </button>
                ))}
                <button onClick={addNewPage} className="addNewPageButton">
                    Add New Page
                </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>{items}</div>
        </div>
    );
};
