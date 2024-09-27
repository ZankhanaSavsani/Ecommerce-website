import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");  // State for the selected image

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);  // Set the first image as the default
    }
  }, [product]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-page">
      <div className="product-gallery">
        <div className="product-thumbnails">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              onClick={() => setSelectedImage(image)}  // Update selected image on click
              className={selectedImage === image ? "selected" : ""}
            />
          ))}
        </div>
        <div className="product-image">
          <img src={selectedImage} alt="Selected product" />
        </div>
      </div>

      <div className="product-details">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-rating">
          ⭐ {product.rating} ({product.reviews} reviews)
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className="product-availability">{product.stock ? "In Stock" : "Out of Stock"}</div>
        <p className="product-description">{product.description}</p>

        <div className="product-actions">
          <button className="buy-now">Buy Now</button>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
