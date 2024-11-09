import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component"; // Import ReactStars component
import "../css/ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/products/${productId}`
        );
        const data = response.data;
        setProduct(data);
        setMainImage(data.images?.[0] || data.image); // Set main image from product data
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

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>

      <div className="product-content">
        <div className="image-section">
          <img src={mainImage} alt={product.name} className="main-image" />
          <div className="thumbnail-gallery">
            {/* Display the main image three times in the thumbnail gallery */}
            {[...Array(3)].map((_, index) => (
              <img
                key={index}
                src={mainImage}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${
                  mainImage === mainImage ? "selected" : ""
                }`}
                onClick={() => setMainImage(mainImage)} // Clicking any thumbnail keeps the main image
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
              count={5} // Total number of stars
              value={product.rating} // Decimal rating value
              size={24} // Size of stars
              isHalf={true} // Enable half-star support
              edit={false} // Make stars read-only
              activeColor="#ffd700" // Color for filled stars
            />
          </div>
          <p className="description">{product.description}</p>
          <div className="button-container">
            <button className="buy-now-btn">Buy Now</button>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
