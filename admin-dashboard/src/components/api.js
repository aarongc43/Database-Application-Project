const API_BASE_URL = "http://localhost:8080";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
};

export const fetchCategoriesForVendor = async (vendor) => {

  const response = await fetch(`${API_BASE_URL}/categories/${vendor}`);

  return handleResponse(response);
};

export const fetchVendors = async() => {
  const response = await fetch(`${API_BASE_URL}/vendors`);

  return handleResponse(response);
};

export const fetchCategories = async(vendorName) => {

  const response = await fetch(`${API_BASE_URL}/categories/${vendorName}`);

  return handleResponse(response);
};

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/getProducts`);

  return handleResponse(response);
};

export const fetchTableData = async (tableName) => {
  const response = `${API_BASE_URL}/get${tableName}`;
  return handleResponse(response);
};

// submissions to backend
export const sendProductToSQL = async (product, credentials) => {
  
  const url = `${API_BASE_URL}/protected/products`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`), 
      },
      body: JSON.stringify(product), 
    });

  return handleResponse(response);
};

export const addVendorToSQL = async (vendorData, credentials) => {
  
  const url = `${API_BASE_URL}/protected/vendors`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`), 
      },
      body: JSON.stringify(vendorData), 
    });
  return handleResponse(response);
};

export const addCategoryToSQL = async (categoryData, credentials) => {
  
  const url = `${API_BASE_URL}/protected/categories`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`), 
      },
      body: JSON.stringify(categoryData), 
    });
  return handleResponse(response);
};

export const editProductSQL = async (product, credentials) => {
  console.log(`Trying to contact SQL", ${product.productID}`);
  const url = `${API_BASE_URL}/protected/products/${product.productID}`;

  const response = await fetch(url, {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
    },
    body: JSON.stringify(product),
  });
  return handleResponse(response);
};

export const deleteProductSQL = async (productID, credentials) => {
  
  const url = `${API_BASE_URL}/protected/products/${productID}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization' : 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),  
    },
  });
  return handleResponse(response);
};
