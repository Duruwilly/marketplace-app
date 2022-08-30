import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import InstitutionListItem from "./InstitutionListItem";

const ProductSearchPage = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const navigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      // Get reference
      const listingsRef = collection(db, "listings");

      // create a query
      const q = query(
        listingsRef,
        where("name", "==", params.productName),
        orderBy("timestamp", "desc"),
        limit(12)
      );

      const qu = query(
        listingsRef,
        where("model", "==", params.productName),
        orderBy("timestamp", "desc"),
        limit(12)
      );

      // Execute query
      const querySnap = await getDocs(q);
      const queryModel = await getDocs(qu);


      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const lastSeen = queryModel.docs[queryModel.docs.length - 1];
      setLastFetchedListing(lastSeen);

      let listings = [];
      querySnap.forEach((doc) => {
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
  }, [params.productName]);

  // pagination / Load more
  const onFetchMoreListings = async () => {
    // Get reference
    const listingsRef = collection(db, "listings");

    // create a query
    const q = query(
      listingsRef,
      where("name", "==", params.productName),
      orderBy("timestamp", "desc"),
      startAfter(lastFetchedListing),
      limit(12)
    );

    const qu = query(
      listingsRef,
      where("model", "==", params.productName),
      orderBy("timestamp", "desc"),
      startAfter(lastFetchedListing),
      limit(12)
    );

    // Execute query
    const querySnap = await getDocs(q);
    const queryModel = await getDocs(qu);

    const lastVisible = querySnap.docs[querySnap.docs.length - 1];
    setLastFetchedListing(lastVisible);

    const lastSeen = queryModel.docs[queryModel.docs.length - 1];
    setLastFetchedListing(lastSeen);

    let listings = [];
    querySnap.forEach((doc) => {
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
          <h2 className="mt-5 mb-3 px-4">
            <span className="font-bold">{listings.length}</span> Ad{listings.length === 1 ? '' : 's'} in{" "}
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
              No {params.productName} from {params.institutionName} return back and try
              another search!
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSearchPage;
