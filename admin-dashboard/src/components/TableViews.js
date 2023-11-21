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
    // list of tables we want to for from sql
    const tables = ["Products", "Vendors", "categories", 
        "customers", "employee", "logincreds", "orderdetails", "orders"]; 

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

