import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../css/category.css"

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:5000/api/v1/categories'); // Update with your API URL
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="section_title">Top Categories to Explore</h1>
          </div>
        </div>
      </div>
      <div className="section_2">
        <div id="main_slider" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="container-fluid">
                <div className="row">
                  {categories.map((category) => (
                    <div key={category._id} className="col-lg-3 col-md-6">
                      <Link to={`/category/${category._id}`} className="category-link">
                        <div className="img_container">
                          <img src={category.icon} alt={category.name} />
                        </div>
                        <div className="box">
                          <h3 className="types_text">{category.name}</h3>
                        </div>
                      </Link>
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

export default Category;
