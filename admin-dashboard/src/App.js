import React, { useState, useEffect } from 'react';
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

    const [vendors, setVendor] = useState([]);
    const [categories, setCategory] = useState([]);
    
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

    const addVendorToSQL = async (vendorName) => {
        // API call to main.go to add vendor
        console.log("sending vendor to SQL server:", vendorName);
    };

    const addCategoryToSQL = async (categoryName) => {
        // API call to main.go to add category
        console.log("sending category to SQL server:", categoryName);
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

    useEffect(() => {
        // need to be replaced with API calls that get a list of 
        // vendors and categories
        fetchVendors();
        fetchCategories();
    }, []);

    const fetchVendors = async() => {
        // API call from main.go
        console.log("fetched and updated list of current vendors:");
    };
    
    const fetchCategories = async() => {
        // API call from main.go
        console.log("fetched and updated list of current categories:");
    };

    return (
        <div className="app-container">
        <div className="container">
            <div>
                <h2>Choose what you would like to add below</h2>
                <select className="input" onChange={handleDropdown}>
                    <option>Products</option>
                    <option>Vendor</option>
                    <option>Category</option>
                </select>
            </div>

            {selectedOption === "Products" && (
                <div>
                    <select
                        className="input"
                        name="vendor"
                        value={newProduct.vendor}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Vendor</option>
                        {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.name}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="input"
                        name="category"
                        value={newCategory.vendor}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {["productName", "price", "quantity"].map(field => (
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

            {selectedOption === "Vendor" && (
                <div>
                    {["Vendor Name"].map(field => (
                        <input
                            key={field}
                            className="input"
                            type="text"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={newVendor[field]}
                            onChange={handleInputChange}
                        />
                    ))}

                    <button className="button" onClick={addVendorToSQL}>
                        Add Vendor
                    </button>
                </div>
            )}
            {selectedOption === "Category" && (
                <div>
                    {["Category Name"].map(field => (
                        <input
                            key={field}
                            className="input"
                            type="text"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={newCategory[field]}
                            onChange={handleInputChange}
                        />
                    ))}

                    <button className="button" onClick={addCategoryToSQL}>
                        Add Vendor
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

