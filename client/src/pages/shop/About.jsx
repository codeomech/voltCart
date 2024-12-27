import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import family from "../../assets/dinner.png";

const About = () => {
  return (
    <div className="bg-white min-h-screen font-gaegu flex flex-col md:flex-row items-center px-6 md:px-16">
      {/* Text Section */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Our Story
        </h1>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          At <span className="font-semibold text-gray-800">VOLT</span>, we
          believe that a handkerchief is more than just a square of fabric—it's
          a statement of style and sophistication. We are committed to crafting
          handkerchiefs with{" "}
          <span className="font-semibold">100% genuine cotton</span> and
          elegant, gentlemanly designs that make you feel confident and stand
          out in any social gathering.
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          Our vision is simple: to create handkerchiefs so exceptional that they
          make you *drool over your hankey*. With every stitch, we ensure
          quality and comfort, giving you a versatile accessory that’s truly the
          "Swiss Army Knife of fabric squares."
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed">
          For bulk orders or collaborations, feel free to{" "}
          <a
            href="https://wa.me/+919717792898"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 font-semibold"
          >
            contact us on WhatsApp
          </a>
          . We are always cooking.
        </p>
      </div>

      {/* Image Section with Lazy Loading */}
      <div className="md:w-1/2 flex justify-center">
        <LazyLoadImage
          src={family} // Replace with an actual image URL
          alt="Elegant Handkerchief"
          effect="blur" // Blur effect while loading
          className="w-full max-w-md"
          placeholder={
            <div className="w-full max-w-md animate-pulse bg-gray-200" />
          } // Placeholder for loading state
        />
      </div>
    </div>
  );
};

export default About;
