import CarImage from "@/assets/dummy/car-image.png";
import { RiInformation2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";

const Product = () => {
  const carData = {
    name: "Range Rover Vouge 2020",
    image: "link",
    stock: false,
    brandNew: true,
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
    description: {
      overview:
        "The 2020 Range Rover Evoque is a luxury compact SUV that combines sleek design with premium features and off-road capabilities. With its coupe-like silhouette, modern interior, and advanced tech, it's designed for both urban sophistication and rugged versatility. The Evoque 2020 is powered by a range of efficient turbocharged engines, including mild hybrid options, and comes with All-Wheel Drive as standard.",
      extensive: [
        {
          title: "Safety Features",
          description:
            "The 2020 Range Rover Evoque is engineered with an impressive suite of safety technologies to protect both driver and passengers. It includes features like Autonomous Emergency Braking, Lane Keep Assist, Blind Spot Monitoring, and a 360-degree Surround Camera system. Additionally, it offers a Driver Condition Monitor and rear traffic sensors, enhancing situational awareness and minimizing the risk of collisions in tight or busy environments.",
        },
        {
          title: "Engine & Performance",
          description:
            "Under the hood, the Evoque 2020 is powered by a selection of turbocharged petrol and diesel engines, some of which come with mild-hybrid technology for better efficiency and reduced emissions. The engines are paired with a smooth 9-speed automatic transmission, delivering refined acceleration. Standard all-wheel drive and Terrain Response 2 system ensure the Evoque performs confidently in all weather and road conditions, from city streets to muddy trails.",
        },
        {
          title: "Interior & Comfort",
          description:
            "Inside, the Evoque offers a sophisticated and contemporary cabin crafted with high-quality materials, including available leather and sustainable Eucalyptus textile options. Dual touchscreen displays provide a futuristic feel, while features like a panoramic sunroof, heated seats, and advanced climate control elevate comfort. The quiet, well-insulated interior ensures a serene driving experience, even on longer journeys.",
        },
        {
          title: "Technology & Connectivity",
          description:
            "The Evoque is equipped with cutting-edge tech to keep you connected and entertained. The Touch Pro Duo infotainment system features two high-resolution touchscreens that control everything from navigation to media. Apple CarPlay and Android Auto come standard, while advanced options like a Head-Up Display and Meridian premium audio system enhance the in-car experience. Over-the-air updates and in-car Wi-Fi further add to its modern appeal.",
        },
        {
          title: "Exterior Design",
          description:
            "Sleek, compact, and unmistakably Range Rover — the Evoque 2020 sports a coupe-inspired silhouette with flush deployable door handles, a sloping roofline, and slim LED headlights. Its clean lines and bold stance give it a distinctive, modern look that stands out both on the road and at rest. Available in a range of striking colors and trims, it offers a perfect blend of luxury and sporty styling.",
        },
        {
          title: "Off-Road Capabilities",
          description:
            "Despite its urban-friendly size, the Evoque holds true to its Land Rover roots with outstanding off-road capabilities. It features All-Wheel Drive, Hill Descent Control, and the Terrain Response 2 system, which automatically adapts to different driving conditions. With a class-leading wading depth of up to 600mm, it’s more than capable when the pavement ends, making it a great option for adventurous drivers.",
        },
        {
          title: "Fuel Efficiency",
          description:
            "Thanks to its efficient engine lineup and lightweight construction, the 2020 Evoque delivers competitive fuel economy for a luxury SUV. Depending on the engine variant, drivers can expect around 25–30 miles per gallon in combined driving. The inclusion of a mild-hybrid system in select models helps to further reduce fuel consumption, especially in stop-and-go city traffic.",
        },
        {
          title: "Cargo & Practicality",
          description:
            "While stylish, the Evoque doesn't compromise on practicality. The boot offers 591 liters of cargo space, expanding up to 1,383 liters with the rear seats folded down. It also features a powered tailgate for convenience, and 40:20:40 split-folding rear seats to accommodate a variety of passenger and cargo combinations. It's an ideal vehicle for both daily errands and weekend getaways.",
        },
      ],
    },
  };

  return (
    <section className="container my-5">
      <div className="flex flex-col md:flex-row items-center gap-5 lg:gap-10">
        <div className="min-w-[300px] lg:min-w-[500px] xl:min-w-[600px]">
          <img
            className="aspect-square w-full rounded-2xl object-cover"
            src={CarImage}
            alt="car-iamge"
          />
        </div>
        <div className="flex flex-col gap-6 xl:gap-10 py-5 w-full">
          {/* Name */}
          <h3 className="text-xl lg:text-3xl xl:text-4xl font-semibold">{carData.name}</h3>

          {/* Stock and Conditioin Status */}
          <div className="grid grid-cols-2 text-sm md:text-md xl:grid-cols-3 gap-5">
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
          <div className=" xl:my-7 space-y-2 text-sm lg:text-base lg:space-y-4">
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
          <Button className="!bg-velo-red hover:!bg-velo-black h-12 w-full cursor-pointer text-lg">
            Buy Now
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-7 mb-10">
        <h4 className="border-velo-maroon w-fit border-b-4 pb-2 text-3xl">
          Description
        </h4>

        <div className="text-velo-black mt-5">
          <p className="">{carData.description.overview}</p>

          {carData.description.extensive.map((eachDescription) => (
            <div className="mt-4 space-y-1.5">
              <h5 className="text-xl font-semibold">{eachDescription.title}</h5>
              <p className="text-gray-500">{eachDescription.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Product;
