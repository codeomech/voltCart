import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import bike from "../../assets/bike.avif";

const ShippingPolicy = () => {
  return (
    <div className="bg-white min-h-screen font-gaegu flex flex-col md:flex-row py-4 px-6 md:px-16">
      {/* Text Section */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Shipping Policy
        </h1>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          The shipping time for all products may vary and will be mentioned on
          their respective pages. Kindly refer to the same.Also for Now there is
          no Refund Once user Purchase the Product, You can't return that.
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          For domestic orders, trusted courier companies are used, like
          Delhivery, BlueDart, XpressBees, FedEx, etc. For remote towns,
          registered post/speed post may be used.
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          Kindly mail us for if you face a delay of more than 10 days
          <a
            href="mailto:volthankey@gmail.com"
            className="text-blue-600 underline ml-1"
          >
            volthankey@gmail.com
          </a>
          , and we will see what can be done about it.
        </p>
        <p>
          Volt Hankey is not liable for any delay in delivery by the courier
          company / postal authorities and only guarantees to hand over the
          consignment to the courier company or postal authorities within the
          promised time (refer to product page) from the date of the order and
          payment or as per the delivery date agreed at the time of order
          confirmation.
        </p>
      </div>

      {/* Image Section with Lazy Loading */}
      <div className="md:w-1/2 flex text-center align-middle py-10 justify-center">
        <LazyLoadImage
          src={bike} // Replace with an actual image URL
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

export default ShippingPolicy;
