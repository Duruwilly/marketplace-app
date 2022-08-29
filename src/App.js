import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import InstitutionSearch from './pages/InstitutionSearch';
import Sidebar from './components/Sidebar';
import SellItem from './pages/SellItem';
import Logo from "./assets/logo-plain2-1.png";
import Listings from './pages/Listings';
import Myproduct from './pages/MyProduct';

function App() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false)
  }, 2500);

  useEffect(() => {
    window
      .matchMedia("(min-width: 980px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  if (loading) return <div className='bg-primaryBackground h-screen w-full flex justify-center items-center px-4'><img src={Logo} alt="logo" className="h-16" /></div>;
  return (
    <>
      <BrowserRouter>
      <div className='flex'>
      {matches && <Sidebar />}
      <div className='flex-[6]'>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/institution/:institutionName' element={<InstitutionSearch />} />
          <Route path='/institution/:institutionName/:productName/:productId' element={<Listings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/sell" element={<SellItem />} />
          <Route path="/my-product" element={<Myproduct />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
        </div>
        { !matches &&
        <Navbar />
        }
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
