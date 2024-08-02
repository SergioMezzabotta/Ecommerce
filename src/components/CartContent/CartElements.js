import { useEffect, useState, useContext } from "react";
import { dataContext } from "../Context/DataContext";
import React from 'react';
import { Link } from "react-router-dom";

export const CartElements = () => {
  const url = process.env.REACT_APP_BACK_URL;

  const { cart, removeFromCart } = useContext(dataContext);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    fetch(url + '/getuploadedinfo')
      .then(res => res.json())
      .then(data => setImageData(data))
      .catch(error => console.error("Error fetching data:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  return (
    <div>
      <table className="tre">
        <thead>
          <tr className='table-header'>
            <th className="producto-header">Producto</th>
            <th className="cantidad-header">Cantidad</th>
            <th className="subtotal-header">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => {
            const productImageData = imageData.find(item => item.Codigo_Art === product.SKUCode);
            const img = productImageData ? `http://localhost:3000/prod_img/${productImageData.Nombre_Arch}` : '';
            const discountedPrice = product.Price - (product.Price * (product.Discount / 100));

            return (
              <tr key={product.Id}>
                <td className="cart-td-producto">
                <Link to={`/producto/${product.SKUCode}`}>
                  <div className="cart-img-container">
                    <img className="cart-prod-img" src={img} alt="Sin Imagen" />
                  </div>
                  </Link>
                  
                  <div className="cart-datos-productos">
                    <p className="cart-datos-p">{product.Description}</p>
                    <p className="cart-datos-price">${discountedPrice}</p>
                    <p className="btn-removefromcart" onClick={() => handleRemoveFromCart(product.Id)}>
                      Remover
                    </p>
                  </div>
                  
                </td>
                <td className="cart-td-cantidad">
                  <div className="cart-cantidad-productos">
                    <input
                      className="cantidad-producto"
                      id="number"
                      type="number"
                      min="1"
                      max="10"
                      value="1"
                    />
                  </div>
                </td>
                <td className="cart-td-subtotal">
                  <div className="cart-subtotal-container">
                    <h3 className="valor-subtotal-p">${discountedPrice}</h3>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CartElements;