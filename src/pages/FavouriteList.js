import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
          navigate("/sign-in");
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
      const updatedFavouriteList = 
        favouriteList.filter((favourite) => favourite.id !== favouriteId);
      setFavouriteList(updatedFavouriteList);
      toast.success('deleted successfully')
    } catch (error) {
      console.log(error);
      toast.error("error", { toastId: "#@#433szxdz#@23" });
    }
  };

  if (loading) return <Spinner description="Loading..." />;

  return (
    <div className="mt-16 pb-24">
      {favouriteList?.length !== 0 ? (
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-8">
              <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                Your Saved Item
              </h1>
            </div>
            <div className="lg:w-2/3 w-full mx-auto overflow-auto">
              <table className="table-auto w-full text-left whitespace-no-wrap">
                <thead>
                  <tr>
                    <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl"></th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      Name
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      Qty
                    </th>
                    <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                      Price
                    </th>
                    <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th>
                  </tr>
                </thead>
                <tbody>
                  {favouriteList?.map((wishlist) => (
                    <FavouriteItem
                      FavouriteItem={wishlist.data}
                      id={wishlist.id}
                      key={wishlist.id}
                      handleDelete={deleteFavourite}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
