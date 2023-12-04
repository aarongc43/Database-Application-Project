import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import TableViews from './components/TableViews.js';
import FormsUI from './components/FormsUI.js';
import ProductTable from './components/ProductTable.js';
import OrderDetails from './components/OrderDetails.js';
import {
    fetchVendors, 
    fetchCategories, 
    fetchProducts, 
    fetchTableData,
    fetchOrderDetails,
    fetchCategoriesForVendor,
    sendProductToSQL,
    addVendorToSQL,
    addCategoryToSQL,
    editProductSQL,
    deleteProductSQL
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [orderDetailTableData, setOrderDetailTableData] = useState([]);

    // go server is seeing this as an object
    const initialNewProductState = {
        vendor: "",
        category: "",
        productName: "",
        price: "",
        quantity: "",
        description: ""
    };

    const orderDetailData = {
        productID: "",
        orderID: "",
        quantity: "",
    }

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
                toast.error(`Error occurred: ${error.message}`);
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
            let data;
            if (tableName === "Products") {
                data = await fetchProducts();
                console.log(data);
                setTableData(data);
            } else if (tableName === "Order Details") {
                data = await fetchOrderDetails();
                setOrderDetailTableData(data);
                console.log(data);
            }
        } catch (error) {
            toast.error(`Error sending product data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle editing a product
    const editProduct = (product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    // Function to close the edit modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentProduct(null);
    };

    // Function to handle the submission of the edited product
    const submitEditProduct = async (editedProduct) => {
        const credentials = getCredentials();
        try {
            await editProductSQL(editedProduct, credentials); 
            toast.success('Product updated successfully!');
            closeEditModal();
            // Refresh the products list
            const updatedProducts = await fetchProducts();
            setTableData(updatedProducts);
        } catch (error) {
            toast.error(`Error updating product: ${error.message}`);
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

    const handleDelete = async (selectedProducts) => {
        if (!selectedProducts.length || !window.confirm('Are you sure you want to delete the selected products?')) {
            return;
        }

        const credentials = getCredentials();
        try {
            for (const product of selectedProducts) {
                await deleteProductSQL(product.productID, credentials); // Assuming deleteProductSQL is your API call function
            }

            toast.success('Product(s) deleted successfully!');
            const updatedProducts = await fetchProducts(); // fetch the updated list of products
            setTableData(updatedProducts);
        } catch (error) {
            toast.error(`Error deleting product: ${error.message}`);
        }
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
            </div>
            <div className="table-container">
                {selectedTab === 'Products' ?  (
                <ProductTable 
                    products={tableData} 
                    onEditSubmit={submitEditProduct}
                    editingProductId={editingProductId}
                    setEditingProductId={setEditingProductId}
                    editProduct={editProduct} 
                    deleteProduct={handleDelete}
                   />
                ) : selectedTab === 'Order Details' ? (
                <OrderDetails
                    orderDetails={orderDetailTableData}
                    />
                    ) : null}
            </div>
            <ToastContainer />
        </div>
    );
}

export default App;
