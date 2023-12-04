import React from 'react';

function OrderDetails({ orderDetails }) {
    if (!orderDetails) return <div className="container">No order details available.</div>;

    return (
        <div className="container">
            <h3 style={{ color: '#F3DE8A' }}>Order Details</h3> {/* Color as per CSS */}
            <table className="ProductsTable" aria-label="order details table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product ID</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.map((detail, index) => (
                        <tr key={index}>
                            <td>{detail.orderID}</td>
                            <td>{detail.productID}</td>
                            <td>{detail.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderDetails;

