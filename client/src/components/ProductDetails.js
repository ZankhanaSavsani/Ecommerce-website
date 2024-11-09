import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import "../css/ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/products/${productId}`
        );
        const data = response.data;
        setProduct(data);
        setMainImage(data.images?.[0] || data.image);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const handleAddToCart = () => {
    // Assuming you store cart data in localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Show the popup for a short time
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide after 3 seconds
  };

  const handleBuyNow = () => {
    navigate("/checkout", { state: { cart: [{ ...product, quantity: 1 }] } });
  };

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>

      {showPopup && (
        <div className="popup-message">
          Product added to cart!
        </div>
      )}

      <div className="product-content">
        <div className="image-section">
          <img src={mainImage} alt={product.name} className="main-image" />
          <div className="thumbnail-gallery">
            {[...Array(3)].map((_, index) => (
              <img
                key={index}
                src={mainImage}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail"
                onClick={() => setMainImage(mainImage)}
              />
            ))}
          </div>
        </div>

        <div className="details-section">
          <span className="limited-deal">Limited Time Deal - 34% OFF</span>
          <h2>{product.name}</h2>
          <p className="brand">Brand: {product.brand}</p>
          <p className="price">Price: ₹{product.price}</p>
          <p
            className={`stock ${
              product.countInStock > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <div className="rating">
            Rating:
            <ReactStars
              count={5}
              value={product.rating}
              size={24}
              isHalf={true}
              edit={false}
              activeColor="#ffd700"
            />
          </div>
          <p className="description">{product.description}</p>
          <div className="button-container">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
