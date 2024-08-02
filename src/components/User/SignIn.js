import React, { useState } from 'react';
import "./SignForm.css"
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Footer from '../Footer/Footer';

import { useContext } from "react";
import { dataContext } from "../Context/DataContext";

function SignIn() {
  const url = process.env.REACT_APP_BACK_URL;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { clearCart } = useContext(dataContext);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user_Id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    clearCart();
    window.location.reload();
  }

  const getEmail = async () => {
    try {
      const user_Id = localStorage.getItem('user_Id');
      const userInfo = await axios.get(url + `/user-info/${user_Id}`);
      localStorage.setItem('email', userInfo.data.email)
    } catch (error) {
      console.error("Error", error);
    }
  };

  //base de datos
  const handleLogin = async () => {
    try {
      const response = await axios.post(url + '/signin', {
        username: username,
        password: password,
      });

      if (response.status === 200) {

        const isAdmin = response.data.admin;
        const userId = response.data.user_id;
        const username = response.data.username;
        if (isAdmin) {
          setErrorMessage('Inicio de sesion exitoso como administrador.');
        } else {
          setErrorMessage('Inicio de sesion exitoso.')
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', isAdmin);
        localStorage.setItem('user_Id', userId);
        localStorage.setItem('username', username);
        getEmail();

        setTimeout(() => {
          setIsLoggedIn(true);
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage('Credenciales incorrectas');
      } else {
        setErrorMessage('Error de autenticacion');
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          <div className='settings-container'>
            <h1 className='bad-request-message'>
              Ya estas logeado
            </h1>
            <div className=''>
              ¿Deseas deslogearte?
              <button onClick={handleLogout}>
                Salir
              </button>
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div className='sign'>
            <div className="sign-container">
              <div className="welcome-message">
                <a className='link-para-volver-perfil' href="/">
                  <svg width='30' height='30' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                </a>
                <h2>Hola de nuevo</h2>
                <p>Inicio de sesion</p>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  value={username}
                  className="input-field"
                  placeholder="Usuario"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  className="input-field"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* <div className="input-group row">
                <div className="row">
                  <input
                    type="checkbox"
                    id="remember"
                    hidden
                  />
                  <label htmlFor="remember" className="custom-checkbox"></label>
                  <label htmlFor="remember">
                    Recordarme
                  </label>
                </div>
              </div> */}

              <div className="row">
                <a href="/pass_reset" target="_blank">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="input-group" onClick={() => {
                handleLogin();
              }}>
                <button>
                  Iniciar Sesion
                </button>
                {errorMessage && <p>{errorMessage}</p>}
              </div>

              <a href="/signup" className="row2">
                ¿No tenes una cuenta? Registrarse
              </a>

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignIn;