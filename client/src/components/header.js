import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CollegeLogo } from "../assets/images";
import firebase, { AuthContext } from "../firebase";

function Header() {
  const { currentUser } = useContext(AuthContext);
  return (
    <header className="text-gray-600 body-font shadow sticky top-0 bg-white">
      <div className="container mx-auto flex px-5 py-3 items-center justify-between">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900 mb-2 gap-3"
        >
          <img alt="logo" src={CollegeLogo} className="w-10 h-10" />

          <span className="ml-3 text-xl leading-none hidden sm:block">
            Dayananda Sagar College of engineering
          </span>
        </Link>
        {/* <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center gap-5">
          <a className="hover:text-gray-900" href="/">
            First Link
          </a>
          <a className="hover:text-gray-900" href="/">
            Second Link
          </a>
          <a className="hover:text-gray-900" href="/">
            Third Link
          </a>
          <a className="hover:text-gray-900" href="/">
            Fourth Link
          </a>
        </nav> */}
        <div className="flex gap-2 items-center">
          <span className="hidden md:block text-sm">{currentUser.email}</span>
          <button
            className="inline-flex items-center bg-gray-200 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base whitespace-nowrap"
            onClick={() => {
              firebase.auth().signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
