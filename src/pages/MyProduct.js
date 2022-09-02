import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo-plain2-1.png";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  where,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import MyProductListings from "../components/MyProductListings";
const Myproduct = () => {
  const [myProducts, setMyProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  
  const handleDelete = async (listingId) => {
   if(window.confirm('Are you sure you want to delete?')) {
    await deleteDoc(doc(db, 'listings', listingId))
    const updatedListings = myProducts.filter((product) => product.id !== listingId)
    setMyProducts(updatedListings)
    toast.success('successfully deleted listing')
   }
  }
  
  useEffect(() => {
   const fetchUserListings = async () => {
    const listingsRef = collection(db, 'listings')

    const q = query(
     listingsRef, where('userRef', "==", auth.currentUser.uid),
     orderBy('timestamp', 'desc')
    )

    const querySnap = await getDocs(q)

    const listings = []

    querySnap.forEach((doc) => {
     return listings.push({
      id: doc.id,
      data: doc.data()
     })
    })

    setMyProducts(listings)
    setLoading(false)
   }
   fetchUserListings()
  }, [auth.currentUser.uid])

  if (loading) return <Spinner description='loading...' />
  return (
    <>
      {myProducts?.length > 0 ? (
        <div>
          <header className="bg-primaryBackground flex justify-center px-4 sticky top-0 z-20">
            <Link to="/" className="mx-0 mb-6">
              <img src={Logo} alt="logo" className="h-16 mt-6" />
            </Link>
          </header>
          <div className="mx-auto pb-24 px-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mt-5">
              My products
            </h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {myProducts.map((listing) => (
                <MyProductListings
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  handleDelete={() => handleDelete(listing.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-24 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 m-auto">
            You've No products for sale.
          </h2>
        </div>
      )}
    </>
  );
 }

export default Myproduct;
