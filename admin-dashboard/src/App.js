import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // state hooks for the components
    const [selectedOption, setSelectedOption] = useState("Products");
    const [newProduct, setNewProduct] = useState({
        category: "",
        vendor: "",
        productName: "",
        price: "",
        quantity: "",
        description: ""
    });

    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newVendor, setNewVendor] = useState({ name: "" });
    const [newCategory, setNewCategory] = useState({ name: ""});
    
    const [selectedTab, setSelectedTab] = useState("Customers");

    // dropdown handler
    const handleDropdown = e => setSelectedOption(e.target.value);

    // input change handler for product form
    const handleInputChange = e => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    // API Call placeholder
    // Expected input
    //   category: string,
    //   vendor: string,
    //   productName: string,
    //   price: string,
    //   quantity: string,
    //   description: string
    const sendProductToSQL = async (product) => {
        // API call logic
        // console.log might need to be replaced by the API call to the backend
        // because it is interacting with the database directly?
        console.log("sending product to SQL server:", product);
    };

    // Expected input: vendorName string
    const addVendorToSQL = async (vendorName) => {
        // API call to main.go to add vendor
        // console.log might need to be replaced by the API call to the backend
        // because it is interacting with the database directly?
        console.log("sending vendor to SQL server:", vendorName);
    };

    
    // Expected input: categoryName string
    const addCategoryToSQL = async (categoryName) => {
        // API call to main.go to add category
        // console.log might need to be replaced by the API call to the backend
        // because it is interacting with the database directly?
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

    // form submission handler for products
    const handleSubmit = () => {
        sendProductToSQL(newProduct);
        console.log("New Product:", newProduct);
    }

    // for managing state functions, still learning states so they may be wrong
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // fetch data for a given table from sql database
    const fetchTableData = async (tableName) => {
        setLoading(true);
        setError(null);

        // TODO Add API call logic
        setLoading(false);
        console.log(`Fetching data for ${tableName}`);
    };

    // handles tab switching logic and data fetching based on a selected tab
    const handleTabChange = (table) => {
        setSelectedTab(table);
        fetchTableData(table.toLowerCase());
    };

    // this is to load the initial vendor and category data from the database
    useEffect(() => {
        // need to be replaced with API calls that get a list of 
        // vendors and categories
        const fetchInitialData = async () => {
            await fetchVendors();
            await fetchCategories();
        };
       // calling fetch initial data function 
        fetchInitialData();
    }, []);

    // Expected output: updates the 'vendors' state with a list of current vendors
    // API call to fetch vendors from sql database
    const fetchVendors = async() => {
        // API call from main.go
        // will need to add try catch for error handling
        console.log("fetched and updated list of current vendors:");
    };
    
    // Expected output: updates the 'categories' state with a list of current categories
    // API call to categories vendors from sql database
    const fetchCategories = async() => {
        // API call from main.go
        // will need to add try catch for error handling
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
                            <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="input"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
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
                            name="name"
                            value={newVendor.name}
                            onChange={(e) => setNewVendor({ name: e.target.value})}
                        />
                    ))}

                    <button className="button" onClick={() => addVendorToSQL(newVendor.name)}>
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
                            placeholder="Category Name"
                            name="name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ name: e.target.value })}
                        />
                    ))}

                    <button className="button" onClick={() => addCategoryToSQL(newCategory.name)}>
                        Add Category
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

