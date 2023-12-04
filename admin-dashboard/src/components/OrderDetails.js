import React, { useState, useEffect } from 'react';

function OrderDetails({ orderDetails }) {
    if (!orderDetails) return <div>No order details available.</div>;

    return (
        <div>
            <h3>Order Details</h3>
            <table>
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
