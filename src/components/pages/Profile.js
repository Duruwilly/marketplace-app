import { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase.config";
import { updateDoc, doc, getDoc } from "firebase/firestore";
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
    "appearance-none rounded-none relative block w-full px-3 py-2 bg-transparent focus:outline-none";
  const profileNameActive =
    "appearance-none rounded-none relative block w-full px-3 py-2 border-gray-500 border-b bg-transparent focus:outline-none";

  const auth = getAuth();

  const [user, setUser] = useState({
    userName: '',
    userNumber: '',
  });

  const textref = useRef(null)
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
  });

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const userProfile = docSnap.data();
      setUser((prevState) => ({
        ...prevState,
        userName: userProfile.name,
        userNumber: userProfile.mobileNumber,
      }));
      setFormData((prevState) => ({
        ...prevState,
        name: userProfile.name,
        email: userProfile.email,
        number: userProfile.mobileNumber,
      }));

    }
    fetchUserDetails();
  }, [auth.currentUser.uid]);

  const { userName, userNumber } = user;
  const onSubmit = async () => {
    try {
      if (name !== userName || number !== userNumber) {
        //update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
          mobileNumber: number,
        });
      } else if (name === userName && number === userNumber) {
        toast.error("No changes was made", { toastId: "6yfvyuwevyufgvwefyuv" });
        return;
      }
      // update in firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        mobileNumber: number,
      });
      toast.success("Profile updated", { toastId: "6yfvyuwevyufgvwefyuv" });
    } catch (error) {
      toast.error("could not update profle details", {
        toastId: "6yfvyuwevyufgvwefyuv",
      });
    }
  };

  const onfocusElem = () => {
    textref.current.focus();
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const { name, email, number } = formData;

  return (
    <section className="flex">
      
      <div className="flex-[6] bg-home">
        <div className="h-screen">
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
                <Link to="/my-product">view adverts</Link>
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
                    ref={textref}
                  />
                  <input
                    type="text"
                    id="email"
                    className={!changeDetails ? profileName : profileNameActive}
                    disabled
                    readOnly
                    value={email}
                    
                  />
                  <input
                    type="tel"
                    id="number"
                    className={!changeDetails ? profileName : profileNameActive}
                    disabled={!changeDetails}
                    autoFocus={changeDetails}
                    value={number}
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
