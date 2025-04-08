import CarImage from "@/assets/dummy/car-image.png";

const Product = () => {
  const carData = {
    name: "Range Rover Vouge 2020",
    stock: true,
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
  };

  return (
    <section className="container my-5 flex gap-10">
      <div className="w-1/2">
        <img
          className="aspect-square w-full object-cover"
          src={CarImage}
          alt="car-iamge"
        />
      </div>
      <div>
        <h3 className="text-4xl font-bold">{carData.name}</h3>
        <div className="flex items-center gap-1 text-green-600">
          <div className="size-3 rounded-full bg-green-600" />
          <p className="font-semibold">In Stock</p>
        </div>
        <div className="space-y-4">
          {carData.carFeatures.map((carFeature) => (
            <div>
              <div className="inline-block w-40">
                <p className="font-semibold">{carFeature.feature}</p>{" "}
              </div>
              <span className="text-gray-500">{carFeature.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Product;
