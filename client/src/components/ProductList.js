import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) return; // Don't fetch if no category is selected
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/products?category=${categoryId}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <div>
            <h2>Products</h2>
            {products.length > 0 ? (
                <ul>
                    {products.map(product => (
                        <li key={product.id}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <img src={product.image} alt={product.name} style={{ width: '100px' }} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
};

export default ProductList;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ProductList = () => {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch categories
//     const fetchCategories = async () => {
//       try {
//         const categoryResponse = await axios.get('/api/v1/categories'); // Adjust API endpoint as needed
//         setCategories(categoryResponse.data);

//         // Fetch products for each category
//         const productsByCategory = {};
//         for (const category of categoryResponse.data) {
//           const productResponse = await axios.get(`/api/v1/products/${category._id}`); // Adjust as per your API
//           productsByCategory[category.name] = productResponse.data;
//         }
//         setProducts(productsByCategory);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   if (loading) {
//     return <p>Loading products...</p>;
//   }

//   return (
//     <div className="product-list">
//       {categories.map((category) => (
//         <div key={category._id} className="category-section">
//           <h2>{category.name}</h2>
//           <div className="products">
//             {products[category.name]?.length ? (
//               products[category.name].map((product) => (
//                 <div key={product._id} className="product-card">
//                   <img src={product.imageUrl} alt={product.name} />
//                   <h3>{product.name}</h3>
//                   <p>{product.description}</p>
//                   <p>Price: ${product.price}</p>
//                 </div>
//               ))
//             ) : (
//               <p>No products available in this category.</p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProductList;
