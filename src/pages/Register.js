import React, { useState, useEffect } from 'react'
import {toast} from 'react-toastify'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase.config'
import Button from "../components/Button";
import OAuth from '../components/OAuth';
import Logo from "../assets/logo-plain2-1.png";
import { useDispatch } from 'react-redux';
import { registerSucess } from '../redux/userSlice';

const Register = () => {
  const inputStyle = 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:border-input-border'

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const { userName, email, mobileNumber, password } = formData;

  const navigate = useNavigate();

  const passwordToggle = () => {
    setShowPassword((prevState) => !prevState);
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    window
      .matchMedia("(min-width: 980px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const submitForm = async (e) => {
    e.preventDefault()
    setLoading(true);
    dispatch(registerSucess({ userName, email, mobileNumber }));
    try {
      // getting this value from getAuth
      const auth = getAuth();

      // registering the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // getting the user information
      const user = userCredential.user;

      // updating the display name
      updateProfile(auth.currentUser, {
        displayName: userName,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Account successfully registered");
      setLoading(false);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.warning("Email has already been registered");
        setLoading(false);
        return;
      } else if (error.code === "auth/weak-password") {
        toast.warning("Use a strong password");
        setLoading(false);
        return;
      } else {
        toast.error("something went wrong with registeration. Try again");
      }
      setLoading(false);
    }
  }
  
  return (
    <section>
      {!matches && (
        <header className="bg-primaryBackground flex justify-center px-4 sticky top-0 z-10">
          <Link to="/" className="mx-0 mb-6">
            <img src={Logo} alt="logo" className="h-16 mt-6" />
          </Link>
        </header>
      )}
      <main className="flex items-center justify-center">
        <div className="max-w-2xl w-full pb-20 px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-2xl w-full space-y-5">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <form className="space-y-4" onSubmit={submitForm}>
              <input
              required
                type="name"
                placeholder="Full Name"
                id="userName"
                name="userName"
                value={userName}
                className={inputStyle}
                onChange={onChange}
              />
              <input
              required
                type="email"
                placeholder="Email address"
                autoComplete="email"
                id="email"
                name="email"
                className={inputStyle}
                value={email}
                onChange={onChange}
              />
              <div className="relative">
                <input
                required
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  value={password}
                  className={inputStyle}
                  onChange={onChange}
                />
                {!showPassword && (
                  <FaEye
                    className="absolute top-3 right-1 mr-2 cursor-pointer"
                    size={15}
                    color="#1e1e1e"
                    onClick={passwordToggle}
                  />
                )}
                {showPassword && (
                  <FaEyeSlash
                    className="absolute top-3 right-1 mr-2 cursor-pointer"
                    size={15}
                    color="#1e1e1e"
                    onClick={passwordToggle}
                  />
                )}
              </div>
              <input
                type="tel"
                placeholder="Mobile Number"
                id="mobileNumber"
                name="mobileNumber"
                required
              maxLength='11'
              minLength='11'
              size='13'
                value={mobileNumber}
                className={inputStyle}
                onChange={onChange}
              />
              <div>
                {loading ? (
                  <div className="group relative w-full flex justify-center py-2 px-4 text-lg font-medium rounded-md text-white bg-primaryBackground focus:outline-none">
                    <Spinner />
                  </div>
                ) : (
                  <Button text="Sign up" />
                )}
              </div>
            </form>

            <p className="text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-700 underline"
              >
                Sign in
              </Link>
            </p>
            <p className="text-center text-xs">
              By continuing you agree to the Policy and Rules of Willtta
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Register