import React from 'react'

export default function SideBar() {
  return (
    <div className="w-64 bg-gray-800 text-white">
        <ul className="p-4">
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Home
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Profile
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Settings
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Logout
            </a>
          </li>
        </ul>
      </div>
  )
}
