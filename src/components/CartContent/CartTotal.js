import React from 'react'
import { useNavigate } from 'react-router-dom';
import Whatsapp from "../Whatsapp Widget/Whatsapp.js";

const CartTotal = ({ subtotal }) => {

    const navigate = useNavigate();

    const goCheckout = () => {
        navigate('/checkout');
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    return (
        <>
            {isLoggedIn ? (
                <div className='cartTotal-container'>
                    <h3 className='valores-h3'>Subtotal: ${subtotal}</h3>
                    <h3 className='valores-h3'>Total: ${subtotal} se aplican impuestos.</h3>
                    <button className='btn-pay' onClick={() => {
                        goCheckout();
                    }}>
                        Pagar
                    </button>
                </div>
            ) : (
                <div className='cartTotal-container'>
                    <h3>Total: ${subtotal}</h3>
                    <button className='btn-pay' onClick={() => {
                        goCheckout();
                    }}>
                        Pagar sin registrarse
                    </button>
                </div>
            )}
            <Whatsapp />
        </>
    );
};

export default CartTotal;