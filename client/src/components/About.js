function About(){
    return(
        <div className="about_section layout_padding">
        <div className="container">
          <div className="about_section_2">
            <div className="row">
              <div className="col-md-6">
                <div className="about_taital_box">
                  <h1 className="about_taital">About Our Company</h1>
                  <h1 className="about_taital_1">Welcome to Gokul Seed Tech </h1>
                  <p className=" about_text">
                  Discover the latest in farming technology and insights at GreenFields. We offer innovative tools to boost yield and efficiency, along with expert advice on crop management, soil health, and sustainable practices. Join us in growing a greener future!
                  </p>
                  <div className="readmore_btn">
                    <a href="#">Read More</a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="image_iman">
                  <img src="images/about-img.jpg" className="about_img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default About;