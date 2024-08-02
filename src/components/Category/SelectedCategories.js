import React, { useState, useEffect, useContext } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { dataContext } from "../Context/DataContext";
import axios from 'axios';
import { Link } from "react-router-dom";

const SelectedCategories = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const url = process.env.REACT_APP_BACK_URL;
  const { data } = useContext(dataContext);
  const [detallesCategorias, setDetallesCategorias] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [nombreCategorias, setNombreCategorias] = useState([]);

  //obtener lista de carpetas
  useEffect(() => {
    const fetchCarpetasData = async () => {
      try {
        //obtener categorias recomendadas
        const responseCategorias = await axios.get(url + '/obtener-carpetasrecomendadas');

        //define el nombre de las categorias
        setNombreCategorias(responseCategorias.data)

        const categorias = responseCategorias.data.map(categoria => categoria.IdFolder);
        //obtener detalles de cada categoria
        const promesasDetalles = categorias.map(idCategoria =>
          axios.get(`${serverUrl}/ProductsFolder?filter=${idCategoria}`)
        );
        const detalles = await Promise.all(promesasDetalles);
        setDetallesCategorias(detalles.map(res => res.data.Data));

        // obtener informacion de imagenes
        const responseImagenes = await fetch(url + '/getuploadedinfo');
        const dataImagenes = await responseImagenes.json();
        setImageData(dataImagenes);
      } catch (error) {
        console.error('Error al obtener la información:', error);
      }
    };

    fetchCarpetasData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductImages = (product) => {
    const productImageData = imageData.filter(item => item.Codigo_Art === product.SKUCode);
    return productImageData.map(item => `http://localhost:3000/prod_img/${item.Nombre_Arch}`);
  };

  const settings6 = {
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
      {detallesCategorias.map((categoria, indexCategoria) => (
        <div key={indexCategoria}>
          <div className='titulo-categorias'>
            <h3>{nombreCategorias[indexCategoria].Name}</h3>
          </div>

          <div className='category-card-container'>
            {data
              .filter((product) =>
                categoria && categoria.some((detalle) => detalle.SkuCode === product.SKUCode)
              )
              .map((product) => {
                const images = getProductImages(product);
                const discountedPrice = product.Price - (product.Price * (product.Discount / 100));

                return (
                  <>
                    <div key={product.Id} className="product_category_card">
                      <Link style={linkStyles} to={`/producto/${product.SKUCode}`}>
                        <Slider {...settings6}>
                          {images.map((image, index) => (
                            <div key={index}>
                              <img src={image} alt={`Imagen ${index + 1}`} />
                            </div>
                          ))}
                        </Slider>
                        <p>{product.Description}</p>
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
              })}
          </div>
        </div>
      ))}
    </>
  );
};

export default SelectedCategories;