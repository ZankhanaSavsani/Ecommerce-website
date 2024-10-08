import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
  const { productId } = useParams();  // Get the productId from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // Fetch the product details based on productId
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-page">
      {/* Product page layout */}
      <div className="product-gallery">
        <div className="product-thumbnails">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              onClick={() => setSelectedImage(image)}
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

    {/* Inline styles */}
    <style>{`
        .product-page {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .product-gallery {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-thumbnails {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .product-thumbnails img {
          width: 100px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.3s;
        }

        .product-thumbnails img.selected {
          border-color: #007bff;
        }

        .product-image img {
          width: 500px;
          height: 500px;
        }

        .product-details {
          flex: 1;
          padding: 0 20px;
        }

        .product-title {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .product-rating {
          margin-bottom: 10px;
          font-size: 16px;
        }

        .product-price {
          font-size: 28px;
          color: #b12704;
          margin-bottom: 10px;
        }

        .product-availability {
          font-size: 16px;
          margin-bottom: 10px;
          color: #007600;
        }

        .product-description {
          margin-bottom: 20px;
          font-size: 16px;
        }

        .product-actions {
          display: flex;
          gap: 10px;
        }

        .buy-now,
        .add-to-cart {
          padding: 10px 20px;
          font-size: 18px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
        }

        .buy-now {
          background-color: #ff9900;
          color: white;
        }

        .add-to-cart {
          background-color: #007bff;
          color: white;
        }

        .buy-now:hover {
          background-color: #e68900;
        }

        .add-to-cart:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .product-page {
            flex-direction: column;
          }

          .product-gallery img {
            width: 300px;
          }

          .product-details {
            padding: 10px;
          }
        }
      `}</style>
  
    </div>
  );
}

export default ProductPage;




// import React, { useState } from "react";

// function ProductPage() {
//   const [selectedImage, setSelectedImage] = useState(
//     "https://via.placeholder.com/500"
//   );

//   const product = {
//     title: "Sample Product Title",
//     price: 99.99,
//     description:
//       "This is a sample product description. It’s detailed and informative. This product is great for your needs.",
//     availability: "In Stock",
//     images: [
//       "https://via.placeholder.com/500",
//       "https://via.placeholder.com/400",
//       "https://via.placeholder.com/300",
//     ],
//     rating: 4.5,
//     reviews: 120,
//   };

//   return (
//     <div className="product-page">
//       <div className="product-gallery">
//         <div className="product-thumbnails">
//           {product.images.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               alt={`Product thumbnail ${index + 1}`}
//               onClick={() => setSelectedImage(image)}
//               className={selectedImage === image ? "selected" : ""}
//             />
//           ))}
//         </div>
//         <div className="product-image">
//           <img src={selectedImage} alt="Selected product" />
//         </div>
//       </div>

//       <div className="product-details">
//         <h1 className="product-title">{product.title}</h1>
//         <div className="product-rating">
//           ⭐ {product.rating} ({product.reviews} reviews)
//         </div>
//         <div className="product-price">${product.price.toFixed(2)}</div>
//         <div className="product-availability">{product.availability}</div>
//         <p className="product-description">{product.description}</p>

//         <div className="product-actions">
//           <button className="buy-now">Buy Now</button>
//           <button className="add-to-cart">Add to Cart</button>
//         </div>
//       </div>

//       {/* Inline styles */}
//       <style>{`
//         .product-page {
//           display: flex;
//           justify-content: space-between;
//           padding: 20px;
//           font-family: Arial, sans-serif;
//         }

//         .product-gallery {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }

//         .product-thumbnails {
//           display: flex;
//           gap: 10px;
//           margin-bottom: 20px;
//         }

//         .product-thumbnails img {
//           width: 100px;
//           cursor: pointer;
//           border: 2px solid transparent;
//           transition: border-color 0.3s;
//         }

//         .product-thumbnails img.selected {
//           border-color: #007bff;
//         }

//         .product-image img {
//           width: 500px;
//           height: auto;
//         }

//         .product-details {
//           flex: 1;
//           padding: 0 20px;
//         }

//         .product-title {
//           font-size: 24px;
//           margin-bottom: 10px;
//         }

//         .product-rating {
//           margin-bottom: 10px;
//           font-size: 16px;
//         }

//         .product-price {
//           font-size: 28px;
//           color: #b12704;
//           margin-bottom: 10px;
//         }

//         .product-availability {
//           font-size: 16px;
//           margin-bottom: 10px;
//           color: #007600;
//         }

//         .product-description {
//           margin-bottom: 20px;
//           font-size: 16px;
//         }

//         .product-actions {
//           display: flex;
//           gap: 10px;
//         }

//         .buy-now,
//         .add-to-cart {
//           padding: 10px 20px;
//           font-size: 18px;
//           cursor: pointer;
//           border: none;
//           border-radius: 5px;
//         }

//         .buy-now {
//           background-color: #ff9900;
//           color: white;
//         }

//         .add-to-cart {
//           background-color: #007bff;
//           color: white;
//         }

//         .buy-now:hover {
//           background-color: #e68900;
//         }

//         .add-to-cart:hover {
//           background-color: #0056b3;
//         }

//         @media (max-width: 768px) {
//           .product-page {
//             flex-direction: column;
//           }

//           .product-gallery img {
//             width: 300px;
//           }

//           .product-details {
//             padding: 10px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default ProductPage;
