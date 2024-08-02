import React, { useState, useRef } from 'react';
import "./SignForm.css"
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import Footer from '../Footer/Footer';
import Modal from 'react-modal';

import { useContext } from "react";
import { dataContext } from "../Context/DataContext";

import { useAuth } from '../../AuthContext';

import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const url = process.env.REACT_APP_BACK_URL;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Message, setMessage] = useState('');
  const [ModalMessage, setModalMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  // const [isEmailVerify, setEmailVerify] = useState(false);
  // const [correoEnviado, setCorreoEnviado] = useState(false);
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

  const generarCodigo = () => {
    const longitudCodigo = 6;
    const caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let codigoGenerado = '';
    for (let i = 0; i < longitudCodigo; i++) {
      const indiceCaracter = Math.floor(Math.random() * caracteresPermitidos.length);
      codigoGenerado += caracteresPermitidos.charAt(indiceCaracter);
    }
    localStorage.setItem('Code', codigoGenerado);

    handleEnviarCorreo();
    setMessage('Enviando correo...');
  };

  const userExist = () => {
    axios.post(url + '/userexist?', {
      username: username,
      email: email,
      password: password,
      isAdmin: 0
    })
      .then((response) => {
        setMessage('');
        generarCodigo();
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        setTimeout(() => {
          setMessage('');
        }, 5000);
      });
  }

  //post a la base de datos
  const submitHandler = () => {
    axios.post(url + '/signup', {
      username: username,
      email: email,
      password: password,
      isAdmin: 0
    })
      .then((response) => {
        setUsername('');
        setPassword('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        setTimeout(() => {
          setMessage('');
        }, 5000);
        setIsRegistered(false);
        // setEmailVerify(false);
      });
  }

  //obtener nombre de la pagina para mandar al correo
  const getNombrePagina = () => {
    return new Promise((resolve, reject) => {
      axios.get(url + '/obtener-nombre-pagina')
        .then(response => {
          const nombrePagina = response.data.nombrePagina;
          document.title = nombrePagina || 'Nombre predeterminado';

          resolve([nombrePagina, nombrePagina.replace(/\s/g, '')]);
        })
        .catch(error => {
          console.error('Error al obtener el nombre de la página:', error);
          document.title = 'Ecommerce';

          reject(error);
        });
    });
  };

  // enviar correo con el codigo
  const handleEnviarCorreo = async () => {
    try {
      const [nombrePagina, nombrePaginaTodoJunto] = await getNombrePagina();
      console.log(nombrePagina, 'y', nombrePaginaTodoJunto)

      const codigoGenerado = localStorage.getItem('Code');

      const respuesta = await axios.post(url + '/enviar-correo', {
        username: username,
        email: email,
        code: codigoGenerado,
        nombrePagina: nombrePagina,
        nombrePaginaTodoJunto: nombrePaginaTodoJunto,
      });

      if (respuesta.status === 200) {
        setMessage('Correo enviado con éxito');
        setTimeout(() => {
          setMessage('');
        }, 5000);
        openCodeForm();
      } else {
        setMessage('Error al enviar el correo')
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [inputValues, setInputValues] = useState(Array(6).fill(''));
  const navigate = useNavigate();

  const handleInput = (index, value) => {
    setInputValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;

      if (value.length > 0 && index < newValues.length - 1) {
        document.getElementById(`input-${index + 1}`).focus();
      }

      return newValues;
    });
  };

  const handlePaste = (index, e) => {
    const pastedData = e.clipboardData.getData('text');

    if (pastedData.length === inputValues.length) {
      setInputValues(pastedData.split(''));
      e.preventDefault();
    }
  };


  const handleKeyPress = (index, e) => {
    if (e.key === 'Enter' && index === inputValues.length - 1) {
      validateCode();
    }
  };

  const validateCode = () => {
    const enteredCode = inputValues.join('');
    const storedCode = localStorage.getItem('Code');

    if (enteredCode === storedCode) {
      setModalMessage("Codigo valido");
      submitHandler();
      setTimeout(() => {
        closeCodeForm();
        // setEmailVerify(true);
        localStorage.clear('Code');
        navigate('/signin');
      }, 2000);
    } else {
      setModalMessage("Codigo incorrecto");
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  const [time, setTime] = useState({ minutes: 5, seconds: 0 });
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime.minutes === 0 && prevTime.seconds === 0) {
          clearInterval(timerRef.current);
          closeCodeForm();
          // setEmailVerify(false);
          localStorage.clear('Code');
          return prevTime;
        } else {
          const newTime = { ...prevTime };

          if (newTime.seconds === 0) {
            newTime.minutes -= 1;
            newTime.seconds = 59;
          } else {
            newTime.seconds -= 1;
          }

          return newTime;
        }
      });
    }, 1000);
  };


  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTime({ minutes: 5, seconds: 0 });
  };

  const [codeFormIsOpen, setCodeFormIsOpen] = useState(false);

  const openCodeForm = () => {
    setCodeFormIsOpen(true);
    resetTimer();
    startTimer();
  };

  const closeCodeForm = () => {
    setCodeFormIsOpen(false);
    stopTimer();
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar />
          <div className='expander'>
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
          </div>
          <Footer />
        </>
      ) : (
        <>
          <Modal
            isOpen={codeFormIsOpen}
            onRequestClose={closeCodeForm}
            contentLabel="Example Modal"
            className="code-form-modal"
            overlayClassName="Overlay"
          >
            <div className="code-form">
              <h2>Introduce el codigo<p onClick={closeCodeForm}></p></h2>
              <div>
                {inputValues.map((value, index) => (
                  <input
                    key={index}
                    id={`input-${index}`}
                    type="text"
                    maxLength="1"
                    className='code-input'
                    value={value}
                    onKeyDown={(e) => handleKeyPress(index, e)}
                    onInput={(e) => handleInput(index, e.target.value)}
                    onPaste={(e) => handlePaste(index, e)}
                  />
                ))}
                <button onClick={validateCode}>Validar</button>
                <div className='message'>
                  {ModalMessage && <p>{ModalMessage}</p>}
                  <p>{`${time.minutes}:${time.seconds < 10 ? `0${time.seconds}` : time.seconds}`}</p>
                </div>
              </div>
            </div>
          </Modal>
          <div className='expander2'>
            <div className='sign'>
              <div className="sign-container">
                <div className="welcome-message">
                  <a className='link-para-volver-perfil' href="/">
                    <svg width='30' height='30' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </a>
                  <h2>Bienvenido</h2>
                  <p>Registro</p>
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
                    type="email"
                    id="email"
                    value={email}
                    className="input-field"
                    placeholder="Correo Electronico"
                    onChange={(e) => setEmail(e.target.value)}
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

                <div className="row">
                  <a href="/pass_reset" target="_blank">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <div className="input-group">
                  <button onClick={() => {
                    userExist();
                  }}>
                    Registrarse
                  </button>
                  <div className='message'>
                    {Message && <p>{Message}</p>}
                    {isRegistered && <p>Registro exitoso</p>}
                  </div>
                </div>

                <a href="/signin" className="row2">
                  ¿Ya tenes una cuenta? Iniciar sesion
                </a>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;