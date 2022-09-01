import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import Logo from "../assets/logo-plain2-1.png";

const FavouriteSingleList = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setimgSrc] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "favourites", params.productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        setListing(docSnap.data());
      } else {
        navigate("/");
      }
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.productId]);

  if (loading || listing.length === 0)
    return <Spinner description="loading..." />;
  return (
    <section>
      <header className="bg-primaryBackground flex justify-center px-4 sticky top-0 z-20">
        <Link to="/" className="mx-0 mb-6">
          <img src={Logo} alt="logo" className="h-16 mt-6" />
        </Link>
      </header>
      <main>
        <div className="px-4 mt-6 lg:pb-20 sm:pb-24 pb-24 md:pb-24 container mx-auto">
          <div className="lg:w-4/5 mx-auto relative">
            {imgSrc === "" ? (
              <img
                src={listing.imgUrls[0]}
                alt={listing.model || listing.name}
                className="lg:w-full w-full lg:h-80 h-auto object-contain object-center rounded"
              />
            ) : (
              <img
                src={imgSrc}
                alt={listing.model || listing.name}
                className="lg:w-full w-full lg:h-80 h-auto object-contain object-center rounded"
              />
            )}
            <div className="container grid gap-1 ml-auto grid-cols-5 mx-auto mt-2 justify-center items-center">
              {listing.imgUrls.map((img, index) => (
                <span key={index} className="rounded mx-auto">
                  <img
                    src={img}
                    alt={listing.model || listing.name}
                    className={
                      imgSrc === img
                        ? "h-16 w-16 object-contain object-center rounded border border-purple-900 bg-purple-100 p-1 cursor-pointer"
                        : "h-16 w-16 object-contain object-center cursor-pointer"
                    }
                    onClick={() => {
                      setimgSrc(img);
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="text-white absolute m-auto px-1 top-0 bg-opacity-40 text-opacity-80 bg-white rounded-lg">
              <p>WILLTTA</p>
            </div>
            <div className="grid grid-cols-2 gap-5 text-gray-300 font-semibold mt-2">
              <Link to='/notification'
                className="bg-primaryBackground w-full text-center rounded-full py-3"
              >
                Chat
              </Link>
              <a
                href={`tel:${listing.mobileNumber}`}
                className="bg-primaryBackground w-full text-center rounded-full py-3"
              >
                Call
              </a>
            </div>
            <div className="mt-2 text-gray-800 space-y-2">
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.brand ? "brand" : ""}
                </p>
                <p className="text-base">{listing?.brand}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.name ? "name" : ""}
                </p>
                <p className="text-base">{listing?.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.model ? "model" : ""}
                </p>
                <p className="text-base">{listing?.model}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">condition</p>
                <p className="text-base">{listing.condition}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.os ? "os" : ""}
                </p>
                <p className="text-base">{listing?.os}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.ram ? "ram" : ""}
                </p>
                <p className="text-base">{listing?.ram}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.rom ? "rom" : ""}
                </p>
                <p className="text-base">{listing?.rom}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.processor ? "processor" : ""}
                </p>
                <p className="text-base">{listing?.processor}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">price</p>
                <p className="text-base">
                  ₦
                  {[listing.price]
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">institution</p>
                <p className="text-base">{listing.institution}</p>
              </div>
            </div>
            <div className="bg-white shadow w-full py-1 text-center mt-3">
              <p>{listing.description}</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default FavouriteSingleList;
