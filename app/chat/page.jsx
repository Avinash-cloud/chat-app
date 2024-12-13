"use client";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // Ensure the package is installed
import Chat from "../components/Chat";
import Navbar from "../components/Nav";

export default function ChatPage() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        console.log('decoded',decoded);
        
        setUserId(decoded?.id); // Extract user ID from the token
        setName(decoded?.name); // Extract name from the token
      } catch (error) {
        console.error("Invalid token:", error);
        window.location.replace('/login'); // Redirect if the token is invalid
      }
    } else {
      window.location.replace('/login'); // Redirect if the token is invalid
      // Redirect if no token is found
    }
  }, []);

  // Avoid rendering content until the userId is set or redirection is complete
  if (!userId) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Chat userId={userId} name={name} />
    </>
  );
}
