import React, { useState, useEffect } from 'react';
import './Category.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Category() {
    const url = process.env.REACT_APP_BACK_URL;

    const [carpetasSeleccionadas, setCarpetasSeleccionadas] = useState([]);
    const obtenerCarpetasSeleccionadas = url + "/obtener-carpetas-seleccionadas";

    useEffect(() => {
        const obtenerCarpetasDesdeBD = async () => {
            try {
                const response = await axios.get(obtenerCarpetasSeleccionadas);
                setCarpetasSeleccionadas(response.data);
            } catch (error) {
                console.error('Error al obtener carpetas en la base de datos:', error);
            }
        };
        obtenerCarpetasDesdeBD();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const settings4 = {
        infinite: false,
        slidesToShow: 10,
        slidesToScroll: 5,
        arrows: true,
        draggable: true,
        dots: false,
    };

    return (
        <>
            <Slider {...settings4} className='custom-slick-slider'>
                {carpetasSeleccionadas.map((carpeta) => (
                    <>
                        <div className='categorias' key={carpeta.IdFolder}>
                            <Link to={`/categorias/${carpeta.IdFolder}`}>
                                <img
                                    src={`/category/${carpeta.IdFolder}.png`}
                                    alt="Sin Imagen"
                                />
                                <p>
                                    {carpeta.Name.charAt(0).toUpperCase() + carpeta.Name.slice(1).toLowerCase()}
                                </p>
                            </Link>
                        </div>
                    </>
                ))}
            </Slider>
        </>
    );
}

export default Category;