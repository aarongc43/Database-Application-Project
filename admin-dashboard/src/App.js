import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import TableViews from './components/TableViews.js';
import FormsUI from './components/FormsUI.js';
import ProductTable from './components/ProductTable.js';
import {
    fetchVendors, 
    fetchCategories, 
    fetchProducts, 
    fetchTableData,
    fetchCategoriesForVendor,
    sendProductToSQL,
    addVendorToSQL,
    addCategoryToSQL
} from './components/api.js';

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
    const initialNewProductState = {
        vendor: "",
        category: "",
        productName: "",
        price: "",
        quantity: "",
        description: ""
    };

    // helper functions for loading and error updates
    const [newProduct, setNewProduct] = useState(initialNewProductState);
    const updateState = (setter) => (data) => setter(data);
    const updateLoading = (isLoading) => setLoading(isLoading);
    const updateError = (err) => {
        console.error(err);
        setError(err.message);
        toast.error(err.message);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const data = await fetchVendors();
                if (isMounted) {
                    setVendors(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchInitialData();
        return () => {isMounted = false};
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchVendorCategories = async () => {
            if (selectedVendor) {
                setLoading(true);
                try {
                    const data = await fetchCategories(selectedVendor);
                    if (isMounted) {
                        setCategories(data);
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                // empty categories if no vendor is selected
                setCategories([]);
            }
        };

        fetchVendorCategories();
        return () => {isMounted = false};
    }, [selectedVendor]);

    //handlers
    const handleDropdown = e => setSelectedOption(e.target.value);

    // input change handler for product form
    const handleInputChange = e => {
        const { name, value } = e.target;

        if (name === "vendor") {
            setSelectedVendor(value);
            fetchCategoriesForVendor(value)
                .then(updateState(setCategories))
                .catch(error => toast.error(error.message));
        } else {
            setNewProduct(prev => ({...prev, [name]: value}));
        }
    };

    // restrict price input
    const handlePriceInputChange = (e) => {
        const value = e.target.value.replace(/^\$/, '');
        if (/^\d*(\.\d{0,2})?$/.test(value) || value === '') {
            setPriceInput(value);
            setNewProduct(prevProduct => ({
                ...prevProduct,
                price: value
            }));
        }
    };

    // form submission handler for products
    const handleSubmit = async () => {
        setLoading(true);
        const credentials = getCredentials();

        try {
            await sendProductToSQL(newProduct, credentials);

            toast.success('Product added successfully!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            setNewProduct(initialNewProductState);
        } catch (error) {
            toast.error(`Error sending product data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // handles tab switching logic and data fetching based on a selected tab
    const handleTabChange = async (tableName) => {
        setSelectedTab(tableName);
        setLoading(true);
        try {
            const data = await fetchProducts();
            console.log(data);
            setTableData(data);
        } catch (error) {
            toast.error(`Error sending product data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getCredentials = () => {
        const username = prompt("Enter your username:");
        const password = prompt("Enter your password:");
        return { username, password };
    };

    const handleFocus = () => {
        setIsInputFocused(true);
        setPriceInput(priceInput.replace(/^\$/, ''));
    };

    const handleBlur = () => {
        setIsInputFocused(false);
        setPriceInput(formatPriceDisplay(priceInput));
    };


    const formatPriceDisplay = (value) => {
        if (value.startsWith('$')) {
            return value;
        }
        return `$${value}`;
    };


    return (
        <div className="app-container">
            <div className="container">
                <h2>Choose what you would like to add below</h2>
                <select className="input" onChange={handleDropdown}>
                    <option>Products</option>
                    <option>Vendor</option>
                    <option>Category</option>
                </select>
                <FormsUI
                    selectedOption={selectedOption}
                    selectedVendor={selectedVendor}
                    handleInputChange={handleInputChange}
                    vendors={vendors}
                    newProduct={newProduct}
                    priceInput={priceInput}
                    isInputFocused={isInputFocused}
                    formatPriceDisplay={formatPriceDisplay}
                    handlePriceInputChange={handlePriceInputChange}
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                    categories={categories}
                    newVendor={newVendor}
                    setNewVendor={setNewVendor}
                    addVendorToSQL={addVendorToSQL}
                    newCategory={newCategory}
                    setNewCategory={setNewCategory}
                    addCategoryToSQL={addCategoryToSQL}
                />
            </div>
            <div className="tab-container">
                <TableViews
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}
                />
                {selectedTab === 'Products' && <ProductTable products={tableData} />}
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
