import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Navbar, PrivateRoute, Sidebar } from './components'
import {
  ForgotPassword,
  Home,
  Login,
  Register,
  Profile,
  QuerySearch,
  SellItem,
  SingleListings,
  MyProduct,
  FavouriteList,
  FavouriteSingleList,
  Trending,
  Categories,
  Notification
} from "./pages";

import Logo from "./assets/logo-plain2-1.png";

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
        <div className="flex">
          {matches && <Sidebar />}
          <div className="flex-[6]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/institution/:queryName"
                element={<QuerySearch />}
              />
              <Route
                path="/institution/:institutionName/:productName/:productId"
                element={<SingleListings />}
              />
                <Route path="/favourites" element={<FavouriteList />} />
              <Route
                path="/favourites/:institutionName/:productName/:productId"
                element={<FavouriteSingleList />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/sell" element={<SellItem />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/categories/:categoriesName" element={<Categories />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/my-product" element={<MyProduct />} />
              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path='*' element={ <main className='p-4 font-semibold text-gray-800 mt-36'>
                <p>sorry you seems to have entered an invalid url</p>
              </main> } />
            </Routes>
          </div>
        </div>
        {!matches && <Navbar />}
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
