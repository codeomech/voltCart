import React from "react";
import { Instagram, Mail, Smartphone, Twitter } from "lucide-react";
import logo from "../../assets/feather.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white">
      <div className="!bg-black w-full lg:h-[450px] h-[600px]">
        <div className="left-0 w-full overflow-hidden">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="relative block fill-white"
            ></path>
          </svg>
          <div className="flex lg:flex-row flex-col lg:justify-between justify-center items-center lg:px-10 lg:py-6 gap-10">
            {/* Quick Links Section */}
            <div className="flex flex-col gap-5 text-center lg:text-left">
              <h1 className="text-3xl font-gaegu lg:pl-4">Quick Links</h1>
              <ul className="lg:pl-4">
                <li className="mb-4 list-none text-2xl font-gaegu cursor-pointer hover:text-blue-600 transition">
                  <Link to="/contactUs">Contact Us</Link>
                </li>
                <li className="my-4 list-none text-2xl font-gaegu cursor-pointer hover:text-blue-600 transition">
                  <Link to="/story">Our Story</Link>
                </li>
                <li className="my-4 list-none text-2xl font-gaegu cursor-pointer hover:text-blue-600 transition">
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="my-4 list-none text-2xl font-gaegu cursor-pointer hover:text-blue-600 transition">
                  <Link to="/shipping-policy">Shipping Policy</Link>
                </li>
              </ul>
            </div>

            {/* Logo and Social Section */}
            <div className="flex flex-col gap-5 items-center text-center">
              <div className="flex flex-row gap-4 items-center">
                <img
                  className="lg:w-24 lg:h-24 w-12 h-12"
                  src={logo}
                  alt="logo"
                ></img>
                <span className="lg:text-8xl text-6xl font-great font-normal">
                  Volt
                </span>
              </div>
              <p className="font-gaegu">BREATHABLE | ABSORBABLE | SQUEEZABLE</p>
              <div className="flex flex-row gap-8 px-0">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/volthandkerchief/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>

                {/* Email */}
                <a
                  href="mailto:volthankey@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/+919717792898"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600 transition-colors"
                >
                  <Smartphone className="w-6 h-6" />
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com/your-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
