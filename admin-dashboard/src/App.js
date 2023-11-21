import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ''

function App() {
    
    // state hooks for the components
    const [selectedOption, setSelectedOption] = useState("Products");
    const [selectedTab, setSelectedTab] = useState("Customers");
    const [vendors, setVendors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");
    const [newVendor, setNewVendor] = useState({ name:""});
    const [newCategory, setNewCategory] = useState({ name: ""});
    const [priceInput, setPriceInput] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // go server is seeing this as an object
    const [newProduct, setNewProduct] = useState({
        vendor: "",
        category: "",
        productName: "",
        price: "",
        quantity: "",
        description: ""
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchVendors();
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchVendorCategories = async () => {
            if (selectedVendor) {
                await fetchCategories(selectedVendor);
            }
        };
        fetchVendorCategories();
    }, [selectedVendor]);

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

    const fetchTableData = async (tableName) => {
        setLoading(true);
        setError(null);

        // TODO Add API call logic
        setLoading(false);
        console.log(`Fetching data for ${tableName}`);
    };

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
    const fetchCategories = async(vendorName) => {
        if (!vendorName) {
            // the categories drop down list will be empty if a vendor is not
            // selected
            setCategories([]);
        }
    
        try {
            setLoading(true);
            setError(null);
            console.log(vendorName);
            const response = await fetch(`http://localhost:8080/categories/${vendorName}`);
            
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

    //handlers
    const handleDropdown = e => setSelectedOption(e.target.value);
    // input change handler for product form
    const handleInputChange = e => {
        const { name, value } = e.target;

        setNewProduct(prev => ({ ...prev, [name]: value }));

        if (name === "vendor") {
            fetchCategoriesForVendor(value);
            setSelectedVendor(value);
        }
    };
    
    // restrict price input
    const handlePriceInputChange = (e) => {
        const value = e.target.value.replace(/[^\d.]/g, '');
        setPriceInput(value);
    };

    // form submission handler for products
    const handleSubmit = () => {
        sendProductToSQL(newProduct);
        console.log("New Product:", newProduct);
    }

    const handleFocus = () => {
        setIsInputFocused(true);
        setPriceInput(priceInput.replace(/^\$/, ''));
    };

    const handleBlur = () => {
        setIsInputFocused(false);
        setPriceInput(formatPriceDisplay(priceInput));
    };

    // handles tab switching logic and data fetching based on a selected tab
    const handleTabChange = (table) => {
        setSelectedTab(table);
        fetchTableData(table.toLowerCase());
    };

    // submissions to backend
    const sendProductToSQL = async (product) => {
        
        const username = prompt("Enter your username:");
        const password = prompt("Enter your password:");

        const santizedProduct = {
            ...product,
            price: product.price.replace(/[^\d.]/g, ''),
        };

        //console.log(username);
        //console.log(password);
        
        try {
            const url = 'http://localhost:8080/protected/products';
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(username + ':' + password), 
                },
                body: JSON.stringify(santizedProduct), 
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                toast.error(`Error sending product data: ${errorMessage}`);
            } else {
                toast.success('Product data stored successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            
        } catch (error) {
            toast.error(`Error sending product data: ${error.message}`);
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

    const formatPriceDisplay = (value) => {
        return value ? `$${value}` : '';
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
                            value={selectedVendor}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Vendor</option>
                            {Object.entries(vendors).map(([vendorId, vendorName]) => (
                                <option key={vendorId} value={vendorName}>
                                    {vendorName}
                                </option>
                            ))}
                        </select>

                        <select
                            className="input"
                            name="category"
                            value={newProduct.category}
                            onChange={handleInputChange}
                            disabled={!selectedVendor} // Disable the dropdown if no vendor is selected
                        >
                            <option value="">Select Category</option>
                            {categories.map(categoryName => (
                                <option key={categoryName} value={categoryName}>
                                    {categoryName}
                                </option>
    ))}
                        </select>
                    <div className="input-group">
                        <input
                            className="input"
                            type="text"
                            placeholder="ProductName"
                            name="productName"
                            value={newProduct.productName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="input"
                            type="text"
                            placeholder="Price"
                            name="price"
                            value={isInputFocused ? priceInput : formatPriceDisplay(priceInput)}
                            onChange={handlePriceInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="input"
                            type="text"
                            placeholder="Quantity"
                            name="quantity"
                            value={newProduct.quantity}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-group">
                            <textarea
                                className="input"
                                type="text"
                                placeholder="Description"
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                            ></textarea>
                    </div>

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
        <ToastContainer />
        </div>
    );
}

export default App;

