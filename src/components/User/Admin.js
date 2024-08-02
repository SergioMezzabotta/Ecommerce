/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SignForm.css";
import axios from 'axios';
import { dataContext } from '../Context/DataContext';
import Carpeta from './Carpeta';
import CarpetaNavbar from './CarpetaNavbar';
import CarpetaRecomended from './CarpetaRecomended';
import CarpetaExcluded from './CarpetaExcluded';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ChromePicker } from 'react-color';
import '../Footer/Footer.css';
import { useAuth } from '../../AuthContext';
import Logo from '../../media/logo.png'
import Whatsapp from "../Whatsapp Widget/Whatsapp.js";
import avatar from '../../media/avatar.png';
import fondoMenu from '../../media/fondo.png';

const Admin = () => {
  const url = process.env.REACT_APP_BACK_URL;
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { setIsLoggedIn } = useAuth();
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const { data, cart, classifierData, depositoListData, priceListData } = useContext(dataContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorHtml, setEditorHtml] = useState('');

  const [backgroundColor, setBackgroundColor] = useState({ r: 0, g: 0, b: 0, a: 0 });

  //todos los toggle para abrir y cerrar secciones del administrador
  const [showUserCreatorOptions, setShowUserCreatorOptions] = useState(false);
  const [showUserPasswordReset, setShowUserPasswordReset] = useState(false);
  const [showOrdersForAdmin, setShowOrdersForAdmin] = useState(false);
  const [showProdImgChanger, setShowProdImgChanger] = useState(false);
  const [showBannerImgChanger, setShowBannerImgChanger] = useState(false);
  const [showClassifierChanger, setShowClassifierChanger] = useState(false);
  const [showNavbarClassifierChanger, setShowNavbarClassifierChanger] = useState(false);
  const [showRecomendedClassifierChanger, setShowRecomendedClassifierChanger] = useState(false);
  const [showExcludedClassifier, setShowExcludedClassifier] = useState(false);
  const [showLogoChangerOptions, setShowLogoChangerOptions] = useState(false);
  const [showToggleFooterChanger, setShowToggleFooterChanger] = useState(false);
  const [showToggleWhatsappIconChanger, setShowToggleWhatsappIconChanger] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showToggleNoActiveSelection] = useState(true);

  const closeAllToggles = () => {
    setShowUserList(false);
    setShowUserCreatorOptions(false);
    setShowUserPasswordReset(false);
    setShowOrdersForAdmin(false);
    setShowProdImgChanger(false);
    setShowBannerImgChanger(false);
    setShowClassifierChanger(false);
    setShowNavbarClassifierChanger(false);
    setShowRecomendedClassifierChanger(false);
    setShowLogoChangerOptions(false);
    setShowToggleFooterChanger(false);
    setShowToggleWhatsappIconChanger(false);
    setShowExcludedClassifier(false);
  };

  const toggleUserList = () => {
    closeAllToggles();
    setShowUserList(!showUserList);
  };

  const toggleUserCreatorOptions = () => {
    closeAllToggles();
    setShowUserCreatorOptions(!showUserCreatorOptions);
  };

  const togglePasswordResetOptions = () => {
    closeAllToggles();
    setShowUserPasswordReset(!showUserPasswordReset);
  };

  const toggleOrdersForAdmin = () => {
    closeAllToggles();
    setShowOrdersForAdmin(!showOrdersForAdmin);
  };

  const toggleProdImgChanger = async () => {
    closeAllToggles();
    setShowProdImgChanger(!showProdImgChanger);
  };

  const toggleBannerImgChanger = async () => {
    closeAllToggles();
    setShowBannerImgChanger(!showBannerImgChanger);
  };

  const toggleClassifierChanger = () => {
    closeAllToggles();
    setShowClassifierChanger(!showClassifierChanger);
  };

  const toggleNavBarClassifierChanger = () => {
    closeAllToggles();
    setShowNavbarClassifierChanger(!showNavbarClassifierChanger)
  };

  const toggleRecomendedClassifierChanger = () => {
    closeAllToggles();
    setShowRecomendedClassifierChanger(!showRecomendedClassifierChanger)
  };

  const toggleExcluderClassifier = () => {
    closeAllToggles();
    setShowExcludedClassifier(!showExcludedClassifier)
  };

  const toggleLogoChanger = () => {
    closeAllToggles();
    setShowLogoChangerOptions(!showLogoChangerOptions);
  };

  const toggleFooterChanger = () => {
    closeAllToggles();
    setShowToggleFooterChanger(!showToggleFooterChanger);
  };

  const toggleWhatsappIconChanger = () => {
    closeAllToggles();
    setShowToggleWhatsappIconChanger(!showToggleWhatsappIconChanger);
  };


  // aca termina la logica


  const handleBGColorChange = (color) => {
    setBackgroundColor(color.rgb);
  };
  // ordenes logica
  const current = new Date()
  const año = `${current.getFullYear() < 10 ? '0' + current.getFullYear() : current.getFullYear()}-${current.getMonth() + 1 < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1}-${current.getDate() < 10 ? '0' + current.getDate() : current.getDate()}`
  const hora = `${current.getHours() < 10 ? '0' + current.getHours() : current.getHours()}:${current.getMinutes() < 10 ? '0' + current.getMinutes() : current.getMinutes()}:${current.getSeconds() < 10 ? '0' + current.getSeconds() : current.getSeconds()}`
  const fecha = año + 'T' + hora

  const [orderStatus, setOrderStatus] = useState({});
  const [seeProducts, setSeeProducts] = useState({});
  const [productsFromOrders, setProductsFromOrders] = useState(null);
  const [ordersInfo, setOrdersInfo] = useState(null);


  const handleOrdersForAdmin = () => {
    axios.get(url + `/orders-info`)
      .then(response => {
        setOrdersInfo(response.data);
      })
      .catch(error => {
        console.error('Error al obtener la información de los pedidos:', error);
      });
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

  const toggleSeeProducts = (orderId) => {
    setSeeProducts((prevSeeProducts) => ({
      ...prevSeeProducts,
      [orderId]: !prevSeeProducts[orderId],
    }));
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

  // cancelar ordenes en la base de datos
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

  // cargado del footer
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await axios.get(url + '/obtener-contenido-footer');
        const { contenido, backgroundColor } = response.data;

        setEditorHtml(contenido || '');

        if (backgroundColor && typeof backgroundColor === 'object') {
          setBackgroundColor({
            r: backgroundColor.color_r,
            g: backgroundColor.color_g,
            b: backgroundColor.color_b,
            a: backgroundColor.color_a,
          });

        } else {
          console.warn('BackgroundColor no tiene el formato esperado:', backgroundColor);
        }

      } catch (error) {
        console.error('Error al cargar contenido desde el servidor:', error);
      }
    };

    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // guardar el footer
  const handleSave = async () => {
    try {
      await axios.post(url + '/guardar-contenido-footer', {
        contenido: editorHtml,
        backgroundColor: backgroundColor,
      });
      console.log('Contenido y color guardados con éxito.');
    } catch (error) {
      console.error('Error al guardar contenido y color en el servidor:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (sku) => {
    if (selectedFile && sku) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('codigoArt', sku);

      try {
        const response = await axios.post(url + '/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Archivo guardado: ', response.data);
      } catch (error) {
        console.error('Error subiendo archivo:', error);
      }
    } else {
      console.log('Asegurate de seleccionar un archivo e ingresar un SKUCode');
    }
  };

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

  const handleDeleteImage = async (imageId) => {
    try {
      const fileName = imageId.split('/').pop();
      await axios.delete(url + `/deleteimage/${fileName}`);
      console.log('Imagen borrada de forma exitosa.')
      window.location.reload(true);

    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarArtImagesDB = async () => {
    try {
      await axios.delete(url + `/eliminar-datos-imgcontroller`);

      console.log('Imagen borrada de forma exitosa.')
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarAllSliderDB = async () => {
    try {
      await axios.delete(url + `/eliminar-datos-selectedfolders`);

      console.log('Imagen borrada de forma exitosa.')
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarAllNavbarDB = async () => {
    try {
      await axios.delete(url + `/eliminar-datos-navbarfolders`);

      console.log('Imagen borrada de forma exitosa.')
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarAllRecomendadoDB = async () => {
    try {
      await axios.delete(url + `/eliminar-datos-carpetasrecomendadas`);

      console.log('Imagen borrada de forma exitosa.')
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarAllExcludedDB = async () => {
    try {
      await axios.delete(url + `/eliminar-datos-carpetasrecomendadas`);

      console.log('Imagen borrada de forma exitosa.')
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarOrdenesdePedidoDB = async () => {
    try {
      await axios.delete(url + `/eliminar-datos-ordenes`);

      console.log('Imagen borrada de forma exitosa.')
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarImagesArt = async () => {
    try {
      await axios.post(url + '/borrar-art-folders');

    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarImagesBanner = async () => {
    try {
      await axios.post(url + '/borrar-banner-folders');
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

  const handleEliminarImagesCategory = async () => {
    try {
      await axios.post(url + '/borrar-category-folders');
    } catch (error) {
      console.error('Error al eliminar la imagen de la base de datos:', error);
    }
  };

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
        .catch((error) => {
          console.error('Error al verificar el estado de administrador:', error);
        });
    };
    userIsAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteUser = (userId) => {
    axios.get(url + `/user-is-admin/${userId}`)
      .then((response) => {
        const isAdmin = response.data.isAdmin;
        if (isAdmin === 1) {
          performDeleteUser(userId);
        } else {
          console.log('No tienes permisos para borrar usuarios');
        }
      })
      .catch((error) => {
        console.error('Error al verificar el estado de administrador:', error);
      });
  };

  const performDeleteUser = (userId) => {
    axios.delete(url + `/delete-user/${userId}`)
      .then((response) => {
        console.log('Usuario eliminado con éxito:', response.data.mensaje);
        getUserList();
      })
      .catch((error) => {
        console.error('Error al borrar el usuario:', error);
      });
  };

  const editAdmin = (userId, newAdminValue) => {
    axios
      .put(url + `/edit-admin/${userId}`, { admin: newAdminValue })
      .then((response) => {

        const updatedAdminValue = response.data.isAdmin;

        if (updatedAdminValue === 1) {
          performEditAdmin(userId, newAdminValue);
        } else if (updatedAdminValue === 0) {
          performEditAdmin(userId, newAdminValue);
        } else {
          console.log('No tienes permisos de administrador');
        }
      })
      .catch((error) => {
        console.error('Error al verificar el estado de administrador:', error);
      });
  };

  const performEditAdmin = (userId, newAdminValue) => {
    axios
      .put(url + `/edit-admin/${userId}`, { admin: newAdminValue })
      .then((response) => {
        getUserList();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [userList, setUserList] = useState([]);
  const [imageData, setImageData] = useState([]);

  const getUserList = () => {
    axios.get(url + '/users')
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signupHandler = e => {
    e.preventDefault();
    axios.post(url + '/signup', {
      username: username,
      password: password,
      isAdmin: 1
    })
      .then((response) => {
        console.log(response.data)
        setUsername('');
        setPassword('');
        setIsRegistered(true);
      })
      .catch((error) => {
        setErrorMessage("Nombre de usuario y contraseña son obligatorios");
        setIsRegistered(false);
        console.error(error);
      });
  };

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

  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    fetch(url + '/rutas-img')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setImagePaths(data.imagePaths);
      })
      .catch(error => console.error('Error fetching image paths:', error));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedImages, setSelectedImages] = useState(null);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setSelectedImages(files);
  };

  const handleImgUpload = async () => {
    if (!selectedImages) return;

    const formData = new FormData();
    for (const file of selectedImages) {
      formData.append('images', file);
    }

    try {
      const response = await fetch(url + '/subir', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Imágenes subidas correctamente');
        // Actualizar la interfaz o realizar otras acciones necesarias después de la carga.
      } else {
        console.error('Error al subir imágenes');
      }
    } catch (error) {
      console.error('Error en la solicitud de carga:', error);
    }
  }

  // la logica del arbol jerarquico de carpetas
  //slider
  const [selectedFolders, setSelectedFolders] = useState([]);
  //navbar
  const [selectedNavbarFolders, setSelectedNavbarFolders] = useState([]);
  //recomendadas
  const [selectedRecomendedFolders, setSelectedRecomendedFolders] = useState([]);
  //recomendadas
  const [excludedFolders, setExcludedFolders] = useState([]);
  //slider
  const handleFolderSelect = (folder) => {
    setSelectedFolders((prevSelectedFolders) => {
      const isAlreadySelected = prevSelectedFolders.some(
        (selectedFolder) => selectedFolder.IdFolder === folder.IdFolder
      );

      if (isAlreadySelected) {
        return prevSelectedFolders.filter(
          (selectedFolder) => selectedFolder.IdFolder !== folder.IdFolder
        );
      } else {
        return [...prevSelectedFolders, folder];
      }
    });
  };
  //navbar
  const handleFolderNavbarSelect = (folder) => {
    setSelectedNavbarFolders((prevSelectedNavbarFolders) => {
      const isAlreadySelected = prevSelectedNavbarFolders.some(
        (selectedNavbarFolders) => selectedNavbarFolders.IdFolder === folder.IdFolder
      );

      if (isAlreadySelected) {
        return prevSelectedNavbarFolders.filter(
          (selectedNavbarFolders) => selectedNavbarFolders.IdFolder !== folder.IdFolder
        );
      } else {
        return [...prevSelectedNavbarFolders, folder];
      }
    });
  };
  //recomendadas
  const handleFolderRecomendedSelect = (folder) => {
    setSelectedRecomendedFolders((prevSelectedRecomendedFolders) => {
      const isAlreadySelected = prevSelectedRecomendedFolders.some(
        (selectedRecomendedFolders) => selectedRecomendedFolders.IdFolder === folder.IdFolder
      );

      if (isAlreadySelected) {
        return prevSelectedRecomendedFolders.filter(
          (selectedRecomendedFolders) => selectedRecomendedFolders.IdFolder !== folder.IdFolder
        );
      } else {
        return [...prevSelectedRecomendedFolders, folder];
      }
    });
  };
  //excluidas
  const handleFolderExcluded = (folder) => {
    setExcludedFolders((prevExcludedFolders) => {
      const isAlreadySelected = prevExcludedFolders.some(
        (excludedFolders) => excludedFolders.IdFolder === folder.IdFolder
      );

      if (isAlreadySelected) {
        return prevExcludedFolders.filter(
          (excludedFolders) => excludedFolders.IdFolder !== folder.IdFolder
        );
      } else {
        return [...prevExcludedFolders, folder];
      }
    });
  };

  //carpetas del slider
  const guardarCarpetasSeleccionadas = async () => {
    try {
      const response = await axios.get(url + '/obtener-carpetas-seleccionadas');
      const carpetasSeleccionadasBD = response.data;

      const carpetasSeleccionadasSet = new Set([...selectedFolders, ...carpetasSeleccionadasBD]);

      const carpetasSeleccionadas = Array.from(carpetasSeleccionadasSet);

      await enviarCarpetasSeleccionadasAlServidor(carpetasSeleccionadas);

      eliminarCarpetasDeseleccionadas();
    } catch (error) {
      console.error('Error al guardar carpetas:', error);
    }
  };

  const eliminarCarpetasDeseleccionadas = async () => {
    try {
      const carpetasDeseleccionadas = selectedFolders.filter((selected) => !selected.isSelected);

      if (carpetasDeseleccionadas.length > 0) {
        console.log('Carpetas a eliminar:', carpetasDeseleccionadas);

        setSelectedFolders((prevSelected) => prevSelected.filter((selected) => !carpetasDeseleccionadas.some(c => c.IdFolder === selected.IdFolder)));

        await Promise.all(carpetasDeseleccionadas.map(async (carpeta) => {
          await axios.delete(url + `/eliminar-carpeta/${carpeta.IdFolder}`);
          console.log('Carpeta eliminada de la base de datos:', carpeta.IdFolder);
        }));
      }
    } catch (error) {
      console.error('Error al eliminar carpetas deseleccionadas:', error.message);
    }
  };

  const enviarCarpetasSeleccionadasAlServidor = async (carpetasSeleccionadas) => {
    try {
      await axios.post(url + '/guardar-carpetas', {
        carpetasSeleccionadas,
        classifierData,
      });
      console.log('Carpetas seleccionadas enviadas al servidor:', carpetasSeleccionadas);
    } catch (error) {
      console.error('Error al enviar carpetas seleccionadas al servidor:', error.message);
    }
  };
  //

  //carpetas del navbar
  const guardarCarpetasNavbar = async () => {
    try {
      const response = await axios.get(url + '/obtener-carpetasnavbar-seleccionadas');
      const carpetasSeleccionadasBD = response.data;

      const carpetasSeleccionadasSet = new Set([...selectedNavbarFolders, ...carpetasSeleccionadasBD]);

      const carpetasSeleccionadas = Array.from(carpetasSeleccionadasSet);

      await enviarCarpetasNavbarAlServidor(carpetasSeleccionadas);

      eliminarCarpetasNavbar();
    } catch (error) {
      console.error('Error al guardar carpetas:', error);
    }
  };

  const eliminarCarpetasNavbar = async () => {
    try {
      const carpetasDeseleccionadas = selectedNavbarFolders.filter((selected) => !selected.isSelected);

      if (carpetasDeseleccionadas.length > 0) {
        console.log('Carpetas a eliminar:', carpetasDeseleccionadas);

        setSelectedFolders((prevSelected) => prevSelected.filter((selected) => !carpetasDeseleccionadas.some(c => c.IdFolder === selected.IdFolder)));

        await Promise.all(carpetasDeseleccionadas.map(async (carpeta) => {
          await axios.delete(url + `/eliminar-carpetanavbar/${carpeta.IdFolder}`);
          console.log('Carpeta eliminada de la base de datos:', carpeta.IdFolder);
        }));
      }
    } catch (error) {
      console.error('Error al eliminar carpetas deseleccionadas:', error.message);
    }
  };

  const enviarCarpetasNavbarAlServidor = async (carpetasSeleccionadas) => {
    try {
      await axios.post(url + '/guardar-carpetasnavbar', {
        carpetasSeleccionadas,
        classifierData,
      });
      console.log('Carpetas seleccionadas enviadas al servidor:', carpetasSeleccionadas);
    } catch (error) {
      console.error('Error al enviar carpetas seleccionadas al servidor:', error.message);
    }
  };

  //

  //carpetas recomendadas
  const guardarCarpetasRecomendadas = async () => {
    try {
      const response = await axios.get(url + '/obtener-carpetasrecomendadas');
      const carpetasSeleccionadasBD = response.data;

      const carpetasSeleccionadasSet = new Set([...selectedRecomendedFolders, ...carpetasSeleccionadasBD]);

      const carpetasSeleccionadas = Array.from(carpetasSeleccionadasSet);

      await enviarCarpetasRecomendadasAlServidor(carpetasSeleccionadas);

      eliminarCarpetasRecomendadas();
    } catch (error) {
      console.error('Error al guardar carpetas:', error);
    }
  };

  const eliminarCarpetasRecomendadas = async () => {
    try {
      const carpetasDeseleccionadas = selectedRecomendedFolders.filter((selected) => !selected.isSelected);

      if (carpetasDeseleccionadas.length > 0) {
        console.log('Carpetas a eliminar:', carpetasDeseleccionadas);

        setSelectedRecomendedFolders((prevSelected) => prevSelected.filter((selected) => !carpetasDeseleccionadas.some(c => c.IdFolder === selected.IdFolder)));

        await Promise.all(carpetasDeseleccionadas.map(async (carpeta) => {
          await axios.delete(url + `/eliminar-carpetacarpetasrecomendadas/${carpeta.IdFolder}`);
          console.log('Carpeta eliminada de la base de datos:', carpeta.IdFolder);
        }));
      }
    } catch (error) {
      console.error('Error al eliminar carpetas deseleccionadas:', error.message);
    }
  };

  const enviarCarpetasRecomendadasAlServidor = async (carpetasSeleccionadas) => {
    try {
      await axios.post(url + '/guardar-carpetasrecomendadas', {
        carpetasSeleccionadas,
        classifierData,
      });
      console.log('Carpetas seleccionadas enviadas al servidor:', carpetasSeleccionadas);
    } catch (error) {
      console.error('Error al enviar carpetas seleccionadas al servidor:', error.message);
    }
  };

  //

  // carpetas excluidas
  const guardarCarpetasExcluidas = async () => {
    try {
      const response = await axios.get(url + '/obtener-carpetasexcluidas');
      const carpetasSeleccionadasBD = response.data;

      const carpetasSeleccionadasSet = new Set([...excludedFolders, ...carpetasSeleccionadasBD]);

      const carpetasSeleccionadas = Array.from(carpetasSeleccionadasSet);

      await enviarCarpetasExcluidasAlServidor(carpetasSeleccionadas);

      eliminarCarpetasExcluidas();
    } catch (error) {
      console.error('Error al guardar carpetas:', error);
    }
  };

  const eliminarCarpetasExcluidas = async () => {
    try {
      const carpetasDeseleccionadas = excludedFolders.filter((selected) => !selected.isSelected);

      if (carpetasDeseleccionadas.length > 0) {
        console.log('Carpetas a eliminar:', carpetasDeseleccionadas);

        setExcludedFolders((prevSelected) => prevSelected.filter((selected) => !carpetasDeseleccionadas.some(c => c.IdFolder === selected.IdFolder)));

        await Promise.all(carpetasDeseleccionadas.map(async (carpeta) => {
          await axios.delete(url + `/eliminar-carpetasexcluidas/${carpeta.IdFolder}`);
          console.log('Carpeta eliminada de la base de datos:', carpeta.IdFolder);
        }));
      }
    } catch (error) {
      console.error('Error al eliminar carpetas deseleccionadas:', error.message);
    }
  };

  const enviarCarpetasExcluidasAlServidor = async (carpetasSeleccionadas) => {
    try {
      await axios.post(url + '/guardar-carpetasexcluidas', {
        carpetasSeleccionadas,
        classifierData,
      });
      console.log('Carpetas excluidas enviadas al servidor:', carpetasSeleccionadas);
    } catch (error) {
      console.error('Error al enviar carpetas seleccionadas al servidor:', error.message);
    }
  };

  //aca termina la logica del arbol jerarquico de carpetas
  // y empieza la logica de subida de las imagenes de categorias del slider
  const [carpetasSeleccionadas, setCarpetasSeleccionadas] = useState([]);
  useEffect(() => {
    const obtenerCarpetasDesdeBD = async () => {
      try {
        const response = await axios.get(url + '/obtener-carpetas-seleccionadas');
        setCarpetasSeleccionadas(response.data);
      } catch (error) {
        console.error('Error al obtener carpetas desde la base de datos:', error);
      }
    };

    obtenerCarpetasDesdeBD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //navbar
  const [carpetasNavbarSeleccionadas, setCarpetasNavbarSeleccionadas] = useState([]);
  useEffect(() => {
    const obtenerCarpetasNavbarDesdeBD = async () => {
      try {
        const response = await axios.get(url + '/obtener-carpetasnavbar-seleccionadas');
        setCarpetasNavbarSeleccionadas(response.data);
      } catch (error) {
        console.error('Error al obtener carpetas desde la base de datos:', error);
      }
    };

    obtenerCarpetasNavbarDesdeBD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //recomendados
  const [carpetasRecomendedSeleccionadas, setCarpetasRecomendedSeleccionadas] = useState([]);
  useEffect(() => {
    const obtenerCarpetasRecomendedDesdeBD = async () => {
      try {
        const response = await axios.get(url + '/obtener-carpetasrecomendadas');
        setCarpetasRecomendedSeleccionadas(response.data);
      } catch (error) {
        console.error('Error al obtener carpetas desde la base de datos:', error);
      }
    };

    obtenerCarpetasRecomendedDesdeBD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //excluidos
  const [carpetasExcluded, setCarpetasExcluded] = useState([]);
  useEffect(() => {
    const obtenerCarpetasExcludedDesdeBD = async () => {
      try {
        const response = await axios.get(url + '/obtener-carpetasexcluidas');
        setCarpetasExcluded(response.data);
      } catch (error) {
        console.error('Error al obtener carpetas desde la base de datos:', error);
      }
    };

    obtenerCarpetasExcludedDesdeBD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const [imagenesCategorias, setImagenesCategorias] = useState({});

  const handleCategoryImgChange = (e, IdFolder) => {
    const file = e.target.files[0];
    setImagenesCategorias((prevImages) => ({
      ...prevImages,
      [IdFolder]: file,
    }));
  };

  const handleUploadCategoryImages = async (IdFolder) => {
    try {
      const image = imagenesCategorias[IdFolder];

      if (image === null) {
        await axios.delete(url + `/eliminar-imagen/${IdFolder}`);
        console.log('Imagen eliminada con éxito.');
      } else {
        const formData = new FormData();
        formData.append('image', image);

        await axios.post(url + `/subir-imagen/${IdFolder}`, formData);

        console.log('Imagen subida con éxito.');
      }
    } catch (error) {
      console.error('Error al manejar la imagen:', error);
    }
  };

  const handleDeleteCategoryImage = async (IdFolder) => {
    try {
      setImagenesCategorias((prevImages) => ({
        ...prevImages,
        [IdFolder]: null,
      }));

      await axios.delete(url + `/eliminar-imagen/${IdFolder}`);
      console.log('Imagen eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  };

  //logica de subida de logo de la pagina
  const [imgLogo, setImgLogo] = useState(null);

  const handleLogoChanger = (e) => {
    const file = e.target.files[0];
    setImgLogo(file);
  };

  const handleUploadLogoChanger = async () => {
    try {
      const image = imgLogo;

      if (!image) {
        console.error('No se ha seleccionado ninguna imagen.');
        return;
      }

      const formData = new FormData();
      formData.append('image', image);
      const imgname = 'logo';
      await axios.post(url + `/subir-logo/${imgname}`, formData);

      console.log('Imagen subida con éxito.');

    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  const [imgAvatar, setImgAvatar] = useState(null);

  const handleAvatarChanger = (e) => {
    const file = e.target.files[0];
    setImgAvatar(file);
  };

  const handleUploadAvatarChanger = async () => {
    try {
      const image = imgAvatar;

      if (!image) {
        console.error('No se ha seleccionado ninguna imagen.');
        return;
      }

      const formData = new FormData();
      formData.append('image', image);
      const imgname = 'avatar';
      await axios.post(url + `/subir-avatar/${imgname}`, formData);

      console.log('Imagen subida con éxito.');

    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };


  //logica para subida de icono de la pagina
  const [imgIcono, setImgIcono] = useState(null);

  const handleIconoChanger = (e) => {
    const file = e.target.files[0];
    setImgIcono(file);
  };

  const handleUploadIconoChanger = async () => {
    try {
      const image = imgIcono;

      if (!image) {
        console.error('No se ha seleccionado ninguna imagen.');
        return;
      }
      const formData = new FormData();
      formData.append('image', image);

      const imgname = 'favicon';
      await axios.post(url + `/subir-icon/${imgname}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Imagen subida con éxito.');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return;
    }
  };
  const userName = localStorage.getItem('username');

  const [menuVisible, setMenuVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(true);
  const [menuWidth, setMenuWidth] = useState('82.4vw');

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setTextVisible(!textVisible);
    setMenuWidth(menuVisible ? '95.7vw' : '82.4vw');
  };

  const handleDeleteBanner = (filename) => {
    axios.delete(url + `/eliminar-img/${filename}`)
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error deleting image:', error.message);
      });
  };

  const [nombrePagina, setNombrePagina] = useState('');

  const handleNombrePaginaChange = (e) => {
    setNombrePagina(e.target.value);
  };

  const handleGuardarContenido = async () => {
    try {
      await axios.post(url + '/guardar-nombre-pagina', {
        nombrePagina,
      });
      window.location.reload();
    } catch (error) {
      console.log("error", error)
    }
  };

  // WIDGET DE WHATSAPP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [textMessage, setTextMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleWhatsappWidget = async (e) => {
    e.preventDefault();
    await axios.post(url + '/guardar-widget-whatsapp', {
      phoneNumber,
      contactName,
      textMessage,
      statusMessage,
    });
  }

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const response = await axios.get(url + '/obtener-widget-whatsapp');
        setPhoneNumber(response.data[0]?.contenido || '');
        setContactName(response.data[1]?.contenido || '');
        setTextMessage(response.data[2]?.contenido || '');
        setStatusMessage(response.data[3]?.contenido || '');
      } catch (error) {
        console.error('Error al obtener los datos del widget:', error);
      }
    };

    fetchWidgetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // widget de whatsapp

  //------------ LISTA DE PRECIOS -----------------//
  const [selectedPriceList, setSelectedPriceList] = useState('');

  const handlePriceListChange = (event) => {
    setSelectedPriceList(event.target.value);
  };

  //maneja el guardado de la lista de precios seleccionada
  const handleSavePriceList = () => {
    axios.post(url + '/guardar-contenido-listaprecios', {
      selectedPriceList: selectedPriceList,
      priceListData: priceListData,
    })
      .then((response) => {
        console.log('Datos guardados correctamente en el backend', response.data);
      })
      .catch((error) => {
        console.error('Error al guardar datos en el backend', error);
      });
  };

  //obtener el nombre de la lista de precios que se esta usando
  const [priceName, setPriceName] = useState([]);
  useEffect(() => {
    const obtenerNombrePrecios = async () => {
      try {
        const response = await axios.get(url + '/obtener-contenido-listaprecios');
        setPriceName(response.data.contenido);
        console.log("contenido priceName", response.data)
      } catch (error) {
        console.error('Error al obtener la lista de precios:', error);
      }
    };
    obtenerNombrePrecios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  //-------- LISTA DE DEPOSITOS -----------//

  const [selectedDepositoList, setSelectedDepositoList] = useState('');

  const handleDepositoListChange = (event) => {
    setSelectedDepositoList(event.target.value);
  };

  const handleSaveDepositoList = () => {
    axios.post(url + '/guardar-contenido-listadepositos', {
      selectedDepositoList: selectedDepositoList,
      depositoListData: depositoListData,
    })
      .then((response) => {
        console.log('Datos guardados correctamente en el backend', response.data);
      })
      .catch((error) => {
        console.error('Error al guardar datos en el backend', error);
      });
  };

  //obtener el nombre de la lista de depositos que se esta usando
  const [depositoName, setDepositoName] = useState([]);
  useEffect(() => {
    const obtenerNombreDepositos = async () => {
      try {
        const response = await axios.get(url + '/obtener-contenido-listadepositos');
        setDepositoName(response.data.contenido);
        console.log("contenido depositoName", response.data)
      } catch (error) {
        console.error('Error al obtener la lista de precios:', error);
      }
    };
    obtenerNombreDepositos();
  }, []);

  return (
    <>
      {isAdmin === 1 ? (
        <div className='right-admin-container' style={{ width: menuVisible ? '175px' : '5px' }}>
          {/* cuando no hay nada seleccionado se muestra esto */}
          {showToggleNoActiveSelection && (
            <>
              <div className='pre-menu-container'>
                <div className='fondo-menu-container'>
                  <img src={fondoMenu} alt='Sin fondo'></img>
                </div>

              </div>
            </>
          )}
          {/* lista de usuarios */}
          {showUserList && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='users-list'>
                  <table>
                    <thead>
                      <tr>
                        <th key="id">Id</th>
                        <th key="user">Usuario</th>
                        <th key="nombre" className="hide-column">Nombre</th>
                        <th key="apellido" className="hide-column">Apellido</th>
                        <th key="documento" className="hide-column">Documento</th>
                        <th key="email" className="hide-column">Email</th>
                        <th key="admin">Admin</th>
                        <th key="settings">Ajustes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user, index) => (
                        <>
                          <tr key={index} className='table-headers'>
                            <td key="id">{`${user.user_id}`}</td>
                            <td key="user" className="">{`${user.username}`}</td>
                            <td key="nombre" className="hide-column">{`${user.nombre ? user.nombre : "Sin nombre"}`}</td>
                            <td key="apellido" className="hide-column">{`${user.apellido ? user.apellido : "Sin apellido"}`}</td>
                            <td key="documento" className="hide-column">{`${user.documento ? user.documento : "Sin documento"}`}</td>
                            <td key="email" className="hide-column">{user.email ? user.email : "Sin correo"}</td>
                            <th key="admin" className="">{`${user.admin === 1 ? 'Sí' : 'No'}`}</th>
                            <td key="settings" className='btn-container-settings-admin'>
                              <button
                                className='asign-admin-btn'
                                onClick={() => editAdmin(user.user_id, user.admin === 0 ? 1 : 0)}
                              >
                                Asignar Admin
                              </button>

                              <button className='delete-user-btn' onClick={() => deleteUser(user.user_id)}>
                                Eliminar Usuario
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {/* Crear administrador */}
          {showUserCreatorOptions && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <form onSubmit={signupHandler} className='inAdmin-signup-in-profile'>
                  <div className="inAdmin-sign-container">
                    <div className="inAdmin-input-group">
                      <div className="welcome-message">
                        <h2>Crear cuenta de administrador</h2>
                      </div>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        className="inAdmin-input-field"
                        placeholder="Usuario"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="inAdmin-input-group">
                      <input
                        type="password"
                        id="password"
                        value={password}
                        className="inAdmin-input-field"
                        placeholder="Contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div type='submit' className="inAdmin-input-group">
                      <button className='inAdmin-button'>
                        Registrar
                      </button>
                      {errorMessage && <p>{errorMessage}</p>}
                      {isRegistered && <p>Registro exitoso</p>}
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
          {/* Restable la contraseña de cualquier usuario */}
          {showUserPasswordReset && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <form onSubmit={passResetHandler} className='inAdmin-signup-in-profile'>
                  <div className="inAdmin-sign-container">
                    <div className="inAdmin-input-group">
                      <div className="welcome-message">
                        <h2>Restablecer Contraseña</h2>
                      </div>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        className="inAdmin-input-field"
                        placeholder="Usuario"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="inAdmin-input-group">
                      <input
                        type="password"
                        id="newpassword"
                        value={password}
                        className="inAdmin-input-field"
                        placeholder="Nueva Contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="inAdmin-input-group">
                      <button type="submit" className='inAdmin-button'>
                        Restablecer Contraseña
                      </button>
                      {errorMessage && <p>{errorMessage}</p>}
                      {isReset && <p>Contraseña restablecida con exito</p>}
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
          {/* Ordenes de usuarios */}
          {showOrdersForAdmin && ordersInfo && ordersInfo.length > 0 && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <h3>Registro de pedidos realizados</h3>

                  <button onClick={handleEliminarOrdenesdePedidoDB}>
                    Eliminar todos los pedidos
                  </button>
                  {ordersInfo.map((order, index) => {
                    const isOrderCancelled = orderStatus[order.order_id];
                    return (
                      <div key={index} className="order-details">
                        <p
                          className='id-usuario-en-registro-de-pedidos-realizados'
                          onClick={() => {
                            toggleUserList();
                            getUserList();
                          }}
                          key='UserId'>
                          ID del usuario: {order.customer_id}
                        </p>
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
                                                    <div className='' key={index}>
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
              </div>
            </>
          )}
          {/* Subir imagenes de productos */}
          {showProdImgChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <h2>Artículos</h2>
                  <button onClick={() => {
                    handleEliminarArtImagesDB();
                    handleEliminarImagesArt();
                  }}>Borrar todas las imagenes</button>
                  <div className='contenedor-general'>
                    {data.map((product) => {
                      const images = getProductImages(product);
                      return (
                        <>
                          <div className="card-container">
                            <div className='card-prod'>
                              <h3>{product.Description}</h3>
                              <Slider {...settings}>
                                {images.map((image, index) => (
                                  <div className='' key={index}>
                                    <button className='erase-img-btn' onClick={() => handleDeleteImage(image)}>
                                      Eliminar Imagen
                                    </button>
                                    <img src={image} alt={`Imagen ${index + 1}`} />
                                  </div>
                                ))}
                              </Slider>
                              <div className='borde-input'>
                                <input className='input-uploader' type="file" onChange={handleFileChange} />
                              </div>
                              <button onClick={() => handleUpload(product.SKUCode)}>
                                Guardar
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Cambiar imagenes del banner */}
          {showBannerImgChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <h2>Imagenes del banner</h2>
                  <p>Lo ideal seria imagenes de 1600 pixeles de ancho y 300 de altura (1600x300)</p>

                  <div className='banner-container'>
                    <Slider {...settings} className='banner-slider'>
                      {imagePaths.map((path, index) => (
                        <div key={index}>
                          <img
                            src={`./banner_img/${path}`}
                            alt={`Imagen ${index + 1}`}
                          />
                          <button className='erase-img-btn' onClick={() => handleDeleteBanner(path)}>
                            Eliminar imagen
                          </button>
                        </div>
                      ))}
                    </Slider>
                    <div className='borde-input'>
                      <input type="file" className='input-uploader' multiple onChange={handleFileUpload} />
                      <button onClick={handleImgUpload}>Subir Imágenes</button>
                    </div>
                    <button onClick={() => {
                      handleEliminarImagesBanner();
                    }}>Borrar todas las imagenes</button>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Seleccionar categorías del slider */}
          {showClassifierChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <div className='arbol-jerarquico'>
                    <h2>Clasificador del slider</h2>

                    {classifierData
                      .filter(carpeta => carpeta.IdParent === null)
                      .map(carpeta => (
                        <Carpeta
                          key={carpeta.IdFolder}
                          carpeta={carpeta}
                          data={classifierData}
                          onFolderSelect={handleFolderSelect}
                        />
                      ))}
                  </div>
                  <button className='boton-guardar-categorias' onClick={guardarCarpetasSeleccionadas}>Guardar carpetas seleccionadas</button>
                </div>
                <div className='contenedor-right-father'>
                  <table className='categorias-upload-container'>
                    <thead>
                      <tr>
                        <th>Nombre de la Carpeta</th>
                        <th>Imagen</th>
                        <th>Previa</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carpetasSeleccionadas.map((carpeta) => (
                        <tr key={carpeta.IdFolder}>
                          <td>{carpeta.Name}</td>
                          <td>
                            <input type="file" className='input-uploader' onChange={(e) => handleCategoryImgChange(e, carpeta.IdFolder)} />
                          </td>
                          <td>
                            <div>
                              <img
                                src={`/category/${carpeta.IdFolder}.png`}
                                alt="No hay imagen"
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                              />
                            </div>
                          </td>
                          <td>
                            <button onClick={() => handleUploadCategoryImages(carpeta.IdFolder)}>Subir Imagen</button>
                            <button onClick={() => handleDeleteCategoryImage(carpeta.IdFolder)}>Eliminar Imagen</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button onClick={handleEliminarImagesCategory}>Borrar todas las imagenes</button>
                <button onClick={handleEliminarAllSliderDB}>Borrar todas las categorias</button>

              </div>
            </>
          )}
          {/* Seleccionar categorías del navbar */}
          {showNavbarClassifierChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <div className='arbol-jerarquico'>
                    <h2>Clasificador del navbar</h2>

                    {classifierData
                      .filter(carpeta => carpeta.IdParent === null)
                      .map(carpeta => (
                        <CarpetaNavbar
                          key={carpeta.IdFolder}
                          carpeta={carpeta}
                          data={classifierData}
                          onFolderSelect={handleFolderNavbarSelect}
                        />
                      ))}
                  </div>
                  <button className='boton-guardar-categorias' onClick={guardarCarpetasNavbar}>Guardar carpetas seleccionadas</button>
                </div>
                <div className='contenedor-right-father'>
                  <table className='categorias-upload-container'>
                    <thead>
                      <tr>
                        <th>Nombre de la Carpeta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carpetasNavbarSeleccionadas.map((carpeta) => (
                        <tr key={carpeta.IdFolder}>
                          <td>{carpeta.Name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button onClick={() => {
                  handleEliminarAllNavbarDB();
                }}>Borrar todas las categorias del navbar</button>

              </div>
            </>
          )}
          {/* Seleccionar categorías recomendadas */}
          {showRecomendedClassifierChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <div className='arbol-jerarquico'>
                    <h2>Clasificador de Secciones Recomendadas</h2>

                    {classifierData
                      .filter(carpeta => carpeta.IdParent === null)
                      .map(carpeta => (
                        <CarpetaRecomended
                          key={carpeta.IdFolder}
                          carpeta={carpeta}
                          data={classifierData}
                          onFolderSelect={handleFolderRecomendedSelect}
                        />
                      ))}
                  </div>
                  <button className='boton-guardar-categorias' onClick={guardarCarpetasRecomendadas}>Guardar carpetas seleccionadas</button>
                </div>
                <div className='contenedor-right-father'>
                  <table className='categorias-upload-container'>
                    <thead>
                      <tr>
                        <th>Nombre de la Carpeta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carpetasRecomendedSeleccionadas.map((carpeta) => (
                        <tr key={carpeta.IdFolder}>
                          <td>{carpeta.Name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button onClick={() => {
                  handleEliminarAllRecomendadoDB();
                }}>Borrar todas las categorias del navbar</button>

              </div>
            </>
          )}
          {/* Seleccionar categorías a excluir */}
          {showExcludedClassifier && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <div className='arbol-jerarquico'>
                    <h2>Excluir Carpeta del clasificador</h2>
                    <p>Selecciona las carpetas que desea excluir, los articulos que esten en esas carpetas no se veran en la pagina.</p>
                    {classifierData
                      .filter(carpeta => carpeta.IdParent === null)
                      .map(carpeta => (
                        <CarpetaExcluded
                          key={carpeta.IdFolder}
                          carpeta={carpeta}
                          data={classifierData}
                          onFolderSelect={handleFolderExcluded}
                        />
                      ))}
                  </div>
                  <button className='boton-guardar-categorias' onClick={guardarCarpetasExcluidas}>Guardar carpetas excluidas</button>
                </div>
                <div className='contenedor-right-father'>
                  <table className='categorias-upload-container'>
                    <thead>
                      <tr>
                        <th>Nombre de la Carpeta Excluida</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carpetasExcluded.map((carpeta) => (
                        <tr key={carpeta.IdFolder}>
                          <td>{carpeta.Name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button onClick={() => {
                  handleEliminarAllExcludedDB();
                }}>Borrar todas las categorias excluidas</button>

              </div>
            </>
          )}
          {/* Editar la pagina */}
          {showLogoChangerOptions && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>

                  <h2>Nombre de la pagina.</h2>
                  <input
                    type='text'
                    placeholder='Nombre de la pagina'
                    className="inAdmin-input-field"
                    value={nombrePagina}
                    onChange={handleNombrePaginaChange}
                  />
                  <button onClick={handleGuardarContenido}>Guardar Nombre</button>

                  <h2>Logo de la pagina.</h2>
                  <p className='prev-view-p'>Logo actual</p>
                  <div className='prev-footer-view'>
                    <div className='logo-container'>
                      <img className='navbar-logo' src={Logo} alt="Sin Imagen" />
                    </div>
                  </div>
                  <input type="file" className='input-uploader' onChange={(e) => handleLogoChanger(e)} />
                  <button onClick={handleUploadLogoChanger}>Subir Imagen</button>

                  <h2>Icono de la pagina.</h2>
                  <p>CTRL + F5 para ver los cambios realizados.</p>
                  <p className='prev-view-p'>Icono actual</p>
                  <input type="file" className='input-uploader' onChange={(e) => handleIconoChanger(e)} />
                  <button onClick={handleUploadIconoChanger}>Subir Imagen</button>


                  <h2>Lista de precios</h2>
                  <p>Selecciona la lista de precios para mostrar en la pagina.</p>
                  <p>Valor actual seleccionado: {priceName}</p>

                  <select
                    id="pricelist"
                    className="form-field"
                    name="pricelist"
                    onChange={handlePriceListChange}
                    value={selectedPriceList}
                  >
                    <option value="" disabled selected hidden>
                      Seleccionar
                    </option>

                    {priceListData.map((priceList) => (
                      <option key={priceList.Id} value={priceList.PriceListNumber}>
                        {priceList.Description}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSavePriceList}>Guardar</button>


                  <h2>Lista de depositos</h2>
                  <p>Selecciona la lista de depositos para mostrar en la pagina.</p>
                  <p>Valor actual seleccionado:<h3>{depositoName}</h3></p>

                  <select
                    id="depositolist"
                    className="form-field"
                    name="depositolist"
                    onChange={handleDepositoListChange}
                    value={selectedDepositoList}
                  >
                    <option value="" disabled selected hidden>
                      Seleccionar
                    </option>

                    {depositoListData.map((depositoList) => (
                      <option key={depositoList.Id} value={depositoList.Code}>
                        {depositoList.Description}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSaveDepositoList}>Guardar</button>

                </div>
              </div>
            </>
          )}
          {/* Editar footer */}
          {showToggleFooterChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>

                  <h2>Editor de Footer</h2>
                  <p>Texto del footer</p>
                  <div className='footer-editor'>
                    <ReactQuill
                      theme="snow"
                      value={editorHtml}
                      onChange={(value) => setEditorHtml(value)}
                      modules={{
                        toolbar: [
                          [{ 'header': [] }, { 'font': [] }],
                          [{ size: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [
                            { 'list': 'ordered' },
                            { 'list': 'bullet' },
                            { 'indent': '-1' },
                            { 'indent': '+1' },
                          ],
                          ['link', 'image', 'video'],
                          ['clean'],
                          [{
                            'color': [
                              "black",
                              "white",
                              "red",
                              "orange",
                              "blue",
                              "yellow",
                              "red",
                              "indigo",
                              "lightblue",
                              "pink",
                              "brown",
                              "green",
                              "purple",
                              "grey",
                              "silver",
                              "beige",
                              "wheat",
                              "khaki",
                              "ivory",
                              "coral",
                              "salmon",
                              "hotpink",
                              "fuchsia",
                              "lavender",
                              "plum",
                              "maroon",
                              "crimson",
                              "olive",
                              "lime",
                              "teal",
                              "royalblue",
                              "azure",
                              "cyan",
                              "aquamarine",

                              "magenta",
                            ]
                          }, { 'background': [] }],
                          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                          // [],
                        ],
                      }}
                      formats={[
                        'header', 'font', 'size', 'color',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video',
                        'align',
                      ]}
                    />
                  </div>
                  <div>
                    <div>
                      <p>Color del footer</p>
                      <ChromePicker color={backgroundColor} onChange={handleBGColorChange} />
                    </div>
                    <p className='prev-view-p'>Vista previa</p>
                    <div className='prev-footer-view'>
                      <footer className='footer' style={{ backgroundColor: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`, color: '#ffffff' }}>
                        <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
                      </footer>
                    </div>
                  </div>
                  <button onClick={handleSave}>Guardar</button>
                </div>
              </div>
            </>
          )}
          {/* personalizar widget de whatsapp */}
          {showToggleWhatsappIconChanger && (
            <>
              <div className='contextual-menu-container' style={{ width: menuWidth }}>
                <div className='contenedor-right-father'>
                  <h2>Editor de Widget</h2>
                  <form onSubmit={handleWhatsappWidget}>

                    <h3>Cambiar numero de telefono</h3>
                    <p className='help-message-p'>Asegurate de usar el <a href='https://faq.whatsapp.com/640432094208718/?locale=es_LA' rel="noreferrer" target="_blank">formato internacional</a>.</p>
                    <input type="text" className='inAdmin-input-field' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                    <h3>Nombre de contacto</h3>
                    <input type="text" className='inAdmin-input-field' value={contactName} onChange={(e) => setContactName(e.target.value)} />

                    <h3>Cambiar imagen de perfil</h3>
                    <p className='prev-view-p'>Imagen actual: </p>
                    <img className='prev-avatar' src={avatar} alt="Sin Imagen" />
                    <input type="file" className='input-uploader' onChange={(e) => handleAvatarChanger(e)} />
                    <button onClick={handleUploadAvatarChanger}>Subir Imagen</button>

                    <h3>Cambiar texto de mensaje</h3>
                    <input type="text" className='inAdmin-input-field-resize' value={textMessage} onChange={(e) => setTextMessage(e.target.value)} />

                    <h3>Cambiar Estado de WhatsApp</h3>
                    <input type="text" className='inAdmin-input-field' value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} />

                    <button type="submit">Guardar</button>
                  </form>
                  <Whatsapp />
                </div>
              </div>
            </>
          )}
          {/* aca termina los botones del menu izquierdo */}

          {/* boton de despliegue del menu izquierdo */}
          <div className='top-user-admin-container' style={{ width: menuVisible ? '200px' : '30px' }}>
            <button className='toggle-button' onClick={toggleMenu}>
              <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            {textVisible && (
              <a href='/' className='link-para-volver'>
                <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </a>
            )}
          </div>
          <div className='bottom-user-admin-container' style={{ width: menuVisible ? '200px' : '30px' }}>
            <div className=''>
              {textVisible && (
                <>
                  <div className=''>
                    <p className=''>{userName}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Menu desplegable izquierdo */}
          <div className='padre-left-admin-container'>
            <div className='left-admin-container' style={{ width: menuVisible ? '200px' : '30px' }}>
              <>
                {textVisible && (
                  <h2>Herramientas</h2>
                )}
                {/* Lista de usuarios */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={() => {
                  toggleUserList();
                  getUserList();
                }}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  {textVisible && (
                    <p>Lista de usuarios</p>
                  )}
                </button>
                {/* Crear administrador */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleUserCreatorOptions}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                  {textVisible && (
                    <p>Crear administrador</p>
                  )}
                </button>
                {/* Restable contraseñas de usuarios */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={togglePasswordResetOptions}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  {textVisible && (
                    <p>Restable contraseñas de usuarios</p>
                  )}
                </button>
                {/* ordenes de usuarios */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={() => {
                  handleOrdersForAdmin();
                  toggleOrdersForAdmin();
                }}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  {textVisible && (
                    <p>Ordenes de usuarios</p>
                  )}
                </button>
                {/* Subir imagenes de productos */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleProdImgChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {textVisible && (
                    <p>Subir imagenes de productos</p>
                  )}
                </button>
                {/* cambiar imagenes del banner */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleBannerImgChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {textVisible && (
                    <p>Cambiar imagenes del banner</p>
                  )}
                </button>
                {/* Seleccionar categorías del slider */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleClassifierChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  {textVisible && (
                    <p>Seleccionar categorías del slider</p>
                  )}
                </button>
                {/* Seleccionar categorías del navbar */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleNavBarClassifierChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  {textVisible && (
                    <p>Seleccionar categorías del navbar</p>
                  )}
                </button>
                {/* Seleccionar categorías recomendadas */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleRecomendedClassifierChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  {textVisible && (
                    <p>Seleccionar categorías del inicio</p>
                  )}
                </button>
                {/* Excluir categorías */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleExcluderClassifier}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  {textVisible && (
                    <p>Seleccionar categorías a excluir</p>
                  )}
                </button>
                {/* Editar pagina */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleLogoChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {textVisible && (
                    <p>Editar pagina</p>
                  )}
                </button>
                {/* Editar footer */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleFooterChanger}>
                  <svg width='25' height='25' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  {textVisible && (
                    <p>Editar footer</p>
                  )}
                </button>
                {/* Editar widget whatsapp */}
                <button className='boton-de-lista-izquierda' style={{ marginTop: menuVisible ? '0' : '20px' }} onClick={toggleWhatsappIconChanger}>
                  <svg width='30' height='30' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0,0,256,256">
                    <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none"><g transform="scale(5.12,5.12)"><path d="M25,2c-12.69047,0 -23,10.30953 -23,23c0,4.0791 1.11869,7.88588 2.98438,11.20898l-2.94727,10.52148c-0.09582,0.34262 -0.00241,0.71035 0.24531,0.96571c0.24772,0.25536 0.61244,0.35989 0.95781,0.27452l10.9707,-2.71875c3.22369,1.72098 6.88165,2.74805 10.78906,2.74805c12.69047,0 23,-10.30953 23,-23c0,-12.69047 -10.30953,-23 -23,-23zM25,4c11.60953,0 21,9.39047 21,21c0,11.60953 -9.39047,21 -21,21c-3.72198,0 -7.20788,-0.97037 -10.23828,-2.66602c-0.22164,-0.12385 -0.48208,-0.15876 -0.72852,-0.09766l-9.60742,2.38086l2.57617,-9.19141c0.07449,-0.26248 0.03851,-0.54399 -0.09961,-0.7793c-1.84166,-3.12289 -2.90234,-6.75638 -2.90234,-10.64648c0,-11.60953 9.39047,-21 21,-21zM16.64258,13c-0.64104,0 -1.55653,0.23849 -2.30859,1.04883c-0.45172,0.48672 -2.33398,2.32068 -2.33398,5.54492c0,3.36152 2.33139,6.2621 2.61328,6.63477h0.00195v0.00195c-0.02674,-0.03514 0.3578,0.52172 0.87109,1.18945c0.5133,0.66773 1.23108,1.54472 2.13281,2.49414c1.80347,1.89885 4.33914,4.09336 7.48633,5.43555c1.44932,0.61717 2.59271,0.98981 3.45898,1.26172c1.60539,0.5041 3.06762,0.42747 4.16602,0.26563c0.82216,-0.12108 1.72641,-0.51584 2.62109,-1.08203c0.89469,-0.56619 1.77153,-1.2702 2.1582,-2.33984c0.27701,-0.76683 0.41783,-1.47548 0.46875,-2.05859c0.02546,-0.29156 0.02869,-0.54888 0.00977,-0.78711c-0.01897,-0.23823 0.0013,-0.42071 -0.2207,-0.78516c-0.46557,-0.76441 -0.99283,-0.78437 -1.54297,-1.05664c-0.30567,-0.15128 -1.17595,-0.57625 -2.04883,-0.99219c-0.8719,-0.41547 -1.62686,-0.78344 -2.0918,-0.94922c-0.29375,-0.10568 -0.65243,-0.25782 -1.16992,-0.19922c-0.51749,0.0586 -1.0286,0.43198 -1.32617,0.87305c-0.28205,0.41807 -1.4175,1.75835 -1.76367,2.15234c-0.0046,-0.0028 0.02544,0.01104 -0.11133,-0.05664c-0.42813,-0.21189 -0.95173,-0.39205 -1.72656,-0.80078c-0.77483,-0.40873 -1.74407,-1.01229 -2.80469,-1.94727v-0.00195c-1.57861,-1.38975 -2.68437,-3.1346 -3.0332,-3.7207c0.0235,-0.02796 -0.00279,0.0059 0.04687,-0.04297l0.00195,-0.00195c0.35652,-0.35115 0.67247,-0.77056 0.93945,-1.07812c0.37854,-0.43609 0.54559,-0.82052 0.72656,-1.17969c0.36067,-0.71583 0.15985,-1.50352 -0.04883,-1.91797v-0.00195c0.01441,0.02867 -0.11288,-0.25219 -0.25,-0.57617c-0.13751,-0.32491 -0.31279,-0.74613 -0.5,-1.19531c-0.37442,-0.89836 -0.79243,-1.90595 -1.04102,-2.49609v-0.00195c-0.29285,-0.69513 -0.68904,-1.1959 -1.20703,-1.4375c-0.51799,-0.2416 -0.97563,-0.17291 -0.99414,-0.17383h-0.00195c-0.36964,-0.01705 -0.77527,-0.02148 -1.17773,-0.02148zM16.64258,15c0.38554,0 0.76564,0.0047 1.08398,0.01953c0.32749,0.01632 0.30712,0.01766 0.24414,-0.01172c-0.06399,-0.02984 0.02283,-0.03953 0.20898,0.40234c0.24341,0.57785 0.66348,1.58909 1.03906,2.49023c0.18779,0.45057 0.36354,0.87343 0.50391,1.20508c0.14036,0.33165 0.21642,0.51683 0.30469,0.69336v0.00195l0.00195,0.00195c0.08654,0.17075 0.07889,0.06143 0.04883,0.12109c-0.21103,0.41883 -0.23966,0.52166 -0.45312,0.76758c-0.32502,0.37443 -0.65655,0.792 -0.83203,0.96484c-0.15353,0.15082 -0.43055,0.38578 -0.60352,0.8457c-0.17323,0.46063 -0.09238,1.09262 0.18555,1.56445c0.37003,0.62819 1.58941,2.6129 3.48438,4.28125c1.19338,1.05202 2.30519,1.74828 3.19336,2.2168c0.88817,0.46852 1.61157,0.74215 1.77344,0.82227c0.38438,0.19023 0.80448,0.33795 1.29297,0.2793c0.48849,-0.05865 0.90964,-0.35504 1.17773,-0.6582l0.00195,-0.00195c0.3568,-0.40451 1.41702,-1.61513 1.92578,-2.36133c0.02156,0.0076 0.0145,0.0017 0.18359,0.0625v0.00195h0.00195c0.0772,0.02749 1.04413,0.46028 1.90625,0.87109c0.86212,0.41081 1.73716,0.8378 2.02148,0.97852c0.41033,0.20308 0.60422,0.33529 0.6543,0.33594c0.00338,0.08798 0.0068,0.18333 -0.00586,0.32813c-0.03507,0.40164 -0.14243,0.95757 -0.35742,1.55273c-0.10532,0.29136 -0.65389,0.89227 -1.3457,1.33008c-0.69181,0.43781 -1.53386,0.74705 -1.8457,0.79297c-0.9376,0.13815 -2.05083,0.18859 -3.27344,-0.19531c-0.84773,-0.26609 -1.90476,-0.61053 -3.27344,-1.19336c-2.77581,-1.18381 -5.13503,-3.19825 -6.82031,-4.97266c-0.84264,-0.8872 -1.51775,-1.71309 -1.99805,-2.33789c-0.4794,-0.62364 -0.68874,-0.94816 -0.86328,-1.17773l-0.00195,-0.00195c-0.30983,-0.40973 -2.20703,-3.04868 -2.20703,-5.42578c0,-2.51576 1.1685,-3.50231 1.80078,-4.18359c0.33194,-0.35766 0.69484,-0.41016 0.8418,-0.41016z"></path></g></g>
                  </svg>
                  {textVisible && (
                    <p>Editar Widget de Whatsapp</p>
                  )}
                </button>
              </>
            </div>
          </div>
        </div>
      ) : (
        <div className='settings-container'>
          <h1 className='bad-request-message'>
            Necesitas ser administrador para poder acceder aca.
          </h1>
          <a href='/'>Volver</a>
        </div>
      )}
    </>
  );
}

export default Admin;