import "../css/footer.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <div className="footer_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="footer_social_icon">
              <ul>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-facebook" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-twitter" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-instagram" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="location_text">
              <ul>
                <li>
                  <a href="#">
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <span className="padding_left_10">+91 9374824250</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                    <span className="padding_left_10">gokulseedtechpvtltd@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
