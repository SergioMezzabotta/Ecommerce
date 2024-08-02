import React from 'react'
import "./Banner.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

function Banner() {
  const url = process.env.REACT_APP_BACK_URL;

  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    fetch(url + '/rutas-img')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setImagePaths(data.imagePaths);
      })
      .catch(error => console.error('Error fetching image paths:', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function NextArrow2(props) {
    const { className2, style, onClick } = props;
    return (
      <div
        className={className2}
        style={{
          ...style,
          display: "block",
          background: ""
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow2(props) {
    const { className2, style, onClick } = props;
    return (
      <div
        className={className2}
        style={{
          ...style,
          display: "block",
          background: ""
        }}
        onClick={onClick}
      />
    );
  }

  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow2 className2="slick-prev2" />,
    nextArrow: <NextArrow2 className2="slick-next2" />,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className='banner-container'>
      <Slider {...settings2} className='banner-slick-slider'>
        {imagePaths.map((path, index) => (
          <div key={index}>
            <img
              src={`./banner_img/${path}`}
              alt={`Imagen ${index + 1}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Banner;