import { useState, useEffect } from "react";
import {toast} from 'react-toastify'
import FormInput from "../FormInput";
import Sidebar from "../Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { db } from '../../firebase.config'
import Button from "../Button";
import OAuth from "../OAuth";

const Login = () => {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 980px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  const inputStyle = 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:border-input-border'
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const passwordToggle = () => {
    setShowPassword((prevState) => !prevState);
  }
  
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const auth = getAuth()

    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    if(userCredential.user) {
      navigate('/')
    }  
    } catch (error) {
      toast.error('invalid User')
    }
  }

  return (
    <section>
      <main>
        <div>
          <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-md w-full space-y-5">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                  Welcome Back!
                </h2>
              <form className="space-y-4" onSubmit={onSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <input
                  type="email"
                  id='email'
                  name='email'
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  className={inputStyle}
                  onChange={onChange}
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    className={inputStyle}
                    onChange={onChange}
                  />
                  {!showPassword &&  
                    <FaEye
                    className="absolute top-3 right-1 cursor-pointer"
                    size={15}
                    color="#1e1e1e"
                    onClick={passwordToggle}
                    />
                  }
                  {showPassword &&  
                    <FaEyeSlash
                    className="absolute top-3 right-1 cursor-pointer"
                    size={15}
                    color="#1e1e1e"
                    onClick={passwordToggle}
                    />
                  }
                </div>
                <Link to="/forgot-password">
                  <p className="text-center text-indigo-700 font-medium underline mt-1">
                    Forgot your password?
                  </p>
                </Link>

                <Button text="Sign in" />
              </form>
              
              <OAuth />
              <p className="text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-700 underline"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-center text-xs">By continuing you agree to the Policy and Rules of Willtta</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Login;
