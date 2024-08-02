import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { dataContext } from "../Context/DataContext";
import './Category.css';
import { Link } from "react-router-dom";

const CategoriaDetalle = () => {
    const url = process.env.REACT_APP_BACK_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const { data } = useContext(dataContext);
    const { idCategoria } = useParams();
    const [imageData, setImageData] = useState([]);

    useEffect(() => {
        fetch(url + '/getuploadedinfo')
            .then(res => res.json())
            .then(data => setImageData(data))
            .catch(error => console.error("Error fetching data:", error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const obtenerDetallesCategoria = async (idCategoria) => {
        const categoriesEndpoint = serverUrl + `/ProductsFolder?filter=${idCategoria}`;
        try {
            const response = await fetch(categoriesEndpoint);
            const ddata = await response.json();
            const data = ddata.Data
            console.log(data)
            return data
        } catch (error) {
            console.error('Error al obtener detalles de la categoría:', error);
            return null;
        }
    };

    const [detallesCategoria, setDetallesCategoria] = React.useState(null);

    React.useEffect(() => {
        obtenerDetallesCategoria(idCategoria).then((data) => {
            setDetallesCategoria(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idCategoria]);

    const productosFiltrados = data.filter((product) =>
        detallesCategoria?.some((detalle) => detalle.SkuCode === product.SKUCode)
    );

    const getProductImages = (product) => {
        const productImageData = imageData.filter(item => item.Codigo_Art === product.SKUCode);
        return productImageData.map(item => `http://localhost:3000/prod_img/${item.Nombre_Arch}`);
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: null,
        nextArrow: null,
        arrows: false,
    };

    const linkStyles = {
        textDecoration: 'none',
        color: 'black',
      };

    return (
        <>
            <Navbar />
            <div className='product-card-container'>
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((product) => {
                        const images = getProductImages(product);
                        const discountedPrice = product.Price - (product.Price * (product.Discount / 100));
                        return (
                            <div className="prod_card" key={product.Id}>
                                <Link style={linkStyles} to={`/producto/${product.SKUCode}`}>
                                    <Slider {...settings}>
                                        {images.map((image, index) => (
                                            <div key={index}>
                                                <img src={image} alt={`Imagen ${index + 1}`} />
                                            </div>
                                        ))}
                                    </Slider>
                                    <p>{product.AdditionalDescription}</p>
                                    <p>{product.MeasureUnitCode}</p>
                                    {product.Discount > 0 && (
                                        <>
                                            <div className="price-holder">
                                                <h3 className="precio-btn-old">${product.Price}</h3>
                                                <h3 className="discount-btn">{product.Discount}% OFF</h3>
                                            </div>
                                            <h2 className="precio-btn">${discountedPrice}</h2>
                                        </>
                                    )}
                                    {product.Discount === 0 && (
                                        <h2 className="precio-btn">${product.Price}</h2>
                                    )}

                                    <h3 className="envio-btn">Envio Gratis</h3>
                                    {/* <button className="cart-btn" onClick={() => buyProducts(product)}>
                                    🛒
                                </button> */}
                                </Link>
                            </div>
                        );
                    })

                ) : (
                    <p>Cargando detalles...</p>
                )}
            </div>
            {/* <Footer /> */}
        </>
    );
};


export default CategoriaDetalle;