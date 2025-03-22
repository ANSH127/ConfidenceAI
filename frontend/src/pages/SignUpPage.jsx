import React from 'react'
import Image1 from "../assets/images/signup.jpg";
import { Link } from 'react-router-dom';

export default function SignUpPage() {
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
                  <label className="block text-lg font-medium  text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500  sm:text-sm 
                      focus:ring-2 "
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
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-4">
                   Confirm Password
                  </label>
                  <input
                    type="password"
                    name="cpass"
                    id="cpass"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500  sm:text-sm 
                      focus:ring-2 "
                  />
    
                  <p className="text-base text-gray-500 mt-2">
                    Already have an Account?{" "}<span className="text-blue-500"> 
                      <Link to="/login">Login</Link>
                    </span>
                  </p>
                </div>
    
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  justify-center">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}
