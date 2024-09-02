function Banner(){
    return(
        <div className="banner_section layout_padding">
          <div className="container">
            <div
              id="banner_slider"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="banner_taital_main">
                        <h1 className="banner_taital">
                          GOKUL SEED <br />
                          TECH PVT LTD
                        </h1>
                        <p className="banner_text">
                          Modern Day Agriculture With Morden-Day Agri Implements{" "}
                        </p>
                        <div className="btn_main">
                          <div className="about_bt active">
                            <a href="#">About Us</a>
                          </div>
                          <div className="callnow_bt">
                            <a href="#">Call Now</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Banner;