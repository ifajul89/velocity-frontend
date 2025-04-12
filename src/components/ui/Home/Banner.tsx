import { Button } from "../button";
import { RxArrowTopRight } from "react-icons/rx";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../../assets/img1.jpg";
import img2 from "../../../assets/img2.jpg";
import img3 from "../../../assets/img3.jpg";
// import { Value } from "@radix-ui/react-select";

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

interface BannerVeloBlackPartInnerProps {
  value: string;
  title: string;
}

const BannerVeloBlackPartInner: React.FC<BannerVeloBlackPartInnerProps> = ({
  value,
  title,
}) => {
  return (
    <div>
      <h4 className="text-3xl">{value}</h4>
      <h5 className="w-min font-extralight text-velo-gray">{title}</h5>
    </div>
  );
};

const bannerVeloBlackPartInnerData = [
  {
    value: "4k+",
    title: "Cars Available",
  },
  {
    value: "4.9",
    title: "Client Satisfaction",
  },
  {
    value: "98%",
    title: "Major Companies",
  },
  {
    value: "7,9k",
    title: "Car Delivered",
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
    <section className="bg-velo-white">
      <div className="container flex h-full items-center gap-16 py-5">
        {/* Text Part */}
        <div className="w-2/5 space-y-12">
          <h1 className="text-6xl leading-[65px] font-medium">
            Your Journey
            <br />
            Begins with
            <br />
            Our Cars
          </h1>

          <p className="text-lg">
            Welcome to Velocity, your destination for the perfect ride! Discover
            our extensive selection of quality vehicles and enjoy exceptional
            service. Let us help you accelerate your journey today
          </p>

          <div className="group flex gap-3">
            <Button className="bg-velo-red group-hover:!bg-velo-maroon h-11">
              Search For Cars
            </Button>
            <Button className="bg-velo-red group-hover:!bg-velo-maroon size-11">
              <RxArrowTopRight />
            </Button>
          </div>

          <p className="text-gray-400 font-bold">Accelerate Your Journey with Quality and Care!!</p>
        </div>

        {/* Image Part */}
        <div className="grid w-3/5 grid-cols-4 grid-rows-2 gap-7">
          <div className="relative col-span-2 row-span-2 h-[610px] rounded-full">
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
                  className="h-full w-full rounded-full object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-inherit">
                  <div className="text-center text-white">
                    <h2 className="mb-4 text-4xl font-bold md:text-3xl">
                      {items.title}
                    </h2>
                    <p className="mb-6 text-xl md:text-xl">
                      {items.description}
                    </p>
                    <button className="rounded-lg bg-velo-red px-6 py-2 font-semibold text-white transition duration-300 hover:bg-velo-maroon">
                      {items.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={prevSlide}
              className="bg-opacity-50 hover:bg-opacity-75 bg-velo-red absolute top-1/2 -left-4 z-20 -translate-y-1/2 transform rounded-full p-2 text-white transition duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="bg-opacity-50 hover:bg-opacity-75 bg-velo-black absolute top-1/2 -right-4 -translate-y-1/2 transform rounded-full p-2 text-white transition duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <img
            className="row-span-1 h-full w-full rounded-full object-cover"
            src={img1}
            alt=""
          />
          <img
            className="row-span-1 h-full w-full rounded-full object-cover"
            src={img2}
            alt=""
          />

          <div className="bg-velo-black text-velo-white col-span-2 row-span-1 grid h-full gap-5 w-full grid-cols-2 place-items-center rounded-[50px] p-8">
            {bannerVeloBlackPartInnerData.map((eachData) => (
              <BannerVeloBlackPartInner
                value={eachData.value}
                title={eachData.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
