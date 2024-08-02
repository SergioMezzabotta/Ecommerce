import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useContext } from 'react'
import { dataContext } from '../Context/DataContext'
import CheckoutElements from './CheckoutElements';
import Whatsapp from '../Whatsapp Widget/Whatsapp';

const Checkout = () => {
    const url = process.env.REACT_APP_BACK_URL;
    // const serverUrl = process.env.REACT_APP_SERVER_URL;

    const { cart } = useContext(dataContext);

    // FECHA
    // const current = new Date()
    // const año = `${current.getFullYear() < 10 ? '0' + current.getFullYear() : current.getFullYear()}-${current.getMonth() + 1 < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1}-${current.getDate() < 10 ? '0' + current.getDate() : current.getDate()}`
    // const hora = `${current.getHours() < 10 ? '0' + current.getHours() : current.getHours()}:${current.getMinutes() < 10 ? '0' + current.getMinutes() : current.getMinutes()}:${current.getSeconds() < 10 ? '0' + current.getSeconds() : current.getSeconds()}`
    // const fecha = año + 'T' + hora

    // ORDEN Y NUMERO DE ORDEN
    // var timestamp = parseInt(Date.now() / 1000, 10).toFixed(0);
    // const ordenId = timestamp

    //mapeo de provincias
    const provinceMap = [
        {
            nombre: 'ciudad autonoma de buenos aires',
            codigo: 0
        }, {
            nombre: 'buenos aires',
            codigo: 1
        }, {
            nombre: 'catamarca',
            codigo: 2
        }, {
            nombre: 'cordoba',
            codigo: 3
        }, {
            nombre: 'corrientes',
            codigo: 4
        }, {
            nombre: 'entre rios',
            codigo: 5
        }, {
            nombre: 'jujuy',
            codigo: 6
        }, {
            nombre: 'mendoza',
            codigo: 7
        }, {
            nombre: 'la rioja',
            codigo: 8
        }, {
            nombre: 'salta',
            codigo: 9
        }, {
            nombre: 'san juan',
            codigo: 10
        }, {
            nombre: 'san luis',
            codigo: 11
        }, {
            nombre: 'santa fe',
            codigo: 12
        }, {
            nombre: 'santiago del estero',
            codigo: 13
        }, {
            nombre: 'tucuman',
            codigo: 14
        }, {
            nombre: 'chaco',
            codigo: 16
        }, {
            nombre: 'chubut',
            codigo: 17
        }, {
            nombre: 'formosa',
            codigo: 18
        }, {
            nombre: 'misiones',
            codigo: 19
        }, {
            nombre: 'neuquen',
            codigo: 20
        }, {
            nombre: 'la pampa',
            codigo: 21
        }, {
            nombre: 'rio negro',
            codigo: 22
        }, {
            nombre: 'santa cruz',
            codigo: 23
        }, {
            nombre: 'tierra del fuego',
            codigo: 24
        }
    ]

    //mapeo de tipos de documentos
    const documentMap = [
        {
            nombre: 'c.u.i.t.',
            codigo: 80
        }, {
            nombre: 'c.u.i.l.',
            codigo: 86
        }, {
            nombre: 'd.n.i.',
            codigo: 96
        }
    ]
   
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    // const [message, setMessage] = useState('');
    // const [messageType, setMessageType] = useState('');

    const [message] = useState('');
    const [messageType] = useState('');


    const [formEmail, setFormEmail] = useState("");

    const handleEmailChange = (event) => {
        setFormEmail(event.target.value);
    };

    const handleFormulario = (event) => {
        var _datos = { ...formulario };
        setFormulario({ ..._datos, [event.target.name]: event.target.value });
    }

    const handleDatosUsuarioSubmit = (event) => {
        //previene que se recargue la pagina al presentar el formulario
        event.preventDefault();

        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn) {

            const user_id = localStorage.getItem('user_Id');

            axios.put(url + `/user-info-form/${user_id}`, formulario)
                .then(response => {
                    console.log('Informacion del usuario actualizada:', response.data);
                })
                .catch(error => {
                    console.error('Error al actualizar la informacion del usuario:', error);
                });
        } else {
            console.log('El usuario no esta logueado, no se guardara la informacion.');
        }
    }

    //abarca todas la mayoria de las const
    const [formulario, setFormulario] = useState({
        provinceNumber: "",
        docValue: "",
        documentType: "",
        documentValue: "",
        nameValue: "",
        lastnameValue: "",
        addressValue: "",
        numberaddressValue: "",
        cityValue: "",
        postalValue: "",
        phoneValue: ""
    });

    //comprueba si hay datos del usuario en la base de datos y autocompleta los campos
    useEffect(() => {
        const userData = () => {
            const user_id = localStorage.getItem('user_Id');
            axios.get(url + `/user-info/${user_id}`)
                .then(response => {
                    const userData = response.data;
                    setFormulario({
                        nameValue: userData.nombre,
                        lastnameValue: userData.apellido,
                        emailValue: userData.email,
                        phoneValue: userData.numero_telefono,
                        documentType: userData.tipo_documento,
                        documentValue: userData.documento,
                        provinceNumber: userData.provincia,
                        addressValue: userData.calle,
                        numberaddressValue: userData.numero_casa,
                        cityValue: userData.ciudad,
                        postalValue: userData.codigo_postal
                    });
                })
                .catch(error => {
                    console.error('Error al obtener la información del usuario:', error);
                });
        };
        userData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    var OrderItemsMP = [];
    // eslint-disable-next-line no-unused-vars
    var TotalMP = 0;
    cart.forEach(product => {
        const discountedPrice = product.Price - (product.Price * (product.Discount / 100));
        var reg = {
            id: product.SKUCode,
            title: product.Description,
            quantity: 1,
            unit_price: discountedPrice
        }

        OrderItemsMP.push(reg);
        TotalMP += reg.UnitPrice;
    });

    var OrderItems = [];
    var Total = 0;
    cart.forEach(product => {
        const discountedPrice = product.Price - (product.Price * (product.Discount / 100));
        var reg = {
            ProductCode: product.SKUCode,
            Description: product.Description,
            Quantity: 1,
            UnitPrice: discountedPrice
        }

        OrderItems.push(reg);
        Total += reg.UnitPrice;
    });

    // const [costoEnvio, setCostoEnvio] = useState(0);

    // const [opcionSeleccionada, setOpcionSeleccionada] = useState('');

    // const handleOpcionChange = (event) => {
    //     setOpcionSeleccionada(event.target.value);
    // };

    // const opcionesDeEnvioOca = () => {
    //     console.log('Seleccionado Oca')
    //     setCostoEnvio(200)
    // }

    // const opcionesDeEnvioAcordar = () => {
    //     console.log('Seleccionado Acordar')
    //     setCostoEnvio(0)
    // }

    // const opcionesDeEnvioRetiro = () => {
    //     console.log('Seleccionado Retiro')
    //     setCostoEnvio(0)
    // }

    // const opcionesDeEnvioAndreani = () => {
    //     console.log('Seleccionado Andreani')
    // }

    // useEffect(() => {
    //     if (opcionSeleccionada === 'oca') {
    //         opcionesDeEnvioOca(opcionSeleccionada);
    //     }
    //     if (opcionSeleccionada === 'acordar') {
    //         opcionesDeEnvioAcordar(opcionSeleccionada);
    //     }
    //     if (opcionSeleccionada === 'retirar') {
    //         opcionesDeEnvioRetiro(opcionSeleccionada);
    //     }
    //     // if (opcionSeleccionada === 'andreani') {
    //     //     opcionesDeEnvioAndreani(opcionSeleccionada);
    //     // }
    // }, [opcionSeleccionada]);


    const costoTotal = Total
    // const costoTotal = Total + costoEnvio

    return (
        <>
            {isLoggedIn ? (
                <>
                    <div className='header-form-container'>
                        <div className='linea-de-navegacion' href='/cart'>
                            <a href='/'>Inicio ▸</a>
                            <a href='/cart'>Carrito ▸</a>
                            <p>Pago</p>
                        </div>
                        <h1>Pago</h1>
                        <h2>Datos del envio</h2>
                        <p className='p'>Las opciones con un * son obligatorias</p>
                    </div>
                    <div className='checkout-container'>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleDatosUsuarioSubmit}>

                                <input
                                    id="formEmail"
                                    className="form-field-email"
                                    type="text"
                                    value={formEmail}
                                    onChange={handleEmailChange}
                                    placeholder="Email *"
                                    name="formEmail"
                                />
                                <input
                                    id="nameValue"
                                    className="form-field"
                                    type="text"
                                    value={formulario.nameValue}
                                    onChange={handleFormulario}
                                    placeholder="Nombre *"
                                    name="nameValue"
                                />
                                {/* <span className="span-error" id="first-name-error">Introduzca un nombre</span> */}

                                <input
                                    id="lastnameValue"
                                    className="form-field"
                                    type="text"
                                    value={formulario.lastnameValue}
                                    onChange={handleFormulario}
                                    placeholder="Apellido *"
                                    name="lastnameValue"
                                />
                                {/* <span className="span-error" id="last-name-error">Introduzca una razon social valida</span> */}

                                <input
                                    id="phone-number"
                                    className="form-field"
                                    type="number"
                                    value={formulario.phoneValue}
                                    onChange={handleFormulario}
                                    placeholder="Numero de telefono"
                                    name="phoneValue"
                                />
                                {/* <span className="span-error" id="phone-number-error">Introduzca un numero de telefono valido</span> */}

                                <select
                                    value={formulario.documentType}
                                    onChange={handleFormulario}
                                    id="documento"
                                    className="form-field"
                                    placeholder="Tipo de documento *"
                                    name="documentType"
                                >
                                    <option value="" disabled>
                                        Tipo de documento *
                                    </option>
                                    {documentMap.map((documento) => (
                                        <option key={documento.codigo} value={documento.codigo}>
                                            {documento.nombre.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {/* <span className="span-error" id="doctype-error">Seleccione un tipo de documento</span> */}

                                <input
                                    id="document"
                                    className="form-field"
                                    type="number"
                                    value={formulario.documentValue}
                                    onChange={handleFormulario}
                                    placeholder="Documento *"
                                    name="documentValue"
                                />
                                {/* <span className="span-error" id="document-error">Introduzca un documento valido</span> */}

                                <select
                                    value={formulario.provinceNumber}
                                    onChange={handleFormulario}
                                    id="province"
                                    className="form-field"
                                    placeholder="Provincia"
                                    name="provinceNumber"
                                >
                                    <option value="" disabled>
                                        Provincia *
                                    </option>
                                    {provinceMap.map((province) => (
                                        <option key={province.codigo} value={province.codigo}>
                                            {province.nombre.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {/* <span className="span-error" id="province-error">Seleccione una provincia</span> */}

                                <input
                                    id="address"
                                    className="form-field"
                                    type="text"
                                    value={formulario.addressValue}
                                    onChange={handleFormulario}
                                    placeholder="Calle (sin numero) *"
                                    name="addressValue"
                                />
                                {/* <span className="span-error" id="address-error">Introduzca una direccion</span> */}

                                <input
                                    id="number-address"
                                    className="form-field"
                                    type="text"
                                    value={formulario.numberaddressValue}
                                    onChange={handleFormulario}
                                    placeholder="Numero de casa *"
                                    name="numberaddressValue"
                                />
                                {/* <span className="span-error" id="number-error">Introduzca un numero de direccion</span> */}

                                <input
                                    id="postalcode"
                                    className="form-field"
                                    type="text"
                                    value={formulario.postalValue}
                                    onChange={handleFormulario}
                                    placeholder="Codigo Postal"
                                    name="postalValue"
                                />
                                {/* <span className="span-error" id="postal-error">Introduzca un codigo postal</span> */}

                                <input
                                    id="city"
                                    className="form-field"
                                    type="text"
                                    value={formulario.cityValue}
                                    onChange={handleFormulario}
                                    placeholder="Ciudad"
                                    name="cityValue"
                                />
                                {/* <span className="span-error" id="city-error">Introduzca una ciudad</span> */}

                            </form>
                            <div className={messageType}>
                                {message && <p>{message}</p>}
                            </div>
                        </div>

                        <div className="payment-container">
                            <div className='header-payment-container'>
                                <h2>Pedido</h2>
                            </div>
                            <div className='products-payment-container'>
                                <CheckoutElements />
                            </div>

                            <div className='footer-payment-container'>
                                {/* <h3>Producto/s: ${Total}</h3>
                                <h3>Costo Envio: ${costoEnvio}</h3> */}
                                <p>Envio a acordar con el vendedor</p>
                                <h3>Total: ${costoTotal}</h3>
                                <button onClick={() => {
                                    fetchMPData();
                                    toggleShowPaymentMethods();
                                }}>
                                    Metodos de pago
                                </button>
                                {showPaymentMethods && (
                                    <>
                                        <Wallet
                                            initialization={{ preferenceId: preferenceId }}
                                            customization={customization}
                                        />
                                    </>
                                )}
                            </div>

                            {/* <div className='uala-button-container'>
                                            <button>
                                                Pagar con Uala
                                            </button>
                                    </div> */}
                            {/* <div className='shipment-payment-container'>
                                <h3>Metodo de envio</h3>
                                <select value={opcionSeleccionada} onChange={handleOpcionChange}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="acordar">Acordar con el vendedor</option>
                                    <option value="retirar">Retirar en tienda</option>
                                    <option value="oca" disabled>Oca</option>
                                    <option value="andreani" disabled>Andreani</option>
                                </select>
                                {(opcionSeleccionada === 'acordar' || opcionSeleccionada === 'retirar' || opcionSeleccionada === 'oca') && (
                                    <div>
                                        <div className=''>
                                            <Wallet
                                                initialization={{ preferenceId: preferenceId }}
                                                customization={customization}
                                            />
                                        </div>
                                        <div className='uala-button-container'>
                                            <button>
                                                Pagar con Uala
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    </div>
                </>
            ) : (
                <div className='checkout-container'>
                    <div className="form-container">
                        <p className='p'>Las opciones con un * son obligatorias</p>
                        <form className="register-form" onSubmit={handleDatosUsuarioSubmit}>

                            <input
                                id="formEmail"
                                className="form-field-email"
                                type="text"
                                value={formEmail}
                                onChange={handleEmailChange}
                                placeholder="Email *"
                                name="formEmail"
                            />

                            <input
                                id="nameValue"
                                className="form-field"
                                type="text"
                                value={formulario.nameValue}
                                onChange={handleFormulario}
                                placeholder="Nombre *"
                                name="nameValue"
                            />
                            {/* <span className="span-error" id="first-name-error">Introduzca un nombre</span> */}

                            <input
                                id="lastnameValue"
                                className="form-field"
                                type="text"
                                value={formulario.lastnameValue}
                                onChange={handleFormulario}
                                placeholder="Apellido *"
                                name="lastnameValue"
                            />
                            {/* <span className="span-error" id="last-name-error">Introduzca un apellido valido</span> */}



                            <input
                                id="phone-number"
                                className="form-field"
                                type="number"
                                value={formulario.phoneValue}
                                onChange={handleFormulario}
                                placeholder="Numero de telefono"
                                name="phoneValue"
                            />
                            {/* <span className="span-error" id="phone-number-error">Introduzca un numero de telefono valido</span> */}

                            <select
                                value={formulario.documentType}
                                onChange={handleFormulario}
                                id="documento"
                                className="form-field"
                                placeholder="Tipo de documento *"
                                name="documentType"
                            >
                                <option value="" disabled>
                                    Tipo de documento *
                                </option>
                                {documentMap.map((documento) => (
                                    <option key={documento.codigo} value={documento.codigo}>
                                        {documento.nombre.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {/* <span className="span-error" id="doctype-error">Seleccione un tipo de documento</span> */}

                            <input
                                id="document"
                                className="form-field"
                                type="number"
                                value={formulario.documentValue}
                                onChange={handleFormulario}
                                placeholder="Documento *"
                                name="documentValue"
                            />
                            {/* <span className="span-error" id="document-error">Introduzca un documento valido</span> */}

                            <select
                                value={formulario.provinceNumber}
                                onChange={handleFormulario}
                                id="province"
                                className="form-field"
                                placeholder="Provincia"
                                name="provinceNumber"
                            >
                                <option value="" disabled>
                                    Provincia *
                                </option>
                                {provinceMap.map((province) => (
                                    <option key={province.codigo} value={province.codigo}>
                                        {province.nombre.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            {/* <span className="span-error" id="province-error">Seleccione una provincia</span> */}

                            <input
                                id="address"
                                className="form-field"
                                type="text"
                                value={formulario.addressValue}
                                onChange={handleFormulario}
                                placeholder="Calle (sin numero) *"
                                name="addressValue"
                            />
                            {/* <span className="span-error" id="address-error">Introduzca una direccion</span> */}

                            <input
                                id="number-address"
                                className="form-field"
                                type="text"
                                value={formulario.numberaddressValue}
                                onChange={handleFormulario}
                                placeholder="Numero de casa *"
                                name="numberaddressValue"
                            />
                            {/* <span className="span-error" id="number-error">Introduzca un numero de direccion</span> */}

                            <input
                                id="postalcode"
                                className="form-field"
                                type="text"
                                value={formulario.postalValue}
                                onChange={handleFormulario}
                                placeholder="Codigo Postal"
                                name="postalValue"
                            />
                            {/* <span className="span-error" id="postal-error">Introduzca un codigo postal</span> */}
                            <input
                                id="city"
                                className="form-field"
                                type="text"
                                value={formulario.cityValue}
                                onChange={handleFormulario}
                                placeholder="Ciudad"
                                name="cityValue"
                            />
                            {/* <span className="span-error" id="city-error">Introduzca una ciudad</span> */}

                        </form>
                        <div className={messageType}>
                            {message && <p>{message}</p>}
                        </div>
                    </div>

                    <div className="form-container">
                        <h2>Metodo de pago</h2>
                        <div className='payment-option'>
                            <Wallet initialization={{ preferenceId }} />
                        </div>
                    </div>
                </div>
            )}
            <Whatsapp />
        </>
    );
};

export default Checkout;