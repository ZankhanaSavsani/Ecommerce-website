import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function ShoppingCart({ cart, setCart }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null); // State for order status
  const [products, setProducts] = useState([]); // State for products
  const navigate = useNavigate();

    // Fetch cart items from API when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/products'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        setCart(data); // Set fetched cart data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [setCart]);

   // Calculate total price whenever cart is updated
  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const calculateTotal = () => {
    if (!Array.isArray(cart)) return; // Check if cart is an array
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
    );
    setCart(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const handleCheckout = async () => {
    const orderItems = cart.map(item => ({
      product: item.id,
      quantity: item.quantity,
    }));


    const orderData = {
        orderItems,
        shippingAddress1: "123 Main St", // Replace with your input fields
        shippingAddress2: "",
        city: "Your City",
        zip: "12345",
        country: "Your Country",
        phone: "123-456-7890",
        status: "Pending",
        totalPrice,
        user: "userId", // Replace with actual user ID if available
      };

      try {
        const response = await fetch('http://localhost:5000/api/v1/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create order');
        }
  
        const result = await response.json();
        setOrderStatus(`Order created successfully: ${result._id}`);
        setCart([]); // Clear cart after successful order
        navigate('/'); // Redirect or show success message
      } catch (error) {
        setOrderStatus(`Error: ${error.message}`);
      }
    };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }


  if (cart.length === 0) {
    return (
      <div className="shopping-cart">
        <h2>Your Cart is Empty</h2>
        <Link to="/products">
          <button className="continue-shopping-btn">Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
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
              <button
                className="remove-item-btn"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total Price: ₹{totalPrice}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
      {orderStatus && <p>{orderStatus}</p>} {/* Show order status */}
      <style>{`
        .shopping-cart {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        }

        .cart-item img {
          max-width: 120px;
          border-radius: 5px;
        }

        .cart-item-details {
          flex: 1;
          padding-left: 20px;
        }

        .cart-item-quantity {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }

        .cart-item-quantity input {
          margin-left: 10px;
          width: 60px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .remove-item-btn {
          padding: 5px 10px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .remove-item-btn:hover {
          background-color: #c82333;
        }

        .cart-summary {
          text-align: center;
          margin-top: 30px;
        }

        .cart-summary h3 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
        }

        .checkout-btn {
          padding: 10px 20px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .checkout-btn:hover {
          background-color: #218838;
        }

        .continue-shopping-btn {
          display: block;
          margin: 0 auto;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .continue-shopping-btn:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default ShoppingCart;
