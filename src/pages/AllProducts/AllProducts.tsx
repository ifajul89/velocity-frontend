import { useState, useEffect, Key } from "react";
import CarCardSkeleton from "@/components/ui/CarCardSkeleton";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsWidget } from "@/components/StatsWidget";
import CarCard from "@/components/ui/CarCard";

// Define Car interface
interface Car {
  name: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  _id: string;
}

const AllProducts = () => {
  const { data: allCarsData, isLoading } = useGetCarsQuery([]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;

  // Extract unique brands and categories for filter dropdowns
  const brands = allCarsData?.data
    ? [...new Set((allCarsData.data as Car[]).map((car) => car.brand))]
    : [];

  const categories = allCarsData?.data
    ? [...new Set((allCarsData.data as Car[]).map((car) => car.category))]
    : [];

  // Get highest price for range input
  const highestPrice = allCarsData?.data
    ? Math.max(...(allCarsData.data as Car[]).map((car) => car.price))
    : 200000;

  // Apply filters when data or filter values change
  useEffect(() => {
    if (!allCarsData?.data) return;

    let filtered = [...allCarsData.data] as Car[];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (car: Car) =>
          car.name.toLowerCase().includes(searchLower) ||
          car.brand.toLowerCase().includes(searchLower) ||
          car.category.toLowerCase().includes(searchLower),
      );
    }

    // Apply brand filter
    if (brandFilter && brandFilter !== "all") {
      filtered = filtered.filter((car: Car) => car.brand === brandFilter);
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((car: Car) => car.category === categoryFilter);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (car: Car) => car.price >= minPrice && car.price <= maxPrice,
    );

    setFilteredCars(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [
    allCarsData,
    searchTerm,
    minPrice,
    maxPrice,
    brandFilter,
    categoryFilter,
  ]);

  useEffect(() => {
    // Initialize filteredCars with all cars when data is loaded
    if (allCarsData?.data) {
      setFilteredCars(allCarsData.data as Car[]);
      // Set max price to the highest price in the dataset or default to 200000
      setMaxPrice(highestPrice);
    }
  }, [allCarsData, highestPrice]);

  const skeletonCount = 6; // Number of skeletons you want to show

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setMinPrice(0);
    setMaxPrice(highestPrice);
    setBrandFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  // const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <section className="container py-10">
      <SectionTitle title="All Cars" />

      {/* Stats Widget with improved styling */}
      <div className="mb-8">
        <StatsWidget />
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 rounded-lg bg-gray-50 p-4">
        <h3 className="text-lg font-semibold">Search & Filters</h3>

        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by brand, car name, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Filter */}
          <div>
            <label htmlFor="brandFilter" className="mb-1 block text-sm">
              Brand
            </label>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger id="brandFilter" className="w-full">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.sort().map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="categoryFilter" className="mb-1 block text-sm">
              Category
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="categoryFilter" className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.sort().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="rounded-md bg-red-600 px-4 py-2 text-white transition duration-200 hover:bg-red-700"
          >
            Reset Filters
          </button>
        </div>

        {/* Price Range Inputs */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="minPrice" className="mb-1 block text-sm">
              Min Price (USD)
            </label>
            <Input
              id="minPrice"
              type="number"
              min={0}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="mb-1 block text-sm">
              Max Price (USD)
            </label>
            <Input
              id="maxPrice"
              type="number"
              min={minPrice}
              max={highestPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-4">
        Showing {indexOfFirstCar + 1}-
        {Math.min(indexOfLastCar, filteredCars.length)} of {filteredCars.length}{" "}
        cars
      </p>

      {/* Car Grid */}
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
                _id: string;
              },
              index: Key | null | undefined,
            ) => (
              <CarCard
                key={index}
                _id={car._id}
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

      {/* Pagination */}
      {filteredCars.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`rounded-md px-3 py-2 ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current page
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const showEllipsisBefore =
                    index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter =
                    index < array.length - 1 && array[index + 1] !== page + 1;

                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsisBefore && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}

                      <button
                        onClick={() => paginate(page)}
                        className={`rounded-md px-3 py-2 ${
                          currentPage === page
                            ? "bg-red-600 text-white"
                            : "text-red-600 hover:bg-blue-50"
                        }`}
                      >
                        {page}
                      </button>

                      {showEllipsisAfter && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                    </div>
                  );
                })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`rounded-md px-3 py-2 ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </section>
  );
};

export default AllProducts;
