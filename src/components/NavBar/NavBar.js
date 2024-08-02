import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useContext } from "react";
import { dataContext } from "../Context/DataContext";
import './Navbar.css';
import Logo from '../../media/logo.png';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const url = process.env.REACT_APP_BACK_URL;

  const navigate = useNavigate();
  //comprobacion de estado admin
  const [isAdmin, setIsAdmin] = useState(0);
  useEffect(() => {
    const userId = localStorage.getItem('user_Id');

    const userIsAdmin = () => {
      axios.get(url + `/user-is-admin/${userId}`)
        .then((response) => {
          const isAdminValue = response.data.isAdmin;
          setIsAdmin(isAdminValue);
        })
    };
    userIsAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { cart } = useContext(dataContext);

  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const [carpetasNavbarSeleccionadas, setCarpetasNavbarSeleccionadas] = useState([]);
  const obtenerCarpetasNavbarSeleccionadas = url + "/obtener-carpetasnavbar-seleccionadas";
  useEffect(() => {
    const obtenerCarpetasNavbarDesdeBD = async () => {
      try {
        const response = await axios.get(obtenerCarpetasNavbarSeleccionadas);
        setCarpetasNavbarSeleccionadas(response.data);
      } catch (error) {
        console.error('Error al obtener carpetas en la base de datos:', error);
      }
    };
    obtenerCarpetasNavbarDesdeBD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);

  const openCategoryModal = () => {
    setCategoryModalIsOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalIsOpen(false);
  };

  //busqueda con SearchBar

  const { data } = useContext(dataContext);

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = data.filter((product) =>
    product.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchResults = () => {
    if (searchTerm) {
      navigate(`/results/${searchTerm}`);
    }
  }

  const handleEnter = (event) => {
    if (event.key === 'Enter' && searchTerm) {
      searchResults();
    }
  };

  const [isInputSelected, setIsInputSelected] = useState(false);
  const handleDocumentClick = (event) => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target)) {
      setIsInputSelected(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const linkStyles = {
    textDecoration: 'none',
    color: 'black',
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img className='navbar-logo' src={Logo} alt="Sin Imagen" />
          </Link>
        </div>
        {/* Search bar */}
        <div className="search-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar productos"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onFocus={() => setIsInputSelected(true)}
            />
            <button type="button" onClick={searchResults}>
              <svg height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>
        {isInputSelected && searchTerm && (
          <div className="search-results-container">
            <ul>
              {filteredProducts.length === 0 ? (
                <p>No hay productos con ese nombre</p>
              ) : (
                filteredProducts.map((product) => (
                  <div className='contenedor-icono-search-results' key={product.id}>
                    <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <Link style={linkStyles} to={`/producto/${product.SKUCode}`}>
                      <li>{product.Description}</li>
                    </Link>
                  </div>
                ))
              )}
            </ul>
          </div>
        )}
        {/* Botones del carrito y cuenta del usuario */}
        <ul className="nav-links">
          {isAdmin === 1 ? (
            // AJUSTES DE ADMINISTRADOR
            <>
              {/* admin */}
              <li><a href="/admin">
                <svg height="35px" width="35px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </a></li>
              {/* perfil */}
              <li><a href="/profile">
                <svg height="35px" width="35px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </a></li>
              {/* carrito */}
              <li className="cart-icon"><a href="/cart">
                <svg height="35px" width="35px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {cart.lengh > 0 && <span className='cart-count'>{cart.length}</span>}
              </a></li>
            </>
          ) : (
            <>
              {isLoggedIn ? (
                // AJUSTES DE USUARIO LOGEADO
                <>
                  {/* perfil */}
                  <li><a href="/profile">
                    <svg height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </a></li>
                  {/* carrito */}
                  <li className="cart-icon"><a href="/cart">
                    <svg height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    {cart.lengh > 0 && <span className='cart-count'>{cart.length}</span>}
                  </a></li>
                </>
              ) : (
                // AJUSTES DE USUARIO DESLOGEADO
                <>
                  {/* perfil */}
                  <li><a href="/signin">
                    <svg height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </a></li>
                  {/* carrito */}
                  <li className="cart-icon"><a href="/cart">
                    <svg height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    {cart.lengh > 0 && <span className='cart-count'>{cart.length}</span>}
                  </a></li>
                </>
              )}
            </>
          )}
        </ul>

      </nav>
      {/* barra inferior del navbar */}
      <div className='barra-navbar-inferior'>
        <div className='boton-categoria-del-div'
          onMouseEnter={openCategoryModal}
          onMouseLeave={closeCategoryModal}
        >
          <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <p>Categorias</p>
          {categoryModalIsOpen && (
            <div className='categorias-del-div'>
              <Modal
                isOpen={categoryModalIsOpen}
                onRequestClose={closeCategoryModal}
                contentLabel="Example Modal"
                className="category-modal"
                overlayClassName="Overlay2"
              >
                <div
                  className='lista-categorias'
                  onMouseLeave={closeCategoryModal}
                >
                  {carpetasNavbarSeleccionadas.map((carpeta) => (
                    <li key={carpeta.IdFolder}>
                      <Link to={`/categorias/${carpeta.IdFolder}`}>
                        <div className='link-category'>
                          <p>
                            {carpeta.Name.charAt(0).toUpperCase() + carpeta.Name.slice(1).toLowerCase()}
                          </p>
                          <svg height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </div>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default Navbar;
