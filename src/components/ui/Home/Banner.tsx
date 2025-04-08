import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"

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
        (prev) => (prev - 1 + bannerContent.length) % bannerContent.length
      );
    };
  
    useEffect(() => {
      const timer = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
      return () => clearInterval(timer);
    }, [nextSlide]);
  
    return (
      <div className="relative w-full h-[600px] overflow-hidden">
        {bannerContent.map((items, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={items.image || "/placeholder.svg"}
              alt={items.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-inherit bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  {items.title}
                </h2>
                <p className="text-xl md:text-2xl mb-6">{items.description}</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                  {items.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };
  
  export default Banner;
