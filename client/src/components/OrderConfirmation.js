import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orders } = location.state || {}; // Retrieve orders passed via state
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch order data when the component is mounted
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/orders")
      .then((response) => {
        setOrderData(response.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch order details.");
        setLoading(false);
      });
  }, []);

  // If loading, show loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there is an error, display the error message
  if (error) {
    return <p>{error}</p>;
  }

  // If no orders found, show a message
  if (!orders || orders.length === 0) {
    return <p>No orders placed yet.</p>;
  }

  return (
    <div className="order-confirmation">
      <h2>Order Confirmation</h2>
      {orders.map((order, index) => (
        <div key={index} className="order-box">
          <h3>Order #{index + 1}</h3>
          <p>Order placed at: {new Date(order.timestamp).toLocaleString()}</p>
          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} className="order-image" />
                <div className="order-details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderConfirmation;
