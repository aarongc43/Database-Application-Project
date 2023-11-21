import React from 'react';

function FormsUI ({
  selectedOption,
  selectedVendor,
  handleInputChange,
  vendors,
  newProduct,
  priceInput,
  isInputFocused,
  formatPriceDisplay,
  handlePriceInputChange,
  handleFocus,
  handleBlur,
  handleSubmit,
  categories,
  newVendor,
  setNewVendor,
  addVendorToSQL,
  newCategory,
  setNewCategory,
  addCategoryToSQL
}) {
  return (
    <div>
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
  );
}

export default FormsUI;
