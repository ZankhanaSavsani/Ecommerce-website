import NavBar from "./Navbar";
import Banner from "./Banner";
import About from "./About";
import Product from "./Product";
import Client from "./Client";
import Blog from "./Blog";
import Contact from "./Contact";
import Footer from "./Footer";
import CopyRight from "./CopyRight";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
    return (
        <div className="App">
            <div className="header_section">
                <NavBar />
                <Banner />
            </div>
            <About />
            <Product />
            {/* <Client /> */}
            {/* <Blog /> */}
            <Contact />
            <Footer />
            <CopyRight />
        </div>
    )
}

export default Home;