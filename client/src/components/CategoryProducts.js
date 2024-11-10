import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import "../css/CategoryProducts.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate(); // Hook to navigate to another page
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/products/category/${categoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarVisible(false);
    }
  };

  useEffect(() => {
    if (isSidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarVisible]);

  const handlePriceChange = (min, max) => setPriceRange([min, max]);
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  // Fuzzy search options
  const fuseOptions = {
    keys: ["name"],
    threshold: 0.3,
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter((product) => {
      if (!searchQuery.trim()) return true;
      const fuse = new Fuse(products, fuseOptions);
      const result = fuse.search(searchQuery);
      return result.some(({ item }) => item.id === product.id);
    });

  const renderStars = (rating) => (
    <ReactStars
      count={5}
      value={rating}
      size={24}
      activeColor="#ffd700"
      edit={false}
      isHalf={true}
    />
  );

  // Handle Add to Cart functionality
  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
    const existingProductIndex = updatedCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex >= 0) {
      updatedCart[existingProductIndex].quantity += quantity; // Add quantity to existing item
    } else {
      updatedCart.push({ ...product, quantity }); // Add new item with selected quantity
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Ensure cart is persisted to localStorage

    // Show pop-up message for 3 seconds
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide after 3 seconds
  };

  // Handle Buy Now functionality
  const handleBuyNow = (product) => {
    handleAddToCart(product); // Add product to cart first
    navigate("/checkout"); // Redirect to checkout page after adding to cart
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value)); // Update quantity in state
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="category-products">
        <h2 className="category-title">Products in this Category</h2>
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {isSidebarVisible ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-bars"></i>
          )}
        </button>

        {isSidebarVisible && (
          <div
            ref={sidebarRef}
            className={`sidebar ${isSidebarVisible ? "visible" : ""}`}
          >
            <h3>Price Range</h3>
            <button onClick={() => handlePriceChange(0, 200)}>Under 200</button>
            <button onClick={() => handlePriceChange(200, 500)}>
              From 200 to 500
            </button>
            <button onClick={() => handlePriceChange(500, 1000)}>
              From 500 to 1000
            </button>
            <button onClick={() => handlePriceChange(1000, 1500)}>
              From 1000 to 1500
            </button>
            <button onClick={() => handlePriceChange(0, Infinity)}>
              All Prices
            </button>
          </div>
        )}
        {showPopup && (
          <div className="popup-message">Product added to cart!</div>
        )}
        <div
          className={`product-grid ${
            filteredProducts.length === 1 ? "single-product" : ""
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-item">
                <Link to={`/product/${product.id}`} className="product-link">
                  <img src={product.image} alt={product.name} />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">Price: ₹{product.price}</p>
                  <div className="product-rating">
                    {renderStars(product.rating)}
                  </div>
                </Link>

                {/* Show quantity input only when the product is selected */}
                {selectedProduct?.id === product.id && (
                  <div>
                    <label htmlFor={`quantity-${product.id}`}>Quantity: </label>
                    <input
                      type="number"
                      id={`quantity-${product.id}`}
                      name="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                )}
                <div className="button-container">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => {
                      setSelectedProduct(product); // Show quantity on "Add to Cart"
                      handleAddToCart(product); // Handle add to cart action
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryProducts;
