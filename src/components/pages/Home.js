import {useState, useEffect} from "react";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import SearchInput from "../SearchInput";
import { CategoryData } from "../CategoryData";
import Footer from "../Footer";

const Home = () => {
  const [matches, setMatches] = useState(
    window.matchMedia('(min-width: 980px)').matches
  )

  useEffect(() => {
    window.matchMedia('(min-width: 980px)')
    .addEventListener('change', e => setMatches( e.matches ))
  }, [])
  return (
    <section className="flex">
      {matches && <Sidebar />}
      <div className="flex-[6] bg-home">
        <div className="mt-16">
          <p className="px-4 mb-3 text-xl font-semibold">
            Buying and selling used products within your institution made
            easier.
          </p>
          <div className="px-4">
            <form>
              <SearchInput placeholder="search institution" />
            </form>
          </div>
          <div className="px-4">
            <h1 className="mb-3 mt-5 font-bold text-2xl">
              Some of the featured products
            </h1>
            <div className="flex flex-wrap -m-4">
              {CategoryData.map((list) => (
                <div key={list.id} className="px-4 pt-2 md:w-1/3">
                  <div className="h-full bg-gray-600 overflow-hidden rounded-lg shadow-2xl">
                    <img src={list.src} alt={list.src} />
                    <h1 className="text-center capitalize font-semibold text-xl py-2">
                      {list.name}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 px-4">
            <h1 className="font-bold text-2xl">
              Let's help you make your products get easier to sell
            </h1>
            <div className="grid gap-8 row-gap-5 md:row-gap-8 lg:grid-cols-3 mt-3">
              <div className="p-5 duration-300 transform bg-white rounded shadow-2xl hover:translate-y-2">
                <div className="flex items-center mb-2">
                  <p className="flex items-center justify-center w-10 mr-2 text-lg font-bold text-white rounded-full bg-primaryBackground">
                    1
                  </p>
                  <p className="text-lg font-bold leading-5">Sign up</p>
                </div>
                <p className="text-lg text-gray-900">
                  To get start, kindly fill up the registration form.
                </p>
              </div>
              <div className="p-5 duration-300 transform bg-white rounded shadow-2xl hover:translate-y-2">
                <div className="flex items-center mb-2">
                  <p className="flex items-center justify-center w-10 mr-2 text-lg font-bold text-white rounded-full bg-primaryBackground">
                    2
                  </p>
                  <p className="text-lg font-bold leading-5">Sell it</p>
                </div>
                <p className="text-lg text-gray-900">
                  Fill in your product details to list your item for sale.
                </p>
              </div>
              <div className="p-5 duration-300 transform bg-white rounded shadow-2xl hover:translate-y-2">
                <div className="flex items-center mb-2">
                  <p className="flex items-center justify-center w-10 mr-2 text-lg font-bold text-white rounded-full bg-primaryBackground">
                    3
                  </p>
                  <p className="text-lg font-bold leading-5">Cash out</p>
                </div>
                <p className="text-lg text-gray-900">
                  Meet with your interested buyer and cashout.
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default Home;
