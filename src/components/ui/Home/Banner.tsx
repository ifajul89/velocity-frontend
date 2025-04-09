import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../../assets/img1.jpg";
import img2 from "../../../assets/img2.jpg";
import img3 from "../../../assets/img3.jpg";

const bannerContent = [
  {
    title: "Summer Sale",
    description: "Get up to 30% off on selected Cars",
    cta: "Shop Now",
    image: img1,
  },
  {
    title: "New Arrivals",
    description: "Check out the latest models",
    cta: "Explore",
    image: img2,
  },
  {
    title: "Limited Time Offer",
    description: "Exclusive deals just for you",
    cta: "Grab Now",
    image: img3,
  },
];
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerContent.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerContent.length) % bannerContent.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {bannerContent.map((items, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 h-full w-full transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={items.image || "/placeholder.svg"}
            alt={items.title}
            className="h-full w-full object-cover"
          />
          <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="text-center text-white">
              <h2 className="mb-4 text-4xl font-bold md:text-6xl">
                {items.title}
              </h2>
              <p className="mb-6 text-xl md:text-2xl">{items.description}</p>
              <button className="rounded-full bg-purple-600 px-6 py-2 font-bold text-white transition duration-300 hover:bg-purple-700">
                {items.cta}
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full bg-black p-2 text-white transition duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full bg-black p-2 text-white transition duration-300"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Banner;
