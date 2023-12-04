import React from 'react';

// button component
const TableButton = ({name, isSelected, onClick}) => (
    <button
        className={`tab-button ${isSelected ? "active" : ""}`}
        onClick={() => onClick(name)}
    >
    {name}
    </button>
);

// component to render all table view buttons
const TableViews = ({selectedTab, handleTabChange}) => {
    const tables = ["Products", "Order Details"]; 

    return(
        <div className="tab-buttons">
            {tables.map(table => (
                <TableButton
                key={table}
                name={table}
                isSelected={selectedTab === table}
                onClick={handleTabChange}
                />
            ))}
        </div>
    );
};

export default TableViews;

