import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    
    // state hooks for the components
    const [selectedOption, setSelectedOption] = useState("Products");
    const [newProduct, setNewProduct] = useState({
        vendor: "",
        category: "",
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

        if (name === "vendor") {
            fetchCategoriesForVendor(value);
        }
    };

    const fetchCategoriesForVendor = async (vendorId) => {
        if (!vendorId) {
            // the categories drop down list will be empty if a vendor is not
            // selected
            setCategories([]);
        }
        
        try {
            setLoading(true);
            // this needs to change
            const response = await fetch(`http://localhost:8080/categories/${newProduct.vendor}`);
            if (!response.ok) {
                throw new Error('Failed to "fetch" categories for vendor');
                }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    // API Call placeholder
    // Expected input
    //   category: string,
    //   productName: string,
    //   price: string,
    //   quantity: string,
    //   description: string
    const sendProductToSQL = async (product) => {
        try {
            const url = 'http://localhost:8080/products';
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(product), 
            });
    
            if (!response.ok) {
                throw new Error(`Failed to send product data: ${response.status}`);
            }
            console.log('Product data sent successfully:', product); //replace with front end banner
        } catch (error) {
            console.error('Error sending product data:', error); //replace with front end banner
            
        }
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
        const fetchInitialData = async () => {
            await fetchVendors();
            // await fetchCategories();
        };
       // calling fetch initial data function 
        fetchInitialData();
    }, []);

    // Expected output: updates the 'vendors' state with a list of current vendors
    // API call to fetch vendors from sql database
    const fetchVendors = async() => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("http://localhost:8080/vendors"); //probably a better way to do this
            
            if (!response.ok) {
                throw new Error('Failed to fetch vendors');
            }

            const data = await response.json();

            setVendors(data);
            console.log(data);

            setLoading(false);
        } catch (error) {
            setError('An error occurred while fetching vendors: ' + error.message);
            setLoading(false);
        }
        console.log("fetched and updated list of current vendors:");
    };
    
    // Expected output: updates the 'categories' state with a list of current categories
    // API call to categories vendors from sql database
    const fetchCategories = async() => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("http://localhost:8080/categories"); //probably a better way to do this
            
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();

            setCategories(data);
            console.log(data);

            setLoading(false);
        } catch (error) {
            setError('An error occurred while fetching categories: ' + error.message);
            setLoading(false);
        }
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
                        {Object.entries(vendors).map(([vendorId, vendorName]) => (
                            <option key={vendorId} value={vendorId}>
                                {vendorName}
                            </option>
                        ))}
                    </select>

                    <select
                        className="input"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        // disabling category drop down because a vendor needs
                        // to be selected first
                        disabled={!newProduct.vendor}
                    >
                        <option value="">Select Category</option>
                        {Object.entries(categories).map(([categoryId, categoryName]) => (
                            <option key={categoryId} value={categoryName}>
                                {categoryName}
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

