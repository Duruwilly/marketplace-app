import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {db} from '../../firebase.config'
import Spinner from '../Spinner'
import {FiShare} from 'react-icons/fi'
import Logo from "../../assets/logo-plain2-1.png";

const Listings = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgSrc, setimgSrc] = useState("");

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "listings", params.productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        console.log(docSnap.data());
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
  
  /* useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.productId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.productId]) */

  if(loading || listing.length === 0) return <Spinner description='loading...' />
  return (
    <section>
      <header className="bg-primaryBackground flex justify-center px-4 sticky">
        <Link to="/" className="mx-0 mb-6">
          <img src={Logo} alt="logo" className="h-16 mt-6" />
        </Link>
      </header>
      <main className="">
        {/* Slider */}
        <div className="px-4 mt-6">
          <div className="lg:w-4/5 mx-auto relative">
            <div className="flex justify-between gap-5 text-gray-300 font-semibold">
              <a
                href={`tel:${listing.mobileNumber}`}
                className="bg-primaryBackground w-full text-center rounded-full py-3"
              >
                Chat
              </a>
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
                  {listing.brand ? 'brand' : ""}
                </p>
                <p className="text-base">{listing?.brand}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.name ? 'name' : ""}
                </p>
                <p className="text-base">{listing?.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.model ? 'model' : ""}
                </p>
                <p className="text-base">{listing?.model}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">condition</p>
                <p className="text-base">{listing.condition}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.os ? 'os' : ""}
                </p>
                <p className="text-base">{listing?.os}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.ram ? 'ram' : ""}
                </p>
                <p className="text-base">{listing?.ram}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.rom ? 'rom' : ""}
                </p>
                <p className="text-base">{listing?.rom}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold capitalize">
                  {listing.processor ? 'processor' : ""}
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
            <div className='bg-white shadow w-full py-1 text-center mt-3'>
              <p>{listing.description}</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Listings