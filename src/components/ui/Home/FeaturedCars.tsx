import { useState } from "react";
import CarCard from "../CarCard";
import SectionTitle from "../SectionTitle";
import { Button } from "../button";

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
    <div className="container my-10 md:my-14">
      <SectionTitle title="Featured Cars" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  md:grid-cols-3 ">
        {cars.slice(0, dataLength).map((car, index) => (
          <CarCard
            key={index}
            carName={car.name}
            image={car.image}
            price={car.price}
            category={car.category}
            brand={car.brand}
          />
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <div className={dataLength === cars.length ? "hidden" : ""}>
          <Button
            onClick={() => SetDataLength(cars.length)}
            className="bg-velo-red hover:bg-velo-maroon text-[15px] h-10"
          >
            View All Cars
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCars;
