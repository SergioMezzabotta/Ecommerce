import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { dataContext } from "../Context/DataContext";
import Navbar from "../Navbar/Navbar";
import './Products.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Tarjetas from '../../media/tarjetas';
import Footer from "../Footer/Footer";
import Whatsapp from "../Whatsapp Widget/Whatsapp";

const ProductDetail = () => {
    const url = process.env.REACT_APP_BACK_URL;

    const { data, setCart, cart, stockData } = useContext(dataContext);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [imageData, setImageData] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(-1);
    const [initialSlide, setInitialSlide] = useState(0);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setInitialSlide(0);
    }, []);

    useEffect(() => {
        fetch(url + '/getuploadedinfo')
            .then(res => res.json())
            .then(data => setImageData(data))
            .catch(error => console.error("Error fetching data:", error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getProductImages = (product) => {
        const productImageData = imageData.filter(item => item.Codigo_Art === product.SKUCode);
        return productImageData.map(item => `http://localhost:3000/prod_img/${item.Nombre_Arch}`);
    };

    const buyProducts = (product) => {
        setCart([...cart, product]);
    };

    useEffect(() => {
        const selectedProduct = data.find((item) => item.SKUCode === id);
        setProduct(selectedProduct);
    }, [data, id]);

    if (!product) {
        return <p>Cargando detalles del producto...</p>;
    }

    const discountedPrice = product.Price - (product.Price * (product.Discount / 100));

    const handleMouseLeave = () => {
        setCurrentImageIndex(-1);
        setZoomPosition({ x: 0, y: 0 });
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        setZoomPosition({ x, y });
    };

    const handleMouseEnter = (index) => {
        setCurrentImageIndex(index);
    };

    const settings3 = {
        // customPaging: function (i) {
        //     return (
        //         <div className="thumbnails-container">
        //             <img src={images[i]} alt={`Imagen ${i + 1}`} />
        //         </div>
        //     );
        // },
        dots: true,
        // dotsClass: "slick-dots3 slick-thumb3",
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const images = getProductImages(product);

    return (
        <>
            <Navbar />
            <div className="ind-prod-container">
                <div className="ind-prod-img-holder">
                    <div className="on-zoomed-img" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} >
                        <Slider {...settings3} initialSlide={initialSlide} className='my-custom-slider'>
                            {images.map((image, index) => (
                                <div key={index} className="slider-image-container" onMouseLeave={handleMouseLeave} onMouseEnter={() => handleMouseEnter(index)}>
                                    <div className="zoom-container">
                                        {index === currentImageIndex && (
                                            <div
                                                className="zoomed-image"
                                                style={{
                                                    backgroundImage: `url(${image})`,
                                                    transform: `translate(-${zoomPosition.x * 50}%, -${zoomPosition.y * 50}%)`,
                                                }}
                                            />
                                        )}
                                        <img
                                            src={image}
                                            alt={`Imagen ${index + 1}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className="ind-prod-details">
                    <div className="ind-details-content">
                        <p>{product.Description}</p>
                        <p>Cantidad: {stockData[product.SKUCode] ? (stockData[product.SKUCode].Quantity > 0 ? stockData[product.SKUCode].Quantity : "Sin Stock") : "Sin Stock"}</p>
                        {product.Discount > 0 && (
                            <>
                                <div className="price-container">
                                    <h3 className="btn-price-old">${product.Price}</h3>
                                    <h3 className="discount-price">{product.Discount}% OFF</h3>
                                </div>
                                <h1 className="btn-price">${discountedPrice}</h1>
                            </>
                        )}
                        {product.Discount === 0 && (
                            <h1 className="btn-price">${product.Price}</h1>
                        )}

                        <div className="retiro-container">
                            <svg height="30px" width="30px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <p>Envio a acordar con el vendedor</p>
                        </div>

                        <div className="retiro-container">
                            <svg height="30px" width="30px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                            </svg>
                            <p>Retiro GRATIS en sucursal</p>
                            <span>¡Retiralo YA!</span>
                        </div>

                        <p>Aceptamos todas las tarjetas</p>
                        <div className="tarjetas-container">
                            {Tarjetas.map((imagen, index) => (
                                <img key={index} src={imagen} alt={`Imagen ${index + 1}`} />
                            ))}
                        </div>

                        <button
                            onClick={() => stockData[product.SKUCode] && stockData[product.SKUCode].Quantity > 0 && buyProducts(product)}
                            disabled={!stockData[product.SKUCode] || stockData[product.SKUCode].Quantity === 0}
                            className={stockData[product.SKUCode] && stockData[product.SKUCode].Quantity > 0 ? 'agregar-al-carrito-enabled' : 'agregar-al-carrito-disabled'}
                        >
                            Agregar al carro
                        </button>
                    </div>
                </div>
            </div>
            <div className="descripcion-info">
                <h3>Caracteristicas:</h3>
                <p>{product.AdditionalDescription}</p>
                <h3>Descripcion:</h3>
                <p>{product.Observations}</p>
            </div>
            <Whatsapp />
            <Footer />
        </>
    );
};

export default ProductDetail;
