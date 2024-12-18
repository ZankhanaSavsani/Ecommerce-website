import React, { useState } from "react";
import "../css/about.css";

function About() {
  const [showMore, setShowMore] = useState(false);

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="about_section layout_padding">
      <div className="container">
        <div className="about_section_2">
          <div className="row">
            <div className="col-md-6">
              <div className="about_taital_box">
                <h1 className="about_taital">About Our Company</h1>
                <h1 className="about_taital_1">Welcome to Gokul Seed Tech</h1>
                <p className="about_text">
                  Discover the latest in farming technology and insights at GreenFields. We offer innovative tools to boost yield and efficiency, along with expert advice on crop management, soil health, and sustainable practices. Join us in growing a greener future!
                </p>
                {showMore && (
                  <p className="about_text">
                    At Gokul Seed Tech, we prioritize sustainability and aim to provide farmers with advanced solutions to optimize agricultural productivity. Our team works tirelessly to develop new technologies that cater to the evolving needs of the agricultural industry, helping our partners to cultivate healthy, high-yielding crops that contribute to a thriving food system for communities around the world.
                  </p>
                )}
                <div className="readmore_btn">
                  <button onClick={handleReadMore}>
                    {showMore ? "Show Less" : "Read More"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="image_iman">
                <img src="images/about-img.jpg" className="about_img" alt="About Us" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
