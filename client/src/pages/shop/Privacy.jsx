import React from "react";
import privacy from "../../assets/privacy.jpg";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen font-gaegu flex flex-col md:flex-row py-4 px-6 md:px-16">
      {/* Text Section */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          At Volt Handkerchief, we value your privacy and are committed to
          protecting your personal information. As a small company, we only
          collect and use your email address to provide updates about your
          orders and occasional promotions.
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          Your email address will never be shared with any third-party
          organizations, except as necessary to fulfill your orders (e.g.,
          sharing with courier partners).
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          If you have any concerns or questions about how your information is
          being used, feel free to reach out to us at
          <a
            href="mailto:support@volt-handkerchief.com"
            className="text-blue-600 underline ml-1"
          >
            support@volt-handkerchief.com
          </a>
          .
        </p>
        <p className="text-2xl text-gray-600 leading-relaxed mb-4">
          By using our website and services, you agree to the terms of this
          Privacy Policy. We reserve the right to update this policy from time
          to time and will notify you of any significant changes.
        </p>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 flex text-center align-middle py-10 justify-center">
        <img
          src={privacy}
          alt="Privacy Illustration"
          className="w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
