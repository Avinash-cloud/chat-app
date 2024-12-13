"use client"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
 // Ensure the package is installed
import Chat from "../components/Chat";
import Navbar from "../components/Nav";
export default function ChatPage() {
  const [userId, setUserId] = useState("");
  const [name, setname] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id); // Extract user ID from the token
      setname(decoded.name)
    }
  }, []);

  return userId ? <> <Navbar/> <Chat userId={userId} name={name} /> </>: <p><a href="/login">Login</a></p>;
}
