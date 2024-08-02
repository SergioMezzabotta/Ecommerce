import React, { useEffect, useState, useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from 'react-router-dom';
import { dataContext } from "../Context/DataContext";
import "./Products.css";
import { Link } from "react-router-dom";

const Products = () => {
  const url = process.env.REACT_APP_BACK_URL;

  const { searchTerm } = useParams();

  const { data } = useContext(dataContext);
  const [imageData, setImageData] = useState([]);

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


  //   const buyProducts = (product) => {
  //     setCart([...cart, product]);
  // };

  // function NextArrow(props) {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={className}
  //       style={{ ...style, 
  //         display: "block", 
  //         background: "" }}
  //       onClick={onClick}
  //     />
  //   );
  // }

  // function PrevArrow(props) {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={className}
  //       style={{ ...style, 
  //         display: "block", 
  //         background: "" }}
  //       onClick={onClick}
  //     />
  //   );
  // }

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

  const filteredProducts = data.filter((product) =>
    product.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return <p>No se encontraron resultados</p>;
  }

  ///NECESITO TRAER EL VALOR DEL TOTAL DESCONTADO
  ///NECESITO TRAER EL VALOR DEL TOTAL DESCONTADO
  return filteredProducts.map((product) => {
    const images = getProductImages(product);
    const discountedPrice = product.Price - (product.Price * (product.Discount / 100));
    return (
      <>
        <div className="card" key={product.Id}>
          <Link style={linkStyles} to={`/producto/${product.SKUCode}`}>
            <Slider {...settings}>
              {images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Imagen ${index + 1}`} />
                </div>
              ))}
            </Slider>
            <p className="prod-name">{product.Description}</p>
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
          </Link>
        </div>
      </>
    );
  });
};

export default Products;