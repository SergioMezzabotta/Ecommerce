import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar';
import { useContext } from 'react'
import { dataContext } from '../Context/DataContext'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SignForm.css"
import { useAuth } from '../../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Whatsapp from "../Whatsapp Widget/Whatsapp.js";

const current = new Date()
const año = `${current.getFullYear() < 10 ? '0' + current.getFullYear() : current.getFullYear()}-${current.getMonth() + 1 < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1}-${current.getDate() < 10 ? '0' + current.getDate() : current.getDate()}`
const hora = `${current.getHours() < 10 ? '0' + current.getHours() : current.getHours()}:${current.getMinutes() < 10 ? '0' + current.getMinutes() : current.getMinutes()}:${current.getSeconds() < 10 ? '0' + current.getSeconds() : current.getSeconds()}`
const fecha = año + 'T' + hora

const Profile = () => {
  const url = process.env.REACT_APP_BACK_URL;
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { data, cart, clearCart } = useContext(dataContext);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const user_id = localStorage.getItem('user_Id');

    axios.put(url + `/user-info-form/${user_id}`, formulario)
      .then(response => {
        console.log('Informacion del usuario actualizada:', response.data);
      })
      .catch(error => {
        console.error('Error al actualizar la informacion del usuario:', error);
      });
  };

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

  const [userInfo, setUserInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [productsFromOrders, setProductsFromOrders] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const userName = localStorage.getItem('username');
  const customerID = localStorage.getItem('user_Id');
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  //funcion de boton de cambio de contraseña
  // const [showChangePasswordOptions, setShowChangePasswordOptions] = useState(false);
  // const [oldPassword, setOldPassword] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  const [showSeguridadInfo, setShowSeguridadInfo] = useState(false);
  const [showEraseAccountOptions, setShowEraseAccountOptions] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [message, setMessage] = useState('');
  const [seeProducts, setSeeProducts] = useState({});
  const [orderStatus, setOrderStatus] = useState({});
  const [imageData, setImageData] = useState([]);
  const [showButtons, setShowButtons] = useState(true);
  const [showCerrarSesion, setShowCerrarSesion] = useState(false);
  const closeAllToggles = () => {
    setShowUserInfo(false);
    setShowOrderInfo(false);
    setShowSeguridadInfo(false);
    setShowCerrarSesion(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetch(url + '/getuploadedinfo')
      .then(res => res.json())
      .then(data => setImageData(data))
      .catch(error => console.error("Error fetching data:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductImages = (product) => {
    const productImageData = imageData.filter(item => item.Codigo_Art === product.SKUCode);
    return productImageData.map(item => `http://localhost:3000/prod_img/${item.Nombre_Arch}`);
  };

  const toggleCerrarSesion = () => {
    closeAllToggles();
    setShowCerrarSesion(!showCerrarSesion);
    setShowButtons(false);
  }

  const toggleSeguridadInfo = () => {
    closeAllToggles();
    setShowSeguridadInfo(!showSeguridadInfo);
    setShowButtons(false);
  }
  //ver informacion de formulario
  const handleShowFormInfo = () => {
    const user_id = localStorage.getItem('user_Id');
    axios.get(url + `/user-info/${user_id}`)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('Error al obtener la información del usuario:', error);
      });
  };

  const toggleShowPersonalInfo = () => {
    closeAllToggles();
    setShowUserInfo(!showUserInfo);
    setShowButtons(false);
  };

  const toggleShowOrderInfo = () => {
    closeAllToggles();
    setShowOrderInfo(!showOrderInfo);
    setShowButtons(false);
  };

  const showButtonsAgain = () => {
    closeAllToggles();
    setShowButtons(true);
  };

  //Mostrar las ordenes en el perfil
  const handleShowOrderInfo = () => {
    const user_id = localStorage.getItem('user_Id');
    axios.get(url + `/order-info/${user_id}`)
      .then(response => {
        setOrderInfo(response.data);
      })
      .catch(error => {
        console.error('Error al obtener la información de los pedidos:', error);
      });
  };

  const toggleSeeProducts = (orderId) => {
    setSeeProducts((prevSeeProducts) => ({
      ...prevSeeProducts,
      [orderId]: !prevSeeProducts[orderId],
    }));
  };

  const handleShowProductsFromOrders = (order) => {
    const order_id = order.order_id
    axios.get(url + `/order-products/${order_id}`)
      .then(response => {
        setProductsFromOrders(response.data);
      })
      .catch(error => {
        console.error('Error al obtener la información de los pedidos:', error);
      });
  };

  var OrderItems = [];
  cart.forEach(product => {
    var reg = {
      ProductCode: product.SKUCode,
      Description: product.Description,
      Quantity: 1,
      UnitPrice: product.Price
    }
    OrderItems.push(reg);
  });

  // Cancelar ordenes en la base de datos
  const cancelOrder = (id_orden, order_status) => {
    axios.put(url + `/orders-status/${id_orden}`, { order_status: order_status })
      .then((response) => {
        console.log('Orden Cancelada exitosamente:', response)
      })
      .catch((error) => {
        console.error('Error al cancelar orden:', error)
      });
  };

  const deleteOrder = (id_orden) => {
    axios.delete(url + `/delete-order/${id_orden}`)
      .then((response) => {
        console.log('Orden eliminada con éxito:', response);
      })
      .catch((error) => {
        console.error('Error al eliminar orden:', error);
      });
  };

  //comprueba si el usuario tiene datos guardados en la base de datos y los autocompleta
  const userData = () => {
    axios.get(url + `/user-info/${customerID}`)
      .then(response => {
        const userData = response.data;
        setFormulario({
          nameValue: userData.nombre,
          lastnameValue: userData.apellido,
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

  //borrar cuenta desde el perfil de usuario<>
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const toggleEraseAccount = () => {
    setShowEraseAccountOptions(!showEraseAccountOptions);
  };

  const deleteAccount = () => {
    const user_Id = localStorage.getItem('user_Id');
    axios.delete(url + `/delete-account/${user_Id}`, {
      data: { password: password },
      withCredentials: true,
    })
      .then((response) => {
        setErrorMessage('Cuenta eliminada con exito.');
        setTimeout(() => {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('user_id');
          navigate('/signin');
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage('Error al eliminar la cuenta.');
      });
  };
  //borrar cuenta desde el perfil de usuario</>

  const handleFormulario = (event) => {
    var _datos = { ...formulario };
    setFormulario({ ..._datos, [event.target.name]: event.target.value });
  }

  // //logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user_Id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    clearCart();
    navigate('/');
  }

  // const toggleChangePasswordOptions = (e) => {
  //   setShowChangePasswordOptions(!showChangePasswordOptions);
  // };

  // const handlePasswordChange = async () => {

  //   if (!oldPassword || !newPassword) {
  //     setMessage('Por favor, completa todos los campos.');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('/change-password', {
  //       oldPassword: oldPassword,
  //       newPassword: newPassword,
  //     });

  //     setMessage(response.data.message);
  //     setOldPassword('');
  //     setNewPassword('');
  //   } catch (error) {
  //     setMessage(error.response.data.error);
  //   }
  // };

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: ""
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: ""
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow to="prev" />,
    nextArrow: <NextArrow to="next" />
  };

  return (
    <>
      <Navbar />
      {isLoggedIn ? (
        <div className='settings-container'>


          {/* Botones */}
          {showButtons && (
            <div className='cuadros-container'>
              {/* Ver informacion personal */}
              <button className='profile-btn' onClick={() => {
                handleShowFormInfo();
                toggleShowPersonalInfo();
                userData();
              }}>
                <svg height="100px" width="100px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <p>Ver Informacion personal</p>
              </button>
              {/* Historial de compras */}
              <button className='profile-btn' onClick={() => {
                handleShowOrderInfo();
                toggleShowOrderInfo();
              }}>
                <svg height="100px" width="100px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>

                <p>Historial de compras</p>
              </button>
              {/* Seguridad */}
              <button className='profile-btn' onClick={() => {
                handleShowOrderInfo();
                toggleSeguridadInfo();
              }}>
                <svg height="100px" width="100px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                <p>Seguridad</p>
              </button>
              {/* Cerrar sesion */}
              <button className='profile-btn' onClick={() => {
                toggleCerrarSesion();
              }}>
                <svg height="100px" width="100px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <p>Cerrar Sesion</p>
              </button>
            </div>
          )}


          {/* ajustes de usuario logeado */}
          {/* {isProfileSettingsOpen && (
              <ul className='user-menu-options'>
                <li>
                  <Link to='/profile'>Ajustes de usuario</Link>
                </li>
                <Link onClick={handleLogout}>Salir de la cuenta</Link>
              </ul>
            )} */}

          {/* Desplegables */}

          {/* Ver informacion personal */}
          {showUserInfo && userInfo && (
            <>
              <button className='link-para-volver-perfil' onClick={showButtonsAgain}>
                <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </button>
              <div className="user-info">
                <h3>Informacion personal de {userName}</h3>
                <p>Nombre:
                  <input
                    id="nameValue"
                    className="form-field-perfil"
                    type="text"
                    value={formulario.nameValue}
                    onChange={handleFormulario}
                    placeholder="Nombre *"
                    name="nameValue"
                  />
                </p>
                <p>Apellido:
                  <input
                    id="lastnameValue"
                    className="form-field-perfil"
                    type="text"
                    value={formulario.lastnameValue}
                    onChange={handleFormulario}
                    placeholder="Apellido *"
                    name="lastnameValue"
                  />
                </p>
                <p>Email: {userInfo.email ? userInfo.email : "Sin completar"}</p>
                <p>Numero de telefono:
                  <input
                    id="phone-number"
                    className="form-field-perfil"
                    type="number"
                    value={formulario.phoneValue}
                    onChange={handleFormulario}
                    placeholder="Numero de telefono"
                    name="phoneValue"
                  />
                </p>
                <p>Tipo de documento:
                  <select
                    value={formulario.documentType}
                    onChange={handleFormulario}
                    id="documento"
                    className="form-field-perfil"
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
                </p>
                <p>Documento:
                  <input
                    id="document"
                    className="form-field-perfil"
                    type="number"
                    value={formulario.documentValue}
                    onChange={handleFormulario}
                    placeholder="Documento *"
                    name="documentValue"
                  />
                </p>
                <p>Provincia:
                  <select
                    value={formulario.provinceNumber}
                    onChange={handleFormulario}
                    id="province"
                    className="form-field-perfil"
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
                </p>
                <p>Calle:
                  <input
                    id="address"
                    className="form-field-perfil"
                    type="text"
                    value={formulario.addressValue}
                    onChange={handleFormulario}
                    placeholder="Calle (sin numero) *"
                    name="addressValue"
                  />
                </p>
                <p>Numero de casa:
                  <input
                    id="number-address"
                    className="form-field-perfil"
                    type="number"
                    value={formulario.numberaddressValue}
                    onChange={handleFormulario}
                    placeholder="Numero de casa *"
                    name="numberaddressValue"
                  />
                </p>
                <p>Codigo postal:
                  <input
                    id="postalcode"
                    className="form-field-perfil"
                    type="number"
                    value={formulario.postalValue}
                    onChange={handleFormulario}
                    placeholder="Codigo Postal"
                    name="postalValue"
                  />
                </p>
                <p>Ciudad:
                  <input
                    id="city"
                    className="form-field-perfil"
                    type="text"
                    value={formulario.cityValue}
                    onChange={handleFormulario}
                    placeholder="Ciudad"
                    name="cityValue"
                  />
                </p>
                <button className='' onClick={handleSubmit}>Guardar</button>
              </div>
            </>
          )}
          {/* Historial de compras */}
          {showOrderInfo && (
            <>
              <button className='link-para-volver-perfil' onClick={showButtonsAgain}>
                <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </button>
              {orderInfo && orderInfo.length > 0 ? (
                <div className="order-info">
                  <h3>Pedidos realizados de {userName}</h3>
                  {orderInfo.map((order, index) => {
                    const isOrderCancelled = orderStatus[order.order_id];
                    return (
                      <div key={index} className="order-details">
                        <p key='Id'>ID de pedido: {order.order_id}</p>
                        <p key='Date'>Fecha de orden: {order.date}</p>
                        <p key='IVA'>Categoria de IVA: {order.iva_category}</p>
                        <p key='Order'>Estado del pedido: {`${order.order_status === '0' ? 'Vigente' : 'Cancelado'}`}</p>
                        <p key='Total'>Total: ${order.total}</p>
                        <button
                          onClick={() => {
                            handleShowProductsFromOrders(order);
                            toggleSeeProducts(order.order_id);
                          }}
                        >
                          Ver productos
                        </button>
                        {seeProducts[order.order_id] && productsFromOrders && (
                          <>
                            <div>
                              {productsFromOrders.map((productFromOrder) => {
                                const productCode = productFromOrder.product_code;
                                return (
                                  <div className='products-container' key={productCode}>
                                    <p>Nombre del producto: {productFromOrder.product_name}</p>
                                    <p>Cantidad: {productFromOrder.product_quantity}</p>
                                    <p>Precio unitario: ${productFromOrder.product_unitprice}</p>
                                    <p>{productFromOrder.product_code}</p>
                                    {data
                                      .filter((product) => { return product.SKUCode === productFromOrder.product_code })
                                      .map((product, product_code) => {
                                        const images = getProductImages(product);
                                        return (
                                          <>
                                            <div className="card-container-inside-orders" key={product_code}>
                                              <div className='card-prod-inside-orders'>
                                                <Slider {...settings}>
                                                  {images.map((image, index) => (
                                                    <div key={index}>
                                                      <img src={image} alt={`Imagen ${index + 1}`} />
                                                    </div>
                                                  ))}
                                                </Slider>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      })}
                                  </div>
                                )
                              })}
                            </div>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (isOrderCancelled) {
                              console.log('La orden ya ha sido cancelada');
                              return;
                            }
                            cancelOrder(order.order_id, 1);
                            setOrderStatus(prevStatus => ({ ...prevStatus, [order.order_id]: true }));
                          }}
                          disabled={isOrderCancelled}
                        >
                          {isOrderCancelled ? 'Orden Cancelada' : 'Cancelar Orden'}
                        </button>
                        <button onClick={() => {
                          deleteOrder(order.order_id)
                        }}>
                          Eliminar Orden
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="order-info">
                  <p>No hay pedidos para mostrar.</p>
                </div>
              )}
            </>
          )}
          {/* Cerrar Sesion */}
          {showCerrarSesion && (
            <>
              <button className='link-para-volver-perfil' onClick={showButtonsAgain}>
                <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </button>
              <div>Estas seguro?</div>
              <button onClick={handleLogout}>Si</button>
              <button onClick={showButtonsAgain}>No</button>
            </>
          )}
          {/* Seguridad */}
          {showSeguridadInfo && (
            <>
              <button className='link-para-volver-perfil' onClick={showButtonsAgain}>
                <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </button>
              <div className="user-info">
                {/* cambiar contraseña */}
                {/* Restablecer contraseña */}

                {/* <button onClick={() => {
            toggleChangePasswordOptions();
            handlePasswordChange();
          }}>
            Cambiar la contraseña de tu cuenta
          </button>
          {showChangePasswordOptions && (
            <>
              <div className='inAdmin-signup-in-profile'>
                <div className="inAdmin-sign-container">
                  <div className="welcome-message">
                    <h2>Cambiar Contraseña</h2>
                  </div>
                  <div className="inAdmin-input-group">
                    <input
                      type="password"
                      id="oldpassword"
                      className="inAdmin-input-field"
                      placeholder="Contraseña anterior"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="inAdmin-input-group">
                    <input
                      type="password"
                      id="newpassword"
                      className="inAdmin-input-field"
                      placeholder="Nueva Contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="inAdmin-input-group">
                    <button className='inAdmin-button' onClick={handlePasswordChange}>
                      Cambiar
                    </button>
                    <p>{message}</p>
                  </div>
                </div>
              </div>
            </>
          )} */}
                {/* Borrar Cuenta */}
                <button className='' onClick={toggleEraseAccount}>
                  Borrar Cuenta
                </button>
                {showEraseAccountOptions && (
                  <>
                    <div className='erase-account-container'>
                      <h2 className='erase-account-message'>
                        Perderas toda tu informacion.
                        Introduce tu contraseña para confirmar la eliminacion
                      </h2>
                      <div className='erase-account-container'>
                        <input
                          placeholder='Contraseña'
                          className='input-field-delete'
                          type='password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        >
                        </input>
                        <button className='delete-account-btn' onClick={deleteAccount}>
                          Borrar cuenta
                        </button>
                        {errorMessage && <p>{errorMessage}</p>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}


        </div>
      ) : (
        <div className='settings-container'>
          <h1 className='bad-request-message'>
            Necesitas estar logeado para poder acceder aca.
          </h1>
          <div className=''>
            ¿Deseas logearte ahora?
            <Link to={'/signin'}>
              Ingresar
            </Link>
          </div>
        </div>
      )}
      <Whatsapp />
    </>
  );
};

export default Profile