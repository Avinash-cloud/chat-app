import React from "react";

const Navbar = () => {

    const logout=()=>{
        // Clear the token from localStorage (or cookies if used)
        localStorage.removeItem("authToken");
      
        // Optionally, redirect to the login page
        window.location.href = "/login";
      }
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-lg font-bold">MyLogo</div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-4">
          <li>
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="/chat" className="text-white hover:text-gray-300">
              chat
            </a>
          </li>
          <li>
            <a href="/profile" className="text-white hover:text-gray-300">
              Profile
            </a>
          </li>
          <li>
            <a href="#" onClick={logout} className="text-white hover:text-gray-300">
              Logout
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;