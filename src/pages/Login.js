import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "../components/Button";
import OAuth from "../components/OAuth";
import Logo from "../assets/logo-plain2-1.png";

const Login = () => {
  const inputStyle =
    "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:border-input-border";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );

  const passwordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const navigate = useNavigate();

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/network-request-failed") {
        toast.error("Network error. try again");
      } else {
        toast.error("Invalid Email or password");
      }
    }
    setLoading(false);
  };

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
              Welcome Back!
            </h2>
            <form className="space-y-4" onSubmit={onSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                className={inputStyle}
                onChange={onChange}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
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
              <Link to="/forgot-password">
                <p className="text-center text-indigo-700 font-medium underline mt-1">
                  Forgot your password?
                </p>
              </Link>
              <div>
                {loading ? (
                  <div className="group relative w-full flex justify-center py-2 px-4 text-lg font-medium rounded-md text-white bg-primaryBackground focus:outline-none">
                    <Spinner />
                  </div>
                ) : (
                  <Button text="Sign in" />
                )}
              </div>
            </form>

            <p className="text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-700 underline"
              >
                Sign up
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
};

export default Login;
