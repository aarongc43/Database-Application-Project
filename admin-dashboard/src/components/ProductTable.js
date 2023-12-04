import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Paper, TableContainer, Typography } from '@mui/material';
import '../App.css';

function ProductTable({products, onEditSubmit, editingProductId, setEditingProductId, editProduct, deleteProduct}) {
    // State to keep track of selected products
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editFormData, setEditFormData] = useState({});

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
        if (isAnyProductSelected && selectedProducts.length === 1) {
        // Assuming you want to edit only one product at a time
        const productToEdit = selectedProducts[0];
        handleEditClick(productToEdit);
    } else {
        // Handle the case where no product is selected or multiple products are selected
        // Maybe show a warning using toast
    }
    };

    const handleEditClick = (product) => {
    setEditingProductId(product.productID);
    setEditFormData({
        productID: product.productID,
        productName: product.productName,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
    });
  };

    const handleCancelClick = () => {
    setEditingProductId(null);
  };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

    const handleSaveClick = () => {
        console.log('Edit form data to submit:', editFormData);
        onEditSubmit(editFormData);
        setEditingProductId(null);
    };

    const handleDelete = () => {
        if (selectedProducts.length > 0) {
            deleteProduct(selectedProducts);
        } else {
            // Show warning or error if no product is selected
        }
    };

    const editableFieldStyle = {
        backgroundColor: "#4B5267",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
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
                    onClick={handleEdit} 
                    disabled={!isAnyProductSelected}>
                    Edit
                </Button>
                <Button 
                    className="productTableButton" 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleDelete} 
                    disabled={!isAnyProductSelected}>
                    Delete
                </Button>
            </div>
            <table className="ProductsTable" aria-label="product table">
                <thead>
                    <tr>
                        {['Select', 'Product ID','Vendor', 'Category', 'Name', 'Price', 'Quantity', 'Description'].map((headCell) => (
                            <th key={headCell}>
                                {headCell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
    products.map((product) => {
      if (editingProductId === product.productID) {
        // Render the editable row
        return (
          <tr key={product.productID}>
            <td>
              <button onClick={handleSaveClick}>Confirm</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </td>
            <td>
              <input
                type="text"
                name="productID"
                value={editFormData.productID}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
            <td>
              <input
                type="text"
                name="Vendor"
                value={editFormData.vendor}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
            <td>
              <input
                type="text"
                name="Category"
                value={editFormData.category}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
            <td>
              <input
                type="text"
                name="productName"
                value={editFormData.productName}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
            <td>
              <input
                type="text"
                name="price"
                value={editFormData.price}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
            <td>
              <input
                type="text"
                name="quantity"
                value={editFormData.quantity}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
            <td>
              <input
                type="text"
                name="description"
                value={editFormData.description}
                onChange={handleFormChange}
                style={editableFieldStyle}
              />
            </td>
          </tr>
        );
      } else {

        return (
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
                                <td data-label="Vendor"> {product.vendor}</td>
                                <td data-label="Category"> {product.category}</td>
                                <td data-label="Name">{product.productName}</td>
                                <td data-label="Price" align="right">{product.price}</td>
                                <td data-label="Quantity" align="right">{product.quantity}</td>
                                <td data-label="Description">{product.description}</td>
                            </tr>
                            );
                        }
                        })
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

