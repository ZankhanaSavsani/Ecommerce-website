import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";  // Import Link

function CategoryProducts2() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/products/category/${categoryId}`
        );
        if (!response.ok) throw new Error('Failed to fetch products');
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="category-products">
      <h2>Products in this Category</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <Link to={`/product/${product.id}`}>
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} />
              <p>Price: ${product.price.toFixed(2)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts2;
