import { useState } from "react";

const cars = [
  {
    name: "Camry",
    brand: "Toyota",
    price: 30000,
    category: "Sedan",
    description: "A modern, reliable sedan.",
    quantity: 10,
    inStock: true,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/c-005-1500x1000-1652713137.jpg",
  },
  {
    name: "F-150",
    brand: "Ford",
    price: 45000,
    category: "Truck",
    description: "America's favorite full-size pickup truck.",
    quantity: 8,
    inStock: true,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-lariat-exterior-101-64ff7459abf73.jpg?crop=0.793xw:0.771xh;0.135xw,0.188xh&resize=1200:*",
  },
  {
    name: "Model 3",
    brand: "Tesla",
    price: 42000,
    category: "Electric",
    description: "An all-electric sedan with cutting-edge features.",
    quantity: 5,
    inStock: true,
    image:
      "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2024/03/1218165-20.jpg?q=50&fit=crop&w=825&dpr=1.5",
  },
  {
    name: "CX-5",
    brand: "Mazda",
    price: 31000,
    category: "SUV",
    description: "A stylish and sporty compact SUV.",
    quantity: 7,
    inStock: true,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2025-mazda-cx-5-front-three-quarters-2-67a23acb1d56f.jpg?crop=0.587xw:0.567xh;0.343xw,0.374xh&resize=1200:*",
  },
  {
    name: "Civic Type R",
    brand: "Honda",
    price: 43000,
    category: "Sports",
    description: "A high-performance version of the classic Civic.",
    quantity: 4,
    inStock: true,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR7UZcN_5wcMBUIekVMNNdX6uQnc1debdlAw&s",
  },
  {
    name: "A6",
    brand: "Audi",
    price: 55000,
    category: "Luxury",
    description: "A sleek and sophisticated executive sedan.",
    quantity: 3,
    inStock: true,
    image:
      "https://media.audi.com/is/image/audi/nemo/models/a6/a6-limousine/my-2024/stage/AA6_L_181012_3-L.jpg",
  },
  {
    name: "CX-5",
    brand: "Mazda",
    price: 31000,
    category: "SUV",
    description: "A stylish and sporty compact SUV.",
    quantity: 7,
    inStock: true,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2025-mazda-cx-5-front-three-quarters-2-67a23acb1d56f.jpg?crop=0.587xw:0.567xh;0.343xw,0.374xh&resize=1200:*",
  },
  {
    name: "Civic Type R",
    brand: "Honda",
    price: 43000,
    category: "Sports",
    description: "A high-performance version of the classic Civic.",
    quantity: 4,
    inStock: true,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR7UZcN_5wcMBUIekVMNNdX6uQnc1debdlAw&s",
  },
  {
    name: "F-150",
    brand: "Ford",
    price: 45000,
    category: "Truck",
    description: "America's favorite full-size pickup truck.",
    quantity: 8,
    inStock: true,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-lariat-exterior-101-64ff7459abf73.jpg?crop=0.793xw:0.771xh;0.135xw,0.188xh&resize=1200:*",
  },
];

const FeaturedCars = () => {
  const [dataLength, SetDataLength] = useState(6);
  return (
    <div className="container mx-auto my-10 py-8">
      <h2 className="text-center text-4xl font-bold text-purple-700">
        Featured Cars
      </h2>
      <p className="my-3 text-center text-xl font-semibold text-purple-700">
        Explore our top picks across all categories – handpicked for
        performance, style, and value.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cars.slice(0, dataLength).map((car, index) => (
          <div
            key={index}
            className="mb-4 flex flex-col rounded-lg bg-white p-4 shadow-lg"
          >
            <img
              src={car.image}
              alt={car.name}
              className="h-full w-full rounded-lg"
            />
            <div className="mt-3 md:ml-4">
              <h3 className="text-xl font-bold">
                Model: <span className="text-purple-700">{car.name}</span>
              </h3>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                Price: ${car.price}
              </p>
              <div className="my-2 flex flex-col gap-2 md:flex-row md:gap-5">
                <p className="text-lg font-semibold text-gray-600">
                  Category:{" "}
                  <span className="rounded-lg border-2 border-purple-700 p-1 text-purple-500">
                    {car.category}
                  </span>{" "}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  Brand: <span className="text-purple-700">{car.brand}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <div className={dataLength === cars.length ? "hidden" : ""}>
          <button
            onClick={() => SetDataLength(cars.length)}
            className="rounded bg-purple-700 px-4 py-2 text-lg font-bold text-white transition duration-300 ease-in-out hover:bg-purple-800"
          >
            View All Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCars;
