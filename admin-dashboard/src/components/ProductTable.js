import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Paper, TableContainer, Typography } from '@mui/material';
import '../App.css';

function ProductTable({ products, editProduct, deleteProduct }) {
    // State to keep track of selected products
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Determines if a productId is selected
    const isSelected = (productID) => selectedProducts.some((p) => p.productID === productID);

    // Handle the selection of a product
    const handleSelect = (product) => {
        const selectedIndex = selectedProducts.findIndex(p => p.productID === product.productID);
        let newSelectedProducts;

        if (selectedIndex === -1) {
            newSelectedProducts = [...selectedProducts, product];
        } else {
            newSelectedProducts = selectedProducts.filter((p) => p.productID !== product.productID);
        }

        console.log(newSelectedProducts);
        setSelectedProducts(newSelectedProducts);
    };

    // Check if any product is selected
    const isAnyProductSelected = selectedProducts.length > 0;

    // Edit handler
    const handleEdit = () => {
        if (editProduct && typeof editProduct === 'function') {
            editProduct(selectedProducts);
        }
    };

    // Delete handler
    const handleDelete = () => {
        if (deleteProduct && typeof deleteProduct === 'function') {
            deleteProduct(selectedProducts);
        }
    };

    return (
        <TableContainer 
            component={Paper}
            className="container"
            sx={{
                overflow: 'auto',
                maxWidth: '100%',
                margin: '10px 0',
                width: '95%', // Ensure this matches your design's requirements
                boxShadow: 'none', // Removes the shadow
                borderRadius: '10px', // Applies the border-radius
                backgroundColor: '#383c44', // Matches your container background color
                '& .MuiPaper-root': { // Targets nested Paper component styles
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Typography variant="h6" style={{ color: '#F3DE8A', marginBottom: '20px' }}>
                Products 
            </Typography>
            {/* action buttons*/}
            <div style={{ marginBottom: '20px' }}>
                <Button 
                    className="productTableButton" 
                    variant="contained" 
                    color="primary" 
                    onClick={handleEdit} disabled={!isAnyProductSelected}>
                    Edit
                </Button>
                <Button 
                    className="productTableButton" 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleDelete} disabled={!isAnyProductSelected}>
                    Delete
                </Button>
            </div>
            <table className="ProductsTable" aria-label="product table">
                <thead>
                    <tr>
                        {['Select', 'Product ID', 'Name', 'Price', 'Quantity', 'Description'].map((headCell) => (
                            <th key={headCell}>
                                {headCell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.productID}>
                                <td>
                                    <Checkbox
                                        className="productCheckbox"
                                        checked={isSelected(product.productID)}
                                        onChange={() => handleSelect(product)}
                                        sx={{
                                            color: '#F3DE8A', // Example color
                                            '&.Mui-checked': {
                                            color: '#F3DE8A', // Example color when checked
                                            },
                                        }}
                                    />
                                </td>
                                <td data-label="Product ID">{product.productID}</td>
                                <td data-label="Name">{product.productName}</td>
                                <td data-label="Price" align="right">{product.price}</td>
                                <td data-label="Quantity" align="right">{product.quantity}</td>
                                <td data-label="Description">{product.description}</td>
                            </tr>
                        ))
                    ) : (
                            <tr>
                                <td colSpan={5} align="center" style={{ padding: '20px', color: '#F3DE8A' }}>
                                    No products found
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
        </TableContainer>
    );
}

ProductTable.propTypes = {
    products: PropTypes.array.isRequired,
    editProduct: PropTypes.func,
    deleteProduct: PropTypes.func,
};

export default ProductTable;

