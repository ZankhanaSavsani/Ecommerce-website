import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/CartPage.css";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch cart from localStorage if available
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);

  useEffect(() => {
    // Store cart to localStorage when it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) return; // Prevent negative or zero quantities

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                  />
                </div>
                <p>Total: ₹{item.price * item.quantity}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <h3>Total Price: ₹{getTotalPrice()}</h3>
        <div className="cart-buttons">
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <button
            className="checkout-btn"
            disabled={cart.length === 0}
            onClick={() => alert("Proceeding to checkout...")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
