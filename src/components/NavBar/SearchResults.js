import React from 'react';
import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import Products from '../Products/Products';
import './Navbar.css';

const ResultadosPage = () => {

  return (
    <>
      <Navbar />
      <h2>Resultados</h2>
      <div className='contenedor-de-productos-filtrados'>
        <Products />
      </div>
      <Footer />
    </>
  );

};


export default ResultadosPage;
