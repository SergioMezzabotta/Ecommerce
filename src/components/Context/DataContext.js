import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const dataContext = createContext();

const DataProvider = ({ children }) => {
  const url = process.env.REACT_APP_BACK_URL;
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  // ---------------------------------------------------------------------- //
  const urlProduct = serverUrl + "/Product?pageSize=500&onlyEnabled=true";

  const urlClassifier = serverUrl + "/ProductsFolderClassifier?pageSize=500";

  const depositoList = serverUrl + "/Warehouse?pageSize=500";
  // ---------------------------------------------------------------------- //

  const [depositoListCode, setDepositoListCode] = useState(null);
  useEffect(() => {
    const obtenerListaDepositos = async () => {
      try {
        const response = await axios.get(url + '/obtener-contenido-listadepositos');
        if (response.data.length > 0) {
          const numeroIdentificacion = parseInt(response.data[0].numero_identificacion, 10);
          setDepositoListCode(numeroIdentificacion);
        } else {
          console.warn('La lista de depósitos está vacía.');
        }
      } catch (error) {
        console.error('Error al obtener la lista de precios:', error);
      }
    };
  
    obtenerListaDepositos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const [provinceNumber, setProvinceNumber] = useState(null);

    //---------- Carpetas excluidas ----------//

  const obtenerCarpetasExcluidas = async () => {
    try {
      const response = await axios.get(url + '/obtener-carpetasexcluidas');
      const carpetasSeleccionadas = response.data;
  
      if (Array.isArray(carpetasSeleccionadas)) {
        const getProductPromises = carpetasSeleccionadas.map(async (carpeta) => {
          const filterValue = carpeta.IdFolder;
          const encodedFilter = encodeURIComponent(filterValue);
          const productResponse = await axios.get(`${serverUrl}/ProductsFolder?pageSize=500&filter=${encodedFilter}`);
          return productResponse.data.Data;
        });
  
        const productDataArray = await Promise.all(getProductPromises);
  
        const productsData = productDataArray.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);
  
        return productsData;
      } else {
        console.error('La respuesta de obtener-carpetasexcluidas no es un array:', carpetasSeleccionadas);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener carpetas seleccionadas o productos:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    obtenerCarpetasExcluidas()
      .then((excludedProducts) => {
      })
      .catch((error) => {
        console.error('Error al obtener carpetas seleccionadas o productos:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  //---------- PRODUCT DATA PRICE ETC ----------//

  const fetchInfo = async () => {
    try {
      const priceListResponse = await axios.get(url + '/obtener-contenido-listaprecios');
      if (priceListResponse.data.length > 0) {
        const selectedPriceListCode = parseInt(priceListResponse.data[0].numero_identificacion, 10);
  
        const productsResponse = await axios.get(urlProduct);
        const productsData = [...productsResponse.data.Data];
  
        const pricesResponse = await axios.get(`${serverUrl}/Price?pageSize=500&filter=${selectedPriceListCode}`);
        const pricesData = [...pricesResponse.data.Data];
  
        const excludedProducts = await obtenerCarpetasExcluidas();
  
        if (Array.isArray(excludedProducts)) {
          const excludedSkuCodes = excludedProducts.map(product => product.SkuCode);
  
          const filteredProducts = productsData
            .filter(product => !excludedSkuCodes.includes(product.SKUCode))
            .map(product => {
              const matchingPrice = pricesData.find(price => product.SKUCode === price.SKUCode);
  
              if (matchingPrice && matchingPrice.Price > 0) {
                return {
                  ...product,
                  Price: matchingPrice.Price,
                };
              }
  
              return null;
            })
            .filter(Boolean);
  
          setData(filteredProducts);
        } else {
          console.error('Error al obtener carpetas seleccionadas o productos: obtenerCarpetasExcluidas no devolvió un array');
        }
      } else {
        console.warn('La lista de precios está vacía.');
      }
    } catch (error) {
      console.error('Error fetching products and prices:', error);
    }
  };
  
  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  //---------- Classifier ----------//

  const [classifierData, setClassifierData] = useState([]);

                        //cambiar este axios por uno de la base de datos
  // useEffect(() => {
  //   const fetchClassifier = async () => {
  //     try {
  //       const accessToken = process.env.;
  //       axios.defaults.headers.common['AccessToken'] = accessToken;

  //       const response = await axios.get(urlClassifier);
  //       setClassifierData(response.data.Data);
  //     } catch (error) {
  //       console.error("Error fetching classifier data:", error);
  //     }
  //   };

  //   fetchClassifier();
  // }, [urlClassifier]);

  //---------- Deposito STOCK ----------//
  const [stockData, setStockData] = useState({});

    //cambiar este fetch por uno a la base de datos
  // useEffect(() => {
  //   const fetchStock = async () => {
  //     try {
  //       if (depositoListCode !== null) {
  //         const accessToken = process.env.;
  //         axios.defaults.headers.common['AccessToken'] = accessToken;
  
  //         const response = await axios.get(`${serverUrl}/Stock?pageSize=500&WarehouseCode=${depositoListCode}`);
  //         const updatedStockData = {};
  
  //         response.data.Data.forEach(item => {
  //           updatedStockData[item.SKUCode] = item;
  //         });
  
  //         setStockData(updatedStockData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching stock data:", error);
  //     }
  //   };
  
  //   fetchStock();
  // }, [serverUrl, depositoListCode]);

  //---------- SAVED CART ----------//
// cambiar este fetch por uno de la base de datos
  // useEffect(() => {
  //   const accessToken = process.env.;
  //   axios.defaults.headers.common['AccessToken'] = accessToken;

  //   const savedCart = localStorage.getItem('cart');
  //   if (savedCart && JSON.parse(savedCart).length > 0) {
  //     setCart(JSON.parse(savedCart));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('cart', JSON.stringify(cart));
  // }, [cart]);

  //---------- REMOVE FROM CART ----------//

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((product) => product.Id !== productId);
    setCart(updatedCart);
  };

  //---------- Price List ----------//

  const [priceListData, setPriceListData] = useState({});

  // //cambiar este fetch por uno a la base de datos
  // useEffect(() => {
  //   const fetchPriceList = async () => {
  //     try {
  //       const accessToken = process.env.;
  //       axios.defaults.headers.common['AccessToken'] = accessToken;
  
  //       const response = await axios.get(`${serverUrl}/PriceList?pageSize=500`);
  //       setPriceListData(response.data.Data);
  //     } catch (error) {
  //       console.error("Error fetching price list data:", error);
  //     }
  //   };
  
  //   fetchPriceList();
  // }, [serverUrl]);
  
  //---------- Deposito stock List ----------//

  const [depositoListData, setDepositoListData] = useState([]);
//cambiar este useeffect por uno a la base de datos
  // useEffect(() => {
  //   const fetchDepositoList = async () => {
  //     try {
  //       const accessToken = process.env.;
  //       axios.defaults.headers.common['AccessToken'] = accessToken;

  //       const response = await axios.get(depositoList);

  //       const modifiedData = response.data.Data.map(item => ({
  //         ...item,
  //         Code: parseInt(item.Code, 10),
  //       }));

  //       setDepositoListData(modifiedData);
  //     } catch (error) {
  //       console.error("Error fetching stock data:", error);
  //     }
  //   };

  //   fetchDepositoList();
  // }, [depositoList]);



  return <dataContext.Provider value={
    {
      provinceNumber,
      setProvinceNumber,
      removeFromCart,
      data,
      cart,
      setCart,
      clearCart,
      classifierData,
      stockData,
      priceListData,
      depositoListData,
    }}>
    {children}
  </dataContext.Provider>;
};

export default DataProvider;