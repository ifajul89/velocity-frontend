import { useState } from "react";
import CarCard from "../CarCard";
import SectionTitle from "../SectionTitle";
import { Button } from "../button";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";
import Loading from "../../shared/Loading";
import { useNavigate } from "react-router-dom";

// Define Car interface
interface Car {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  brand: string;
}

const FeaturedCars = () => {
  const { data: carsData, isLoading, isError } = useGetCarsQuery([]);
  const [dataLength] = useState(6);
  const navigate = useNavigate();
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (isError || !carsData?.data) {
    return <div className="container my-10 text-center">Failed to load cars. Please try again later.</div>;
  }
  
  const cars: Car[] = carsData.data;
  
  const handleViewAllCars = () => {
    navigate("/all-cars");
  };
  
  return (
    <div className="container my-10 md:my-14">
      <SectionTitle title="Featured Cars" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {cars.slice(0, dataLength).map((car: Car, index: number) => (
          <CarCard
            key={car._id || index}
            carName={car.name}
            image={car.image}
            price={car.price}
            category={car.category}
            brand={car.brand}
            _id={car._id}
          />
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          onClick={handleViewAllCars}
          className="bg-velo-red hover:bg-velo-maroon h-10 text-[15px]"
        >
          View All Cars
        </Button>
      </div>
    </div>
  );
};

export default FeaturedCars;
