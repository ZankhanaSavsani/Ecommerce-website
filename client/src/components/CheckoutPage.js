import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // for sending API requests
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, user } = location.state || {}; // Retrieve cart data and user data from state

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState("");

  if (!cart || cart.length === 0) {
    return <p>No products in cart.</p>;
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      // Prepare order data
      const order = {
        orderItems: cart.map((item) => ({
          product: item.id, // Product ID
          quantity: item.quantity,
        })),
        shippingAddress1: "Address Line 1",
        shippingAddress2: "Address Line 2",
        city: "City",
        zip: "123456",
        country: "India",
        phone: "1234567890",
        status: "Pending", // or another status as per your logic
        totalPrice: getTotalPrice(),
        user: user._id, // Assuming user._id exists
      };

      // Send the order to the backend API
      const response = await axios.post("http://localhost:5000/api/v1/orders/", order);

      if (response.status === 201) {
        setOrderData(response.data);
        setOrderPlaced(true);
        // Optionally navigate to the Order Confirmation page
        navigate("/order-confirmation", { state: { orders: [response.data] } });
      } else {
        setError("Failed to place the order. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while placing the order. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-items">
        {cart.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.image} alt={item.name} className="checkout-image" />
            <div className="checkout-details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-summary">
        <h3>Total: ₹{getTotalPrice()}</h3>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;
