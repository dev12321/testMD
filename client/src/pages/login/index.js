import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import firebase from "./../../firebase";
function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(function (result) {
          window.localStorage.removeItem("emailForSignIn");
          setLoading(false);
          history.replace("/");
        })
        .catch(function (error) {
          toast.error("Something went wrong.");
          console.log("error", error);
        });
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <section className="text-gray-600 body-font min-h-screen flex items-center bg-gray-700">
      <div className="container px-5 py-24 mx-auto flex justify-center items-center">
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Sign In
          </h2>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            className="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
            onClick={() => {
              // firebase.auth().useEmulator("http://localhost:3031");
              firebase
                .auth()
                .sendSignInLinkToEmail(email, {
                  url: "http://localhost:3000/login",
                  handleCodeInApp: true,
                })
                .then(() => {
                  toast.success(
                    "Sign in link has been sent to your email. Please login using that link"
                  );
                  window.localStorage.setItem("emailForSignIn", email);
                });
            }}
          >
            Sign In
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Enter your college issued email id and you will receive a login
            link.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
