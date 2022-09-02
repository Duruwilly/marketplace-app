import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import InstitutionListItem from "../components/QueryListItem";
import { HiSearch } from "react-icons/hi";

const QuerySearch = () => {
  const location = useLocation()
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queryName, setQueryName] = useState(location.state.queryName);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      // Get reference collection from the database
      const listingsRef = collection(db, "listings");

      // make a query from the collection
      const q = query(
        listingsRef,
        where("institution", "==", params.queryName),
        orderBy("timestamp", "desc"),
        limit(12)
      );

      const modelq = query(
        listingsRef,
        where("model", "==", params.queryName),
        orderBy("timestamp", "desc"),
        limit(12)
      );

      const nameq = query(
        listingsRef,
        where("name", "==", params.queryName),
        orderBy("timestamp", "desc"),
        limit(12)
      );

      // Execute the query
      const querySnap = await getDocs(q);
      const namequerySnap = await getDocs(nameq);
      const queryModel = await getDocs(modelq);

      // setting pagination on load more. subtracting 1 from the number of length from our query
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const lastNameVisible = namequerySnap.docs[namequerySnap.docs.length - 1];
      setLastFetchedListing(lastNameVisible);

      const lastModelVisible = queryModel.docs[queryModel.docs.length - 1];
      setLastFetchedListing(lastModelVisible);

      // pushing the fetched list from the query to an array
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      namequerySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      queryModel.forEach((doc) => {
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
  }, [params.queryName]);

  // pagination / Load more
  const onFetchMoreListings = async () => {
    // Get reference
    const listingsRef = collection(db, "listings");

    // create a query
    const q = query(
      listingsRef,
      where("institution", "==", params.queryName),
      orderBy("timestamp", "desc"),
      startAfter(lastFetchedListing),
      limit(12)
    );

    const nameq = query(
      listingsRef,
      where("name", "==", params.queryName),
      orderBy("timestamp", "desc"),
      startAfter(lastFetchedListing),
      limit(12)
    );

    const modelq = query(
      listingsRef,
      where("model", "==", params.queryName),
      orderBy("timestamp", "desc"),
      startAfter(lastFetchedListing),
      limit(12)
    );

    // Execute query
    const querySnap = await getDocs(q);
    const namequerySnap = await getDocs(nameq);
    const queryModel = await getDocs(modelq);

    const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    setLastFetchedListing(lastVisible);

    const lastNameVisible = namequerySnap.docs[namequerySnap.docs.length - 1];
    setLastFetchedListing(lastNameVisible);

    const lastModelVisible = queryModel.docs[queryModel.docs.length - 1];
    setLastFetchedListing(lastModelVisible);

    let listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    namequerySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    queryModel.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    setListings((prevState) => [...prevState, ...listings]);
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Spinner description="loading..." />
      ) : listings && listings.length > 0 ? (
        <div>
          <header className="px-4 bg-primaryBackground h-20 sticky top-0 z-20 w-full pt-2">
            <form>
              <div className="flex gap-5 w-full items-center shadow-2xl text-xl">
                <HiSearch className="absolute ml-3 text-gray-400" />
                <input
                  required
                  type="text"
                  value={queryName}
                  placeholder={queryName}
                  disabled
                  className="w-full py-3 pl-10 border-2 block shadow focus:outline-none text-gray-700 text-lg font-medium"
                />
              </div>
            </form>
          </header>
          <h2 className="mt-5 mb-3 px-4">
            <span className="font-bold">{listings.length}</span> Ad
            {listings.length === 1 ? "" : "s"} in{" "}
            <span className="font-bold capitalize">
              {params.queryName}
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
      ) : (
        <div>
          <div className="max-w-2xl mx-auto py- px-4 sm:py- sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-500 m-auto">
              There are no result based on your search. kindly return to home and try
              another search!
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default QuerySearch;
