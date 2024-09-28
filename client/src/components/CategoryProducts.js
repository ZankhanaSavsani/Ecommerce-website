import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Fuse from "fuse.js";

function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
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
          {isSidebarVisible ? "−" : "+"}
        </button>
        {isSidebarVisible && (
          <div
            ref={sidebarRef}
            className={`sidebar ${isSidebarVisible ? "visible" : ""}`}
          >
            <h3>Price Range</h3>
            <button onClick={() => handlePriceChange(0, 50)}>Under $50</button>
            <button onClick={() => handlePriceChange(50, 100)}>
              From $50 to $100
            </button>
            <button onClick={() => handlePriceChange(100, 200)}>
              From $100 to $200
            </button>
            <button onClick={() => handlePriceChange(200, 500)}>
              From $200 to $500
            </button>
            <button onClick={() => handlePriceChange(0, Infinity)}>
              All Prices
            </button>
          </div>
        )}
        <div
          className={`product-grid ${filteredProducts.length === 1 ? "single-product" : ""
            }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                className="product-item"
                key={product.id}
              >
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <button className="add-to-cart-btn">Add to Cart</button>
                <div className="product-rating">
                  {renderStars(product.rating)}
                </div>
              </Link>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      <style>{`
        .category-products {
  display: flex;
  padding: 20px;
  font-family: Arial, sans-serif;
  position: relative;
  flex-direction: column; /* Align everything in column */
  align-items: center; /* Center horizontally */
  width: 100%;
}

.category-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.category-title::before,
.category-title::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
  margin: 0 20px;
}

.toggle-sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.toggle-sidebar:hover {
  background-color: #0056b3;
}

.sidebar {
   position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100%;
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: transform 0.3s ease-in-out;
}

.sidebar.visible {
  transform: translateX(300px);
}

.sidebar h3 {
  margin: 20px 0; /* Added top and bottom margin for spacing */
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.sidebar button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar button:hover {
  background-color: #0056b3;
}

.search-bar {
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.product-item {
  text-decoration: none; /* Remove underline from the link */
  color: inherit; /* Maintain the text color */
}

.product-item:hover {
  color: blue; /* Optional: Change color on hover for better visibility */
}

.product-page {
  display: flex;
  padding: 20px;
}

.product-gallery {
  flex: 1;
  margin-right: 20px;
}

.product-thumbnails {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.product-thumbnails img {
  width: 80px;
  height: auto;
  cursor: pointer;
  margin-bottom: 5px;
}

.product-image img {
  max-width: 100%;
  height: auto;
}

.product-details {
  flex: 2;
}

.product-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-rating {
  margin-bottom: 10px;
}

.product-price {
  font-size: 20px;
  color: green;
  margin-bottom: 10px;
}

.product-availability {
  margin-bottom: 10px;
}

.product-description {
  margin-bottom: 20px;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.buy-now, .add-to-cart {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.buy-now:hover, .add-to-cart:hover {
  background-color: #0056b3;
}


.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%; 
}

/* Special rule when there’s only one product */
.product-grid.single-product .product-item {
  max-width: 600px; /* Larger max-width for single product */
  width: 100%;
  margin: 0 auto;
}

.product-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: transform 0.2s ease;
  width: calc(33% - 20px); /* Consistent width for multiple products */
  max-width: 300px;
  flex: 1 1 calc(33% - 20px); /* Consistent flex sizing */
}

.product-item:hover {
  transform: scale(1.05);
}

.product-item img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.add-to-cart-btn {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #218838;
}

.product-rating {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

 .star {
  color: #ddd; /* Default color for empty stars */
  font-size: 20px;
  margin: 0 2px;
}

.star.filled {
  color: #ffcc00; /* Gold color for filled stars */
}

/* For medium screens */
@media (max-width: 768px) {
  .product-item {
    flex: 1 1 calc(50% - 20px);
    max-width: calc(50% - 20px);
  }
}

/* For smaller screens */
@media (max-width: 480px) {
  .product-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

/* Center single product on smaller screens */
@media (max-width: 768px) {
  .product-grid.single-product .product-item {
    max-width: 100%;
    padding: 10px;
  }
}
        
      `}</style>;

    </div>
  );
}

export default CategoryProducts;

