import CarImage from "@/assets/dummy/car-image.png";
import { RiInformation2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  
  const carData = {
    id: 1,
    name: "Range Rover Vouge 2020",
    stock: true,
    brandNew: true,
    price: 85000,
    stockCount: 1,
    carFeatures: [
      {
        feature: "Safety",
        description: "Dual front airbags",
      },
      {
        feature: "Efficiency",
        description: "Fuel-saving engine",
      },
      {
        feature: "Comfort",
        description: "Spacious cabin",
      },
      {
        feature: "Technology",
        description: "Touchscreen display",
      },
      {
        feature: "Performance",
        description: "Reliable engine",
      },
      {
        feature: "Value",
        description: "Strong resale price",
      },
    ],
    colors: ["#c1121f", "#669bbc"],
    description: {},
  };

  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        product: {
          ...carData,
          selectedColor: carData.colors[0] // Default to first color
        } 
      }
    });
  };

  return (
    <section className="container my-5 flex items-center gap-10">
      <div className="w-1/2">
        <img
          className="aspect-square w-full rounded-2xl object-cover"
          src={CarImage}
          alt="car-iamge"
        />
      </div>
      <div className="flex flex-col gap-8 py-5">
        {/* Name */}
        <h3 className="text-4xl font-semibold">{carData.name}</h3>

        {/* Stock and Conditioin Status */}
        <div className="grid grid-cols-3 gap-5">
          <div
            className={`flex items-center gap-1 ${carData.stock ? "text-green-600" : "text-red-700"}`}
          >
            <div
              className={`size-3 rounded-full ${carData.stock ? "bg-green-600" : "bg-red-700"}`}
            />
            <p className="font-medium">
              {carData.stock ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          <p className="flex items-center gap-1 text-gray-500">
            <RiInformation2Line />{" "}
            {carData.brandNew ? "Brand New" : "Pre-Owned"}
          </p>
        </div>

        {/* Features */}
        <div className="my-7 space-y-4">
          {carData.carFeatures.map((carFeature) => (
            <div>
              <div className="inline-block w-40">
                <p className="font-semibold">{carFeature.feature}</p>{" "}
              </div>
              <span className="text-gray-500">{carFeature.description}</span>
            </div>
          ))}
        </div>

        {/* Color */}
        <div className="flex items-center gap-3">
          <h5 className="text-velo-black text-xl font-semibold">
            Pick a Color <span className="text-red-700">*</span>
          </h5>
          <div className="flex w-fit rounded-[12px] border-2 p-0.5">
            {carData.colors.map((color) => (
              <div
                className={`hover:border-velo-black cursor-pointer rounded-lg border-2 border-transparent p-0.5 duration-300`}
              >
                <div
                  style={{ backgroundColor: color }}
                  className={`h-5 w-10 rounded-[6px]`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy Now Button */}
        <Button 
          onClick={handleBuyNow}
          className="!bg-velo-red hover:!bg-velo-black h-12 w-full cursor-pointer text-lg"
        >
          Buy Now
        </Button>
      </div>
    </section>
  );
};

export default Product;
