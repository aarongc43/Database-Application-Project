import React, { useState } from 'react';
import './App.css';

function App() {
    const [selectedOption, setSelectedOption] = useState("Products");
    const [newProduct, setNewProduct] = useState({
        category: "",
        vendor: "",
        productName: "",
        price: "",
        quantity: "",
        description: ""
    });
    
    const [selectedTab, setSelectedTab] = useState("Customers");

    const handleDropdown = e => setSelectedOption(e.target.value);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    // API Call placeholder
    const sendProductToSQL = async (product) => {
        // API call logic
        console.log("sending product to SQL server:", product);
    };
    /*
    POST  payload
        - catergory: string
        - vendor: string
        - productName: string
        - price: int
        - quantity: int
        - description: text
     */

    const handleSubmit = () => {
        sendProductToSQL(newProduct);
        console.log("New Product:", newProduct);
    }

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTableData = async (tableName) => {
        setLoading(true);
        setError(false);

        // TODO Add API call logic
        setLoading(false);
        console.log('Fetching data for ${tableName}');
    };

    const handleTabChange = (table) => {
        setSelectedTab(table);
        fetchTableData(table.toLowerCase());
    };

    return (
        <div className="app-container">
        <div className="container">
            <div>
                <select className="input" onChange={handleDropdown}>
                    <option>Products</option>
                </select>
            </div>

            {selectedOption === "Products" && (
                <div>
                    {["category", "vendor", "productName", "price", "quantity"].map(field => (
                        <input
                            key={field}
                            className="input"
                            type="text"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={newProduct[field]}
                            onChange={handleInputChange}
                        />
                    ))}
                    <textarea
                        className="input"
                        placeholder="Product Description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                    ></textarea>

                    <button className="button" onClick={handleSubmit}>
                        Add Product
                    </button>
                </div>
            )}
        </div>

        <div className="tab-container">
            <div className="tab-buttons">
                {["Customers", "Address", "Payments", "Orders", "Order Details", "Products", "Categories", "Vendors", "Employess", "Login Creds"].map(table => (
                    <button
                        key={table}
                        className={`tab-button ${selectedTab === table ? "active" : ""}`}
                        onClick={() => handleTabChange(table)}
                    >
                        {table}
                    </button>
                ))}
            </div>

            <div>
                {loading ? "Loading..." : error ? error : JSON.stringify(tableData)}
            </div>
        </div>
        </div>
    );
}

export default App;

