import React, { useState, useEffect } from 'react'
import {toast} from 'react-toastify'
import { FaEye, FaEyeSlash } from "react-icons/fa";
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

const Register = () => {
  const inputStyle = 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:border-input-border'

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const { name, email, mobileNumber, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault()

    try {
      // getting this value from getAuth
      const auth = getAuth()

      // registering the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      // getting the user information
      const user = userCredential.user

      // updating the display name
      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      toast.success('Account successfully registered')
      navigate('/')
    } catch (error) {
      toast.error('something went wrong with registeration')
    }
  }
  
  return (
    <section className="flex">
      <main>
        <div>
          <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-md w-full space-y-5">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <form className="space-y-4" onSubmit={submitForm}>
                <input
                  type="name"
                  placeholder="Full Name"
                  id="name"
                  name="name"
                  value={name}
                  className={inputStyle}
                  onChange={onChange}
                />
                <input
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    id="password"
                    name="password"
                    value={password}
                    className={inputStyle}
                    onChange={onChange}
                  />

                  <FaEye
                    className="absolute top-3 right-1 cursor-pointer"
                    size={15}
                    color="#1e1e1e"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={mobileNumber}
                  className={inputStyle}
                  onChange={onChange}
                />
                <Button text="Sign up" />
              </form>

              <OAuth />
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
        </div>
      </main>
    </section>
  );
}

export default Register