import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import {db} from '../../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../Spinner'
import InstitutionListItem from './InstitutionListItem'
import { HiSearch } from 'react-icons/hi'

const InstitutionSearch = () => {
const [listings, setListings] = useState(null);
const [loading, setLoading] = useState(true);
const [product, setProduct] = useState("");

const params = useParams();

useEffect(() => {
  const fetchListings = async () => {
    // Get reference
    const listingsRef = collection(db, "listings");

    // create a query
    const q = query(
      listingsRef,
      where("institutionCase", "==", params.institutionName),
      orderBy("timestamp", "desc"),
      limit(12)
    );

    // Execute query
    const querySnap = await getDocs(q);

    let listings = [];

    querySnap.forEach((doc) => {
      return listings.push({
       id: doc.id,
       data: doc.data()
      })
    });
    setListings(listings);
    setLoading(false);
  };
  fetchListings();
}, [params.InstitutionName]);

const navigate = useNavigate();

const productSearch = (e) => {
  e.preventDefault();
  navigate(`/institution/${params.institutionName}/${product}`);
};

const onChange = (e) => {
  setProduct(e.target.value)
 }

 return (
   <>
     {loading ? (
       <Spinner description="loading..." />
     ) : listings && listings.length > 0 ? (
       <div>
         <header className="px-4 bg-primaryBackground h-20 sticky top-0 z-20 w-full pt-2">
           <form onSubmit={productSearch}>
             <div className="flex gap-5 w-full items-center shadow-2xl text-xl">
               <HiSearch className="absolute ml-3 text-gray-400" />
               <input
                 required
                 type="text"
                 value={product}
                 onChange={onChange}
                 placeholder="search product"
                 className="w-full py-3 pl-10 border-2 block shadow focus:outline-none"
               />
             </div>
           </form>
         </header>
         <h2 className="mt-5 mb-3 px-4">
           <span className="font-bold">{listings.length}</span> Ads in{" "}
           <span className="font-bold capitalize">
             {params.institutionName}
           </span>
         </h2>
         <div className=" mx-auto pb-24 px-4">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
             {listings?.map((listing) => (
               <div key={listing.id} className="group relative">
                 <InstitutionListItem listing={listing.data} id={listing.id} />
               </div>
             ))}
           </div>
         </div>
       </div>
     ) : (
       <div>
         <div className="max-w-2xl mx-auto py- px-4 sm:py- sm:px-6 lg:max-w-7xl lg:px-8">
           <h2 className="text-2xl font-extrabold tracking-tight text-gray-500 m-auto">
             No products from {params.institutionName} return to home and try
             another search!
           </h2>
         </div>
       </div>
     )}
     {/* {loading ? <Spinner description="loading" /> : listings && listings.length > 0 ?
       ( <header className="px-4 bg-primaryBackground h-20 sticky top-0 z-20 w-full pt-2">
          <form onSubmit={productSearch}>
            <div className="flex gap-5 w-full items-center shadow-2xl text-xl">
              <HiSearch className="absolute ml-3 text-gray-400" />
              <input
                required
                type="text"
                value={product}
                onChange={onChange}
                placeholder="search product"
                className="w-full py-3 pl-10 border-2 block shadow focus:outline-none"
              />
            </div>
          </form>
        </header> 
          <div className="max-w-2xl mx-auto py-24 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="">
              <span>
                <p>{listings.length} Ads in your institution</p>
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {listings?.map((listing) => (
                <div key={listing.id} className="group relative">
                  <InstitutionListItem listing={listing.data} id={listing.id} />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="">
              <h2 className="">
                No products from {params.institutionName} <Link to='/'>return to home</Link> and try another seasrch
              </h2>
            </div>
          </div>
        )}
        } */}
   </>
 );
}

export default InstitutionSearch