import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, user } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    zip: "",
    country: "India",
    phone: "",
  });

  if (!cart || cart.length === 0) {
    return <p>No products in the cart. Go back and add some!</p>;
  }

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const validateForm = () => {
    const { address, city, zip, phone } = shippingInfo;
    if (!address || !city || !zip || !phone) {
      setError("All fields are required!");
      return false;
    }
    if (!/^\d{6}$/.test(zip)) {
      setError("ZIP code must be 6 digits.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/v1/orders", {
        cart,
        shippingInfo,
        totalPrice: getTotalPrice(),
        userId: user?.id,
      });

      if (response.status === 201) {
        navigate("/order-confirmation", { state: { order: response.data } });
      } else {
        setError("Unable to place order. Try again.");
      }
    } catch (err) {
      setError("Server error! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="shipping-form">
        <h3>Shipping Information</h3>
        <input
          type="text"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
          className="full-width"
        />
        <div>
          <input
            type="text"
            placeholder="City"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={shippingInfo.zip}
            onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
          />
        </div>
        <input
          type="text"
          placeholder="Phone"
          value={shippingInfo.phone}
          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="checkout-items">
        {cart.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.image} alt={item.name} />
            <div className="checkout-item-details">
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
