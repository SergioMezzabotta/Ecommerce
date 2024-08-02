import { useContext } from 'react';
import { dataContext } from '../Context/DataContext';
import React from 'react'
import CartElements from './CartElements';
import CartTotal from './CartTotal';
import "./CartContent.css";
import Navbar from "../Navbar/Navbar.js";
import Footer from '../Footer/Footer.js';
import Whatsapp from "../Whatsapp Widget/Whatsapp.js";

const CartContent = () => {
  const { cart } = useContext(dataContext);

  return cart.length > 0 ? (
    <>
      <Navbar />
      <CartElements />
      <CartTotal />
      {/* <Footer /> */}
      <Whatsapp />
    </>
  ) : (
    <>
      <Navbar />
      <div>
        <div className='cart-image-content'>
          <svg width={250} height={250} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h3 className='cart-message-center' >Carro Vacio</h3>
        <p className='cart-message'>Parece que no has añadido nada al carro.</p>
      </div>
      <h2 className='cart-message-interesting'><a href='/'>Volver a la tienda</a></h2>
      <Footer />
      <Whatsapp />
    </>
  )
};

export default CartContent