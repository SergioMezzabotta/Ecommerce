import Home from './components/Home/Home';
import CartContent from './components/CartContent/CartContent';
import DataProvider from './components/Context/DataContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/User/SignIn';
import SignUp from './components/User/SignUp';
import Profile from './components/User/Profile';
import Admin from './components/User/Admin';
import PassReset from './components/User/PassReset';
import Help from './components/Help/Help';
import Categorias from './components/Category/CategorySlider';
import CategoriaDetalle from './components/Category/CategoryDetail';
import ProductoDetalle from './components/Products/ProductsDetails';
import SearchResults from './components/Navbar/SearchResults';
import Checkout from './components/CartContent/Checkout';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<CartContent />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/pass_reset' element={<PassReset />} />
          <Route path='/ayuda' element={<Help />} />
          <Route path='/categorias' element={<Categorias />} />
          <Route path='/categorias/:idCategoria' element={<CategoriaDetalle />} />
          <Route path='/producto/:id' element={<ProductoDetalle />} />
          <Route path='/results/:searchTerm' element={<SearchResults />} />
          <Route path='/checkout' element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;