"use client"
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);

    console.log(res);
    
    if (res.status === 200) {
      alert("Login successful");
      window.location.href = "/chat";
    }
    else {
      alert("Invalid credentials");
    }
  };

  const signup = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 bg-gray-200 p-4 rounded">
        <h1 className="text-center text-2xl">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 mt-4" onClick={handleLogin}>
          Login
        </button>
        <button className="w-full bg-blue-500 text-white p-2 mt-4" onClick={signup}>
          Signup
        </button>
        
      </div>
      
    </div>
  );
}
