import CarCard from "@/components/ui/CarCard";
import CarCardSkeleton from "@/components/ui/CarCardSkeleton";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";
import { Key } from "react";

const AllProducts = () => {
  const { data: allCarsData, isLoading } = useGetCarsQuery([]);

  const skeletonCount = 6; // Number of skeletons you want to show

  return (
    <section className="container py-10">
      <SectionTitle title="All Cars" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <CarCardSkeleton key={i} />
          ))
        ) : allCarsData?.data?.length ? (
          allCarsData.data.map(
            (
              car: {
                name: string;
                image: string;
                price: number;
                category: string;
                brand: string;
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
              />
            ),
          )
        ) : (
          <div>No cars found.</div>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
