import Navbar from "../Navbar/Navbar.js";
import Banner from "../Banner/Banner.js";
import Footer from "../Footer/Footer.js";
import CategorySlider from "../Category/CategorySlider.js";
import SelectedCategories from "../Category/SelectedCategories.js";
import Whatsapp from "../Whatsapp Widget/Whatsapp.js";

const Home = () => {
    return (
        <>
            <Navbar/>
            <Banner/>
            <CategorySlider/>
            <SelectedCategories/>
            <Footer/>
            <Whatsapp />
        </>
    );
};

export default Home;