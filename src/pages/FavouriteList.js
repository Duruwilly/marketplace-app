import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import FavouriteItem from "../components/FavouriteItem";
import Logo from "../assets/logo-plain2-1.png";
function Wishlist() {
  const [favouriteList, setFavouriteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchFavouriteList = async () => {
      try {
        const docRef = collection(db, "favourites");
        const q = query(
          docRef,
          where("favouriteRef", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc"),
          limit(12)
        );
        const docSnap = await getDocs(q);
        const favouriteItems = [];
        docSnap.forEach((doc) => {
          return favouriteItems.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setFavouriteList(favouriteItems);
        setLoading(false);
      } catch (error) {
        toast.error("unable to get favourite lists", { toastId: "YU$V%^^$TG" });
        navigate("/");
      }
    };
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchFavouriteList();
        } else if (!user) {
          navigate("/login");
          toast.info(
            "Please log in",
            { toastId: "r34-xAcu9#@(*" },
            { autoClose: 10000 }
          );
          return;
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const deleteFavourite = async (favouriteId) => {
    try {
      await deleteDoc(doc(db, "favourites", favouriteId));
      const updatedFavouriteList = favouriteList.filter(
        (favourite) => favourite.id !== favouriteId
      );
      setFavouriteList(updatedFavouriteList);
      toast.success("deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("error", { toastId: "#@#433szxdz#@23" });
    }
  };

  if (loading) return <Spinner description="Loading..." />;

  return (
    <div className="">
      <header className="bg-primaryBackground flex justify-center px-4 sticky top-0 z-20">
        <Link to="/" className="mx-0 mb-6">
          <img src={Logo} alt="logo" className="h-16 mt-6" />
        </Link>
      </header>
      {favouriteList?.length !== 0 ? (
        <section className="mt-6 pb-24">
          <main className="text-gray-600 body-font">
            <div className="px-4 mx-auto">
              <h1 className="text-center capitalize sm:text-4xl text-3xl font-medium mb-2 text-gray-900">
                your favourite
              </h1>
              <ul className="overflow-x-auto">
                {favouriteList?.map((listing) => (
                  <FavouriteItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    handleDelete={deleteFavourite}
                  />
                ))}
              </ul>
            </div>
          </main>
        </section>
      ) : (
        <div className="flex justify-center align-center mt-24">
          <h1 className="font-medium title-font mb-2 text-gray-900">
            You Have not added any item to your wish
          </h1>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
