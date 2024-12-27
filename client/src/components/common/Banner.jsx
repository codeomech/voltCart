import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDiscount } from "@/store/common-slice"; // Adjust the import path
import gsap from "gsap";

const Banner = () => {
  const dispatch = useDispatch();
  const { discount, isLoading } = useSelector((state) => state.commonDiscount);
  const bannerRef = useRef(null);

  useEffect(() => {
    // Fetch discount messages on mount
    dispatch(fetchDiscount());
  }, [dispatch]);

  useEffect(() => {
    if (discount.data) {
      const messages = Array.isArray(discount.data)
        ? discount.data.map((d) => d.text)
        : [discount.data.text];

      const marqueeContent = messages.join(" • "); // Separator between messages
      const marquee = document.createElement("div");
      marquee.className = "flex items-center whitespace-nowrap";
      marquee.innerText = marqueeContent;

      // Add marquee to the banner
      if (bannerRef.current) {
        bannerRef.current.innerHTML = ""; // Clear previous content
        bannerRef.current.appendChild(marquee);

        // Clone for seamless looping
        const clone = marquee.cloneNode(true);
        bannerRef.current.appendChild(clone);

        // Animate the scrolling
        const totalWidth = marquee.offsetWidth;
        gsap.to(bannerRef.current, {
          x: `-${totalWidth}px`, // Scroll the entire width of the content
          duration: 15, // Adjust for scrolling speed
          ease: "linear",
          repeat: -1, // Infinite loop
        });
      }
    }
  }, [discount]);

  if (isLoading) {
    return (
      <div className="bg-black text-white text-center p-2">Loading...</div>
    );
  }

  if (!discount.data) {
    return null; // Do not show the banner if there's no discount message
  }

  return (
    <div className="bg-black overflow-hidden h-12 flex items-center">
      <div
        ref={bannerRef}
        className="relative flex text-white text-center p-2"
        style={{ willChange: "transform" }}
      >
        {/* GSAP will dynamically insert and animate the content */}
      </div>
    </div>
  );
};

export default Banner;
