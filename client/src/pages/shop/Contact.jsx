import React, { Suspense, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import art1 from "../../assets/art1.avif";
import art2 from "../../assets/art2.avif";
import art3 from "../../assets/art3.avif";
import art4 from "../../assets/art4.avif";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const images = [art1, art2, art3, art4];
  return (
    <div className="flex flex-col items-center justify-center p-10">
      {/* Header Section */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 font-gaegu">
        Contact Us
      </h1>
      <p className="text-center text-gray-600 text-2xl mb-8 font-gaegu">
        For love letters and other{" "}
        <span className="font-semibold">pyaar bhari baatein</span>, you can mail
        us at{" "}
        <a
          href="mailto:volthankey@gmail.com"
          className="text-blue-500 underline hover:text-blue-700"
        >
          volthankey@gmail.com
        </a>
      </p>

      {/* Images Section */}
      <Suspense fallback={<p className="text-center">Loading images...</p>}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
          {images.map((image, index) => (
            <LazyLoadImage
              key={index}
              src={image}
              alt={`Art ${index + 1}`}
              effect="blur" // Blur effect while loading
              className="w-36 h-36"
              onLoad={() => setLoading(false)}
              placeholder={<div className="w-36 h-36 animate-pulse" />}
            />
          ))}
        </div>
      </Suspense>

      {/* Alert if content hasn't loaded */}
      {loading && (
        <p className="mt-4 text-sm text-gray-500 animate-pulse">
          Content is loading, hang tight!
        </p>
      )}
    </div>
  );
};

export default Contact;
