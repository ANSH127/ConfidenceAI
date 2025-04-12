import React from "react";
import Image1 from "../assets/images/signup.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    if (!email || !password) {
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
      email,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        user,
        {withCredentials: true}
      );
      if(response.status==200){
        alert("User logged in successfully");
      }else{
        alert(response.data.error);
      }
      console.log(document.cookie.jwt);
      
      console.log(response.data);
   
      
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      alert("Error logging in");
    }
  }
  return (
    <div>
      <div className=" grid  md:grid-cols-2">
        <div>
          <img src={Image1} alt="signup" className="h-full w-full pt-2" />
        </div>
        <div className="flex justify-center items-center">
          <div className="w-96">
            <h1 className="text-4xl text-center font-bold">Log in</h1>
            <div className="my-4">
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
              />

              <p className="text-base text-gray-500 mt-2">
                Don't have an Account?{" "}
                <span className="text-blue-500">
                  <Link to="/signup">SignUp</Link>
                </span>
              </p>
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  justify-center"
            onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
