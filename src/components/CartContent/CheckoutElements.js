import { useEffect, useState, useContext } from "react";
import { dataContext } from "../Context/DataContext";
import React from 'react';

export const CheckElements = () => {
  const url = process.env.REACT_APP_BACK_URL;

  const { cart } = useContext(dataContext);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    fetch(url + '/getuploadedinfo')
      .then(res => res.json())
      .then(data => setImageData(data))
      .catch(error => console.error("Error fetching data:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {cart.map((product) => {
        const productImageData = imageData.find(item => item.Codigo_Art === product.SKUCode);
        const img = productImageData ? `http://localhost:3000/prod_img/${productImageData.Nombre_Arch}` : ''
        const discountedPrice = product.Price - (product.Price * (product.Discount / 100));

        return (
          <div className="checkoutContent" key={product.Id}>
            <div className="checkout-img-container">
              <img className="checkout-img" src={img} alt="" />
            </div>

            <div className="checkout-datos-productos">
              <p className="checkout-datos-p">{product.Description}</p>
              <p className="checkout-datos-price">${discountedPrice}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CheckElements;