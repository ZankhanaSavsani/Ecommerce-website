import Banner from "./Banner";
import About from "./About";
import Category from "./Category";
import Contact from "./Contact";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/banner.css"

function Home() {
    return (
        <div className="App">
                <Banner />
            <About />
            <Category />
            <Contact />
        </div>
    )
}

export default Home;