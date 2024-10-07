import React, { useState } from "react";
import CartIcon from "../../assets/Cart";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "../../assets/UserIcon";
import LogOutIcon from "@/assets/Logout";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { logoutUser } from "@/store/auth-slice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);

  console.log(isAuthenticated);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then((response) => {
      if (response.payload.success) {
        console.log("User logged out");
        toast({
          title: "Logged Out successfully",
          description: response.payload.message,
        });
      }
    });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="shadow-lg">
      <div className="max-w-full mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sidebar Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                ></path>
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#4a3116]">Hankey</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 gap-x-32">
            <div className="hidden md:flex space-x-6 gap-x-32">
              <Link
                to="/shop"
                className="text-black font-gaegu text-2xl hover:text-white hover:underline transition duration-300"
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-black font-gaegu text-2xl hover:text-white hover:underline transition duration-300"
              >
                Contact Us
              </Link>
              <Link
                to="/blog"
                className="text-black font-gaegu text-2xl hover:text-white hover:underline transition duration-300"
              >
                Blog
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                className="text-black hover:text-white"
                onClick={handleLogout}
              >
                <LogOutIcon />
              </button>
            ) : (
              <button
                className="text-black hover:text-white"
                onClick={toggleLogin}
              >
                <UserIcon />
              </button>
            )}
            <button
              className="text-black hover:text-white"
              onClick={toggleCart}
            >
              <CartIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <a
            href="#shop"
            className="block text-gray-800 font-gaegu text-2xl py-2 px-4 hover:bg-gray-100"
          >
            Shop
          </a>
          <a
            href="#contact"
            className="block text-gray-800 font-gaegu text-2xl py-2 px-4 hover:bg-gray-100"
          >
            Contact Us
          </a>
          <a
            href="#blog"
            className="block text-gray-800 font-gaegu text-2xl py-2 px-4 hover:bg-gray-100"
          >
            Blog
          </a>
        </div>
      )}

      {/* Right Sidebar (Cart) */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-4">
          <h2 className="text-lg font-bold mb-4">Your Cart</h2>
          {/* Cart Content */}
          <button
            onClick={toggleCart}
            className="absolute top-4 right-4 text-gray-800 focus:outline-none"
          >
            Close
          </button>
          {}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
