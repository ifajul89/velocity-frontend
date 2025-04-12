import { useGetCarsQuery } from "@/redux/features/carPost/carApi";

const AllProducts = () => {
  // Destructure the result from the query hook
  const {  data: allCarsData, isLoading,  refetch } = useGetCarsQuery([]);

  console.log(allCarsData);
  if (isLoading) return <div>Loading...</div>;

  // if (error) return <div>Error: {error.message}</div>;
  // refetch();

  return (
    <div>
      AllProducts {allCarsData.data?.length}
    </div>
  );
};

export default AllProducts;
