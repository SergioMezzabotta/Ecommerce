import axios from 'axios';
import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import "./SignForm.css";
import Footer from '../Footer/Footer';

function PassReset() {
  const url = process.env.REACT_APP_BACK_URL;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isReset, setIsReset] = useState(false);

    const passResetHandler = (e) => {
        e.preventDefault();
        axios.post(url + '/reset-password', {
          username: username,
          newPassword: password,
        })
        .then((response) => {
          console.log(response.data);
          setUsername('');
          setPassword('');
          setIsReset(true);
        })
        .catch((error) => {
          setErrorMessage("Nombre de usuario y nueva contraseña son obligatorios");
          setIsReset(false);
          console.error(error);
        });
    };

  return (
    <>
      <Navbar />
        <form onSubmit={passResetHandler} className='sign'>
            <div className="sign-container">
                <div className="welcome-message">
                    <h2>Restablecer Contraseña</h2>
                </div>

                <div className="input-group">
                    <input
                    type="text"
                    id="username"
                    value={username}
                    className="input-field"
                    placeholder="Usuario"
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                    type="password"
                    id="password"
                    value={password}
                    className="input-field"
                    placeholder="Nueva Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <button type="submit">Restablecer Contraseña</button>
                    {errorMessage && <p>{errorMessage}</p>}
                    {isReset && <p>Contraseña restablecida con exito</p>}
                </div>
            </div>
        </form>
        <Footer/>
    </>
  )
}

export default PassReset