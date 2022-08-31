import { useState, useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../assets/logo-plain2-1.png";

const ForgotPassword = () => {
  const inputStyle =
    "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:border-input-border";
  const [email, setEmail] = useState("");
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 980px)").matches
  );

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link was sent to your Email");
    } catch (error) {
      toast.error("Could not send reset link");
    }
  };

  useEffect(() => {
    window
      .matchMedia("(min-width: 980px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

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
        <div className="max-w-2xl w-full pb-12 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-2xl w-full space-y-8">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Forgot password
            </h2>
            <form className="space-y-4" onSubmit={onSubmit}>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email addres"
                value={email}
                className={inputStyle}
                onChange={onChange}
              />
              <Button text="Retrieve password" />
            </form>
            <p className="text-center">OR</p>
            <p className="text-center">
              <Link
                to="/login"
                className="font-medium text-indigo-700 underline"
              >
                return back to sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ForgotPassword;
