'use client'
import React from "react";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; 

const Navbar = () => {

    const [name, setuserName] = useState("");

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
         // Extract user ID from the token
         setuserName(decoded.name);
         
         // Extract name from the token

        //  console.log('navigation',name)
        } catch (error) {
          console.error("Invalid token:", error);
          window.location.replace('/login'); // Redirect if the token is invalid
        }
      } else {
        window.location.replace('/login'); // Redirect if the token is invalid
        // Redirect if no token is found
      }
    }, []);

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
        <div className="text-white text-lg font-bold"> <h1>welocme {name}</h1></div>
        

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