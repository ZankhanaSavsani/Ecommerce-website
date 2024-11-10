import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, user } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState("");

  // State for user input
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("India");
  const [phone, setPhone] = useState("");

  if (!cart || cart.length === 0) {
    return <p>No products in cart.</p>;
  }

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Validation function
  const validateShippingInfo = () => {
    if (!shippingAddress1 || !city || !zip || !country || !phone) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!/^\d{6}$/.test(zip)) {
      setError("Please enter a valid 6-digit ZIP code.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid phone number with 10 digits.");
      return false;
    }
    setError(""); // Clear error if everything is valid
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingInfo()) return; // Stop if validation fails

    setLoading(true);
    try {
      const order = {
        orderItems: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        totalPrice: getTotalPrice(),
        user: user?._id,
      };

      const response = await axios.post("http://localhost:5000/api/v1/orders", order);

      if (response.status === 201) {
        setOrderData(response.data);
        setOrderPlaced(true);
        navigate("/order-confirmation", { state: { order: response.data } });
      } else {
        setError("Failed to place the order. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while placing the order.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      {/* Shipping Information Form */}
      <div className="shipping-form">
        <h3>Shipping Information</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="Address"
            value={shippingAddress1}
            onChange={(e) => setShippingAddress1(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Show error message */}
      </div>

      <div className="checkout-items">
        <h3>Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.image} alt={item.name} className="checkout-image" />
            <div className="checkout-details">
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-summary">
        <h3>Total: ₹{getTotalPrice()}</h3>
        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
