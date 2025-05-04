import React, { useState } from "react";
import { Link } from "react-scroll"; // Import Link from react-scroll
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 md:p-6 bg-[rgba(16,4,37,1)] text-white fixed w-full z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-12 md:h-16" />
        <span className="text-lg md:text-xl font-bold text-blue-400">
          TECHNO CLUB
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 mr-96">
        <li>
          <Link
            to="home"
            smooth={true}
            duration={800}
            className="hover:text-blue-400 cursor-pointer"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="about"
            smooth={true}
            duration={800}
            className="hover:text-blue-400 cursor-pointer"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="features"
            smooth={true}
            duration={800}
            className="hover:text-blue-400 cursor-pointer"
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            to="contact"
            smooth={true}
            duration={800}
            className="hover:text-blue-400 cursor-pointer"
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex">
        <button
          className="border border-blue-400 px-4 py-2 rounded-md hover:bg-blue-400 hover:text-gray-900"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
        <button
          className="bg-purple-500 px-4 py-2 rounded-md ml-2 hover:bg-purple-700"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-full left-0 w-full bg-[rgba(16,4,37,1)] shadow-lg`}
      >
        <ul className="flex flex-col space-y-4 p-4">
          <li>
            <Link
              to="home"
              smooth={true}
              duration={800}
              className="block hover:text-blue-400 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="about"
              smooth={true}
              duration={800}
              className="block hover:text-blue-400 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="features"
              smooth={true}
              duration={800}
              className="block hover:text-blue-400 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              to="contact"
              smooth={true}
              duration={800}
              className="block hover:text-blue-400 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li className="pt-4 border-t border-gray-700">
            <button
              className="w-full border border-blue-400 px-4 py-2 rounded-md hover:bg-blue-400 hover:text-gray-900 mb-2"
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
            >
              Log In
            </button>
            <button
              className="w-full bg-purple-500 px-4 py-2 rounded-md hover:bg-purple-700"
              onClick={() => {
                navigate("/signup");
                setIsMenuOpen(false);
              }}
            >
              Sign Up
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
