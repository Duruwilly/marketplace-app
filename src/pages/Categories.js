import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import QueryListItem from "../components/QueryListItem";
import Logo from "../assets/logo-plain2-1.png";

const Categories = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      // Get reference collection from the database
      const listingsRef = collection(db, "listings");

      // make a query from the collection
      const modelq = query(
        listingsRef,
        where("categories", "==", params.categoriesName),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      // Execute the query
      const namequerySnap = await getDocs(modelq);

      // setting pagination on load more. subtracting 1 from the number of length from our query

      const lastNameVisible = namequerySnap.docs[namequerySnap.docs.length - 1];
      setLastFetchedListing(lastNameVisible);

      // pushing the fetched list from the query to an array
      let listings = [];
      namequerySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };
    fetchListings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.categoriesName]);

  // pagination / Load more
  const onFetchMoreListings = async () => {
    // Get reference
    const listingsRef = collection(db, "listings");

    // create a query

    const nameq = query(
      listingsRef,
      where("categories", "==", params.categoriesName),
      orderBy("timestamp", "desc"),
      startAfter(lastFetchedListing),
      limit(10)
    );

    // Execute the query
    const namequerySnap = await getDocs(nameq);

    const lastNameVisible = namequerySnap.docs[namequerySnap.docs.length - 1];
    setLastFetchedListing(lastNameVisible);

    let listings = [];
   namequerySnap.forEach((doc) => {
       return listings.push({
         id: doc.id,
         data: doc.data(),
       });
   });

    setListings((prevState) => [...prevState, ...listings]);
    setLoading(false);
  };

  if(loading) return <Spinner description="loading..." />
  return (
    <>
      {listings.length > 0 && (
        <div>
          <header className="bg-primaryBackground flex justify-center px-4 sticky top-0 z-10">
            <Link to="/" className="mx-0 mb-6">
              <img src={Logo} alt="logo" className="h-16 mt-6" />
            </Link>
          </header>
          <div className=" mx-auto pb-24 px-4 mt-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {listings?.map((listing) => (
                <div key={listing.id} className="group relative">
                  <QueryListItem listing={listing.data} id={listing.id} />
                </div>
              ))}
            </div>
            <br />
            <br />
            {lastFetchedListing && (
              <p
                className="bg-black font-semibold text-white rounded-full px-1 w-1/4 text-center my-0 mx-auto cursor-pointer"
                onClick={onFetchMoreListings}
              >
                More
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
