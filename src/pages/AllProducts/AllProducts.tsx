import { useGetCarsQuery } from "@/redux/features/carPost/carApi";

const AllProducts = () => {
  const { data: allCarsData, isLoading, refetch } = useGetCarsQuery([]);

  if (isLoading) return <div>Loading...</div>;
  if (!allCarsData?.data) return <div>No cars found.</div>;

  return (
    <div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {allCarsData.data.map((car, index) => (
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
                  </span>
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  Brand: <span className="text-purple-700">{car.brand}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AllProducts;
