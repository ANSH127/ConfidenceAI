import React from "react";
import Image1 from "../assets/images/signup.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      alert("Please fill all the fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    // logic
    const user = {
      name,
      email,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/signup",
        user
      );
      if(response.status==200){
        alert("User created successfully");
        navigate("/login");
      }else{
        alert(response.data.error);
      }
      // console.log(response.data);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      alert("Error signing up");
    }
  };

  return (
    <div>
      <div className=" grid  md:grid-cols-2">
        <div>
          <img src={Image1} alt="signup" className="h-full w-full pt-2" />
        </div>
        <div className="flex justify-center items-center">
          <div className="w-96">
            <h1 className="text-4xl text-center font-bold">Sign Up</h1>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500  sm:text-sm 
                      focus:ring-2 "
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="block text-lg font-medium  text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500  sm:text-sm 
                      focus:ring-2 "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Password
              </label>
              <input
                type="password"
                name="pass"
                id="pass"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500  sm:text-sm 
                      focus:ring-2 "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <p className="text-base text-gray-500 mt-2">
                Already have an Account?{" "}
                <span className="text-blue-500">
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  justify-center"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
