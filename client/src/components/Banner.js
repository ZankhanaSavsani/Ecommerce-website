import { Link } from 'react-router-dom';
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
                          <Link to='/about'>About Us</Link>
                          </div>
                          <div className="callnow_bt">
                          <Link to='/contact'>Call Now</Link>
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