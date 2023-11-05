import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState({ customers: [], products: [], orders: [] });

  useEffect(() => {
    // Fetch Customers
    fetch('/api/customers')
      .then((res) => res.json())
      .then((customers) => setData((prev) => ({ ...prev, customers })));

    // Fetch Products
    fetch('/api/products')
      .then((res) => res.json())
      .then((products) => setData((prev) => ({ ...prev, products })));

    // Fetch Orders
    fetch('/api/orders')
      .then((res) => res.json())
      .then((orders) => setData((prev) => ({ ...prev, orders })));
  }, []);

  const handleDropdown = (selection) => {
    // Handle dropdown selection
  };

  return (
    <div>
      <select onChange={(e) => handleDropdown(e.target.value)}>
        <option>Customers</option>
        <option>Products</option>
        <option>Orders</option>
      </select>
      {/* Display fetched data here based on selection */}
    </div>
  );
};

export default Dashboard;

