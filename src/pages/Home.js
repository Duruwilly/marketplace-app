import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryData } from "../components/HomeProductData";
import Footer from "../components/Footer";
import Logo from "../assets/logo-plain2-1.png";
import { HiSearch } from "react-icons/hi";

const Home = () => {
  const [queryName, setqueryName] = useState("");

  const onChange = (e) => {
    setqueryName(e.target.value);
  };

  let queryNameCase = queryName.toLowerCase();

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 980px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const navigate = useNavigate();

  const querySearch = (e) => {
    e.preventDefault();
    navigate(`/institution/${queryNameCase}`, {state:{ queryName}});
  };

  return (
    <section>
      <div>
        {!matches && (
          <header className="bg-primaryBackground flex justify-center px-4">
            <Link to="/" className="mx-0 mb-6">
              <img src={Logo} alt="logo" className="h-16 mt-6" />
            </Link>
          </header>
        )}
        <div className="px-4 bg-primaryBackground h-20 sticky top-0 z-20 w-full pt-2">
          <form onSubmit={querySearch}>
            <div className="flex gap-5 w-full items-center shadow-2xl text-xl">
              <HiSearch className="absolute ml-3 text-gray-400" />
              <input
                required
                type="text"
                value={queryName}
                onChange={onChange}
                placeholder="type institution or product name"
                className="w-full py-3 pl-10 border-2 block shadow focus:outline-none text-gray-700 text-lg font-medium caret-purple-900"
              />
            </div>
          </form>
        </div>
        <div className="bg-primaryBackground py-16 px-4 lg:py-20 text-center mb-16">
          <div>
            <h2 className="mb-5 max-w-lg font-sans text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:mx-auto text-center">
              The marketplace for students
            </h2>
            <p className="text-base text-indigo-100 md:text-lg">
              Buying and selling products from friends within your institution
              made easier
            </p>
          </div>
        </div>
        <div className="px-4">
          <h1 className="mb-4 mt-5 text-3xl font-extrabold tracking-tight text-gray-900">
            Top Categories
          </h1>
          <div className="flex flex-wrap -m-4">
            {CategoryData.map((list) => (
              <div key={list.id} className="px-4 pt-2 md:w-1/3">
                <Link to={`/categories${list.path}`}>
                  <div className="h-full bg-black overflow-hidden rounded-lg shadow-2xl">
                    <img src={list.src} alt={list.src} />
                    <h1 className="text-center capitalize font-semibold text-xl py-2 text-white">
                      {list.name}
                    </h1>
                  </div>
                </Link>
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
                <p className="flex items-center justify-center w-10 h-10 mr-2 text-lg font-bold text-white rounded-full bg-primaryBackground">
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
                <p className="flex items-center justify-center w-10 h-10 mr-2 text-lg font-bold text-white rounded-full bg-primaryBackground">
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
                <p className="flex items-center justify-center w-10 h-10 mr-2 text-lg font-bold text-white rounded-full bg-primaryBackground">
                  3
                </p>
                <p className="text-lg font-bold leading-5">Cash out</p>
              </div>
              <p className="text-lg text-gray-900">
                Meet with your interested buyer and take your cash.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default Home;
