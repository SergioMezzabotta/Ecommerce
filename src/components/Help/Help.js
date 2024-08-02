import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import "./Help.css"

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <div className='help-background-container'>
                <div className='help-container'>
                    <h2>¿En que podemos ayudarte?</h2>
                    {/* barra de busqueda */}

                    <h3>Compras</h3>
                    <div className='help-btn-container'>
                        <button>Administrar compras</button>
                        <button>Reembolsos</button>
                        <button>Preguntas frecuentes sobre compras</button>

                    </div>

                    <h3>Ventas</h3>
                    <div className='help-btn-container'>
                        <button>Gestionar publicaciones</button>
                        <button>Preguntas frecuentes sobre ventas</button>
                    </div>

                    <h3>Ayuda sobre tu cuenta</h3>
                    <div className='help-btn-container'>
                        <button>Configuracion de mi cuenta</button>
                        <button>Seguridad</button>
                    </div>

                </div>

            </div >
            <Footer />
        </>
    )
}

export default AboutUs