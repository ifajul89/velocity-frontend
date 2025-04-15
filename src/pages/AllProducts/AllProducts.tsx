import { useState, useEffect } from "react";
import CarCard from "@/components/ui/CarCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Define Car interface
interface Car {
  name: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  _id: string;
}

// Standard vehicle categories
const standardCategories = ["Sedan", "SUV", "Truck", "Coupe", "Convertible"];

// Standard car brands
const standardBrands = [
  "Toyota", 
  "Ford", 
  "Honda", 
  "Tesla", 
  "Mazda", 
  "Audi", 
  "BMW", 
  "Mercedes-Benz", 
  "Chevrolet", 
  "Hyundai", 
  "Kia", 
  "Nissan", 
  "Volkswagen", 
  "Subaru", 
  "Lexus"
];

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
    ? [...new Set((allCarsData.data as Car[]).map(car => car.brand))]
    : [];
    
  const categories = allCarsData?.data 
    ? [...new Set((allCarsData.data as Car[]).map(car => car.category))]
    : [];
    
  // Get highest price for range input
  const highestPrice = allCarsData?.data 
    ? Math.max(...(allCarsData.data as Car[]).map(car => car.price))
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
          car.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply brand filter
    if (brandFilter && brandFilter !== "all") {
      filtered = filtered.filter(
        (car: Car) => car.brand === brandFilter
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(
        (car: Car) => car.category === categoryFilter
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      (car: Car) => car.price >= minPrice && car.price <= maxPrice
    );
    
    setFilteredCars(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [allCarsData, searchTerm, minPrice, maxPrice, brandFilter, categoryFilter]);

  useEffect(() => {
    // Initialize filteredCars with all cars when data is loaded
    if (allCarsData?.data) {
      setFilteredCars(allCarsData.data as Car[]);
      // Set max price to the highest price in the dataset or default to 200000
      setMaxPrice(highestPrice);
    }
  }, [allCarsData, highestPrice]);

  if (isLoading) return <div>Loading...</div>;
  if (!allCarsData?.data) return <div>No cars found.</div>;

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
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <section className="container py-10">
      <SectionTitle title="All Cars" />
      
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 p-4 bg-gray-50 rounded-lg">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brand Filter */}
          <div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {/* Standard brands */}
                {standardBrands.map((brand, index) => (
                  <SelectItem key={`standard-brand-${index}`} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
                {/* Brands from data (if not already included in standard brands) */}
                {brands
                  .filter(brand => !standardBrands.includes(brand))
                  .map((brand, index) => (
                    <SelectItem key={`data-brand-${index}`} value={brand}>
                      {brand}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {/* Category Filter */}
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {/* Standard categories */}
                {standardCategories.map((category, index) => (
                  <SelectItem key={`standard-category-${index}`} value={category}>
                    {category}
                  </SelectItem>
                ))}
                {/* Categories from data (if not already included in standard categories) */}
                {categories
                  .filter(category => !standardCategories.includes(category))
                  .map((category, index) => (
                    <SelectItem key={`data-category-${index}`} value={category}>
                      {category}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset Button */}
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
          >
            Reset Filters
          </button>
        </div>
        
        {/* Price Range Inputs */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block mb-1 text-sm">Min Price (USD)</label>
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
            <label htmlFor="maxPrice" className="block mb-1 text-sm">Max Price (USD)</label>
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
        Showing {indexOfFirstCar + 1}-{Math.min(indexOfLastCar, filteredCars.length)} of {filteredCars.length} cars
      </p>
      
      {/* Car Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentCars.length > 0 ? (
          currentCars.map((car) => (
            <CarCard
              key={car._id}
              carName={car.name}
              image={car.image}
              price={car.price}
              category={car.category}
              brand={car.brand}
              _id={car._id}
            />
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            No cars match your search criteria. Try adjusting your filters.
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredCars.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current page
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                  
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsisBefore && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      
                      <button
                        onClick={() => paginate(page)}
                        className={`px-3 py-2 rounded-md ${
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
              className={`px-3 py-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
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
