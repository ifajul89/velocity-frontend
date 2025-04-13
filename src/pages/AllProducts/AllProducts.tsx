import CarCard from "@/components/ui/CarCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";
import { Key } from "react";

const AllProducts = () => {
  const { data: allCarsData, isLoading } = useGetCarsQuery([]);

  if (isLoading) return <div>Loading...</div>;
  if (!allCarsData?.data) return <div>No cars found.</div>;

  return (
    <section className="container py-10">
      <SectionTitle title="All Cars" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allCarsData?.data.map(
          (
            car: {
              name: string;
              image: string;
              price: number;
              category: string;
              brand: string;
              _id:string;
            },
            index: Key | null | undefined,
          ) => (
            <CarCard
              key={index}
              carName={car.name}
              image={car.image}
              price={car.price}
              category={car.category}
              brand={car.brand}
              _id={car._id}
            />
          ),
        )}
      </div>
    </section>
  );
};

export default AllProducts;
