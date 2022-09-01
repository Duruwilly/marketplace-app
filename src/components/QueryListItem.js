import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { AiFillCamera, AiFillHeart } from "react-icons/ai";

const QueryListItem = ({ listing, id }) => {
  const auth = getAuth();
  const addToFavourite = async (favourite) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        addItem();
        toast.success("Item added to favourite", { toastId: "r34-xAcu9#@(*" });
      } else if (!user) {
        toast.info("Please signup or log in", { toastId: "r34-xAcu9#@(*" });
        return;
      }
    });
    const addItem = async () => {
      const favouriteItem = {
        ...listing,
        favouriteRef: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, "favourites"), favouriteItem);
      } catch (error) {
        toast.error("An error occured");
      }
    };
  };

  return (
    <section className="mx-auto container">
      <div className="w-full h-max shadow-lg border-2 border-gray-200 border-opacity-60 overflow-hidden rounded-lg">
        <div className="relative">
          <Link
            to={`/institution/${listing.institution}/${
              listing.name || listing.model
            }/${id}`}
          >
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-b-lg shadow-xl overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img
                src={listing.imgUrls[0]}
                alt={listing.name || listing.model}
                className="w-full h-56 object-center object-cover group-hover:opacity-75"
              />
            </div>
            <div className="px-3 my-1">
              <h2 className="mt-4 text-black font-semibold capitalize">
                {listing?.name}
              </h2>
              <h2 className="mt-4 text-black font-semibold capitalize">
                {listing?.model}
              </h2>
              <p className="text-sm text-gray-500 my-1">{listing?.condition}</p>
              <p className="text-sm text-gray-500 my-1 capitalize">
                {listing.institution}
              </p>
              {listing.price !== "" && (
                <p className="mt-1 text-sm font-bold text-purple-900">
                  ₦
                  {[listing.price]
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              )}
            </div>
          </Link>
          <div className="flex border-t border-gray-200 ">
            <div className="border-b-4 border-b-indigo-800 w-full text-center py-1">
              <a href={`tel:${listing.mobileNumber}`}>Call</a>
            </div>
            <div className="bg-purple-800 w-full text-gray-200 text-center py-1">
              <Link to='/notification'>Chat</Link>
            </div>
          </div>
          <div className="text-white absolute m-auto px-1 top-0 bg-opacity-40 text-opacity-80 bg-white rounded-lg">
            <p>WILLTTA</p>
          </div>
          <div className="bg-[rgba(0,0,0,0.8)] absolute top-40 left-0 m-auto text-white w-1/4 rounded-sm text-sm">
            <div className="flex items-center gap-1 justify-center">
              <p>{listing.imgUrls.length}</p> <AiFillCamera />
            </div>
          </div>
          <div className="absolute top-0 right-0">
            <button
              onClick={addToFavourite}
              className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 hover:bg-purple-300"
            >
              <AiFillHeart />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueryListItem;
