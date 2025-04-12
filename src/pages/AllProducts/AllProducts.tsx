import { useGetCarsQuery } from "@/redux/features/carPost/carApi";
// import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const AllProducts = () => {
  const { data: allCarsData, isLoading, refetch } = useGetCarsQuery([]);
  // const loadedCars = useLoaderData();
  // const [cars, setCars] = useState(loadedCars)

  if (isLoading) return <div>Loading...</div>;
  if (!allCarsData?.data) return <div>No cars found.</div>;

  return (
    <div>
      <h1 className="text-center text-5xl font-bold">All Cars</h1>
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
              <Link to={`/carDetails/${car._id}`}>
                <button className="rounded bg-purple-700 px-4 py-2 text-lg font-bold text-white transition duration-300 ease-in-out hover:bg-purple-800">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
