import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/products/category/${categoryId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
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

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="category-products">
        <h2 className="category-title">Products in this Category</h2>
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {isSidebarVisible ? "−" : "+"}
        </button>
        {isSidebarVisible && (
          <div className="sidebar">
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
          className={`product-grid ${
            filteredProducts.length === 1 ? "single-product" : ""
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="product-item" key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <img src={product.image} alt={product.name} />
              </div>
            ))
          ) : (
            <p>No products found in this price range.</p>
          )}
        </div>
      </div>

      {/* Inline CSS for the component */}
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
  border-bottom: 1px solid #ddd; /* Line color */
  margin: 0 20px;
}

.toggle-sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  z-index: 1000;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: white;
  border-right: 1px solid #ddd;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar h3 {
  margin-bottom: 15px;
}

.sidebar button {
  display: block;
  margin: 5px 0;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.sidebar button:hover {
  background-color: #0056b3;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%; /* Ensure grid fills available space */
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
  transition: transform 0.2s;
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
        
      `}</style>
    </div>
  );
}

export default CategoryProducts;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function CategoryProducts() {
//   const { categoryId } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [priceRange, setPriceRange] = useState([0, Infinity]);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/v1/products/category/${categoryId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch products');
//         }
//         const data = await response.json();
//         setProducts(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [categoryId]);

//   const handlePriceChange = (min, max) => {
//     setPriceRange([min, max]);
//   };

//   const filteredProducts = products.filter(product =>
//     product.price >= priceRange[0] && product.price <= priceRange[1]
//   );

//   const toggleSidebar = () => {
//     setIsSidebarVisible(!isSidebarVisible);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="category-products">
//       <h2 className="category-title">Products in this Category</h2>
//       <button className="toggle-sidebar" onClick={toggleSidebar}>
//         {isSidebarVisible ? '−' : '+'}
//       </button>
//       {isSidebarVisible && (
//         <div className="sidebar">
//           <h3>Price Range</h3>
//           <button onClick={() => handlePriceChange(0, 50)}>Under $50</button>
//           <button onClick={() => handlePriceChange(50, 100)}>From $50 to $100</button>
//           <button onClick={() => handlePriceChange(100, 200)}>From $100 to $200</button>
//           <button onClick={() => handlePriceChange(200, 500)}>From $200 to $500</button>
//           <button onClick={() => handlePriceChange(0, Infinity)}>All Prices</button>
//         </div>
//       )}
//       {filteredProducts.length > 0 ? (
//         <div className="product-grid">
//           {filteredProducts.map((product) => (
//             <div className="product-item" key={product.id}>
//               <h3>{product.name}</h3>
//               <p>{product.description}</p>
//               <p>Price: ${product.price}</p>
//               <img src={product.image} alt={product.name} />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No products found in this price range.</p>
//       )}

//       {/* Inline CSS for the component */}
//       <style>{`
//         .category-products {
//           display: flex;
//           padding: 20px;
//           font-family: Arial, sans-serif;
//           flex-direction: column; /* Stack items vertically */
//         }

//         .category-title {
//           text-align: center; /* Center the heading */
//           width: 100%; /* Ensure it takes the full width */
//           margin-bottom: 20px; /* Space below the heading */
//         }

//         .toggle-sidebar {
//           position: fixed;
//           top: 20px;
//           left: 20px;
//           padding: 5px 10px;
//           border: none;
//           background-color: #007bff;
//           color: white;
//           cursor: pointer;
//           border-radius: 5px;
//           font-size: 16px;
//           z-index: 1000;
//         }

//         .sidebar {
//           flex: 1;
//           padding: 10px;
//           border-right: 1px solid #ddd;
//         }

//         .sidebar h3 {
//           margin-bottom: 15px;
//         }

//         .sidebar button {
//           display: block;
//           margin: 5px 0;
//           padding: 10px;
//           border: none;
//           background-color: #007bff;
//           color: white;
//           cursor: pointer;
//           border-radius: 5px;
//         }

//         .sidebar button:hover {
//           background-color: #0056b3;
//         }

//         .product-grid {
//           display: flex; /* Use flexbox for the product grid */
//           flex-wrap: wrap; /* Allow items to wrap to the next line */
//           gap: 20px; /* Space between items */
//           justify-content: flex-start; /* Align items to the start */
//           padding-left: 20px;
//         }

//         .product-item {
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           padding: 15px;
//           text-align: center;
//           transition: transform 0.2s;
//           flex: 1 1 calc(33% - 20px); /* Responsive item sizing */
//           max-width: calc(33% - 20px); /* Set a max width for each item */
//         }

//         .product-item:hover {
//           transform: scale(1.05);
//         }

//         .product-item img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 4px;
//         }

//         @media (max-width: 768px) {
//           .product-item {
//             flex: 1 1 calc(50% - 20px); /* 2 items per row on medium screens */
//             max-width: calc(50% - 20px);
//           }
//         }

//         @media (max-width: 480px) {
//           .product-item {
//             flex: 1 1 100%; /* 1 item per row on small screens */
//             max-width: 100%;
//           }

//           .category-title {
//             font-size: 18px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default CategoryProducts;
