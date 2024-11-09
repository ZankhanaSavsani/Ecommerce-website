import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import { useToken } from "../context/TokenContext"; // Import useToken hook
import "../css/OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orders } = location.state || {}; // Retrieve orders passed via state
  const { token } = useToken(); // Get the token from context
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginMessage, setLoginMessage] = useState(""); // State for login message

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch order data using API when the component is mounted
  useEffect(() => {
    if (!token) {
      // If there's no token, show a message prompting login
      setLoginMessage("Your session has expired. Please log in again.");
      setLoading(false);
      return;
    }

    // Make API request only if token is present
    axios
      .get("http://localhost:5000/api/v1/orders", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      })
      .then((response) => {
        setOrderData(response.data.orders); // Assuming your API returns orders
        setLoading(false);
      })
      .catch((err) => {
        // Check if the error is due to invalid or expired token
        if (err.response?.status === 401) {
          setLoginMessage("Your session has expired. Please log in again.");
        } else {
          setError("Failed to fetch order details.");
        }
        setLoading(false);
      });
  }, [token]);

  // If loading, show loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there's a login message, show it
  if (loginMessage) {
    return (
      <div>
        <p>{loginMessage}</p>
        <button onClick={() => navigate("/login")}>Log In</button> {/* Navigate to login page */}
      </div>
    );
  }

  // If no orders found, show a message
  if (!orders || orders.length === 0) {
    return <p>No orders placed yet.</p>;
  }

  // If there is an error, display the error message
  if (error) {
    return <p>{error}</p>;
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
