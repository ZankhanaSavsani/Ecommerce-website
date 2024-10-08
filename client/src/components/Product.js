import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Product() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from your API
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:5000/api/v1/categories'); // Update with your API URL
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleReadMore = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="coffee_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="coffee_taital">Top Categories to Explore</h1>
          </div>
        </div>
      </div>
      <div className="coffee_section_2">
        <div id="main_slider" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="container-fluid">
                <div className="row">
                  {categories.map((category) => (
                    <div key={category._id} className="col-lg-3 col-md-6">
                      <div className="coffee_img">
                        <img src={category.icon} alt={category.name} /> {/* Display the category icon */}
                      </div>
                      <div className="coffee_box">
                        <h3 className="types_text">{category.name}</h3>
                        <div className="read_bt">
                          <button onClick={() => handleReadMore(category._id)}>View Products</button> {/* Use _id for consistency */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
