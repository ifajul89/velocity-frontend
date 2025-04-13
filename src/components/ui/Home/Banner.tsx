import { Button } from "../button";
import { RxArrowTopRight } from "react-icons/rx";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@/assets/home/banner/car1.jpg";
import img2 from "@/assets/home/banner/car2.jpg";
import img3 from "@/assets/home/banner/car3.jpg";
import img4 from "@/assets/home/banner/car4.jpg";
// import { Value } from "@radix-ui/react-select";

const bannerContent = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Get 30% off on selected Cars",
    cta: "Shop Now",
    image: img1,
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out the latest models",
    cta: "Explore",
    image: img2,
  },
  {
    id: 3,
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
      <h5 className="text-velo-gray w-min font-extralight">{title}</h5>
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
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="bg-velo-white">
      <div className="container flex h-full flex-col-reverse items-center gap-5 py-5 md:flex-row md:gap-16">
        {/* Text Part */}
        <div className="space-y-4 md:w-1/2 md:space-y-8 lg:w-2/5 lg:space-y-12">
          <h1 className="text-3xl font-medium md:text-5xl md:leading-[60px] xl:text-6xl xl:leading-[65px]">
            Your Journey <br className="hidden md:block" />
            Begins with <br className="hidden md:block" />
            Our Cars
          </h1>

          <p className="md:text-lg">
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

          <p className="font-bold text-gray-400">
            Accelerate Your Journey with Quality and Care!!
          </p>
        </div>

        {/* Image Part */}
        <div className="grid w-full grid-cols-4 grid-rows-2 gap-4 md:w-1/2 md:gap-7 lg:w-3/5">
          <div className="relative col-span-4 row-span-2 h-[350px] md:h-[610px] md:rounded-full lg:col-span-2">
            {bannerContent.map((items, index) => (
              <div
                key={items.id}
                className={`absolute top-0 left-0 h-full w-full overflow-hidden transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={items.image || "/placeholder.svg"}
                  alt={items.title}
                  className="h-full w-full rounded-4xl object-cover md:rounded-full"
                />
                <div className="bg-velo-white/10 absolute inset-0 flex items-end justify-center overflow-hidden rounded-4xl md:rounded-full">
                  <div className="bg-velo-red/40 text-cente flex w-full flex-col items-center justify-center rounded-t-4xl px-5 py-3 text-center text-white backdrop-blur-xs md:h-[190px] md:rounded-t-[35px] md:pt-0 md:pb-8">
                    <h2 className="text-2xl font-semibold">{items.title}</h2>
                    <p className="mt-1 mb-3 text-[17px] font-light">
                      {items.description}
                    </p>
                    <Button className="bg-velo-red hover:!bg-velo-maroon h-10 px-6 py-2 font-semibold text-white transition duration-300">
                      {items.cta}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={prevSlide}
              className="bg-opacity-50 hover:bg-opacity-75 bg-velo-red absolute top-1/2 -left-4.5 z-20 hidden -translate-y-1/2 transform rounded-full p-2 text-white transition duration-300 md:block"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="bg-opacity-50 hover:bg-opacity-75 bg-velo-black absolute top-1/2 -right-4.5 hidden -translate-y-1/2 transform rounded-full p-2 text-white transition duration-300 md:block"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <img
            className="col-span-1 row-span-1 hidden h-full w-full rounded-full object-cover lg:block"
            src={img4}
            alt=""
          />
          <img
            className="col-span-1 row-span-1 hidden h-full w-full rounded-full object-cover lg:block"
            src={img2}
            alt=""
          />

          <div className="bg-velo-black text-velo-white col-span-2 row-span-1 hidden h-full w-full grid-cols-2 place-items-center rounded-[50px] lg:grid lg:gap-5 lg:p-8">
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
