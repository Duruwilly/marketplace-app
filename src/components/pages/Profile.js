import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase.config";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const Profile = () => {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 980px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const profileName =
    "appearance-none rounded-none relative block w-full px-3 py-2 font-semibold bg-transparent focus:outline-none";
  const profileNameActive =
    "appearance-none rounded-none relative block w-full px-3 py-2  font-semibold border-gray-500 border bg-transparent focus:outline-none";

  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    mobileNumber: auth.currentUser.phoneNumber,
  });

  const { name, email, mobileNumber } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("could not update profle details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <section className="flex">
      { matches &&
      <Sidebar />
      }
      <div className="flex-[6] bg-home">
        <div className="mb-4">
          <header className="bg-navbar text-white py-1 px-4">
            <p className="font-bold text-xl">Welcome {name}</p>
            <p>{email}</p>
          </header>

          <main>
            <p className="bg-gray-200 shadow pt-3 pb-1 px-4">
              MY WILLTTA ACCOUNT
            </p>
            <div className="px-4 mt-2 space-y-6">
              <p>
                <Link to="/">Favourites</Link>
              </p>
              <p>
                <Link to="/">view adverts</Link>
              </p>
              <p>
                <Link to="/">Recently viewed</Link>
              </p>
            </div>
            <div>
              <p className="bg-gray-200 shadow py-3 pb-1 px-4">
                Profile Details
              </p>
              <div>
                <form className="space-y-2">
                  <input
                    type="text"
                    id="name"
                    className={!changeDetails ? profileName : profileNameActive}
                    disabled={!changeDetails}
                    value={name}
                    onChange={onChange}
                  />
                  <input
                    type="text"
                    id="email"
                    className={!changeDetails ? profileName : profileNameActive}
                    disabled={!changeDetails}
                    value={email}
                    onChange={onChange}
                  />
                  <input
                    type="tel"
                    id="mobileNumber"
                    className={!changeDetails ? profileName : profileNameActive}
                    disabled={!changeDetails}
                    value={mobileNumber}
                    onChange={onChange}
                  />
                </form>
              </div>
              <div className="flex items-center justify-center gap-6 mt-10">
                <p
                  className="text-white cursor-pointer font-semibold px-4 text-lg rounded-lg bg-primaryBackground"
                  onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((prevState) => !prevState);
                  }}
                >
                  {changeDetails ? "done" : "edit"}
                </p>
                <button
                  type="button"
                  className="text-white font-semibold px-4 bg-red-800 rounded-lg"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Profile;
