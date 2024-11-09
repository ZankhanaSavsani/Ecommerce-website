import NavBar from "./Navbar";
import Banner from "./Banner";
import About from "./About";
import Category from "./Category";
import Contact from "./Contact";
import Footer from "./Footer";
import CopyRight from "./CopyRight";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
    return (
        <div className="App">
            <NavBar />
            <div className="header_section">
                <Banner />
            </div>
            <About />
            <Category />
            <Contact />
            <Footer />
            <CopyRight />
        </div>
    )
}

export default Home;