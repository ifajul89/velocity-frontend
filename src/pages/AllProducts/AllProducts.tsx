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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

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
      <Card className="mb-4 shadow-sm border border-gray-200">
        <CardContent className="p-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full md:w-[30%] flex-shrink-0">
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by brand, car name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 h-7 text-sm"
              />
            </div>
            
            {/* Brand Filter */}
            <div className="w-full md:w-[15%] flex-shrink-0">
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger id="brandFilter" className="w-full h-7 text-sm">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Tesla">Tesla</SelectItem>
                  <SelectItem value="Mazda">Mazda</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  <SelectItem value="Kia">Kia</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                  <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="Subaru">Subaru</SelectItem>
                  <SelectItem value="Lexus">Lexus</SelectItem>
                  {brands.filter(brand => 
                    !["Toyota", "Ford", "Honda", "Tesla", "Mazda", "Audi", "BMW", 
                      "Mercedes-Benz", "Chevrolet", "Hyundai", "Kia", "Nissan", 
                      "Volkswagen", "Subaru", "Lexus"].includes(brand)
                  ).sort().map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-[15%] flex-shrink-0">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="categoryFilter" className="w-full h-7 text-sm">
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
            
            {/* Price Inputs */}
            <div className="flex items-center gap-1 w-full md:w-[25%] flex-shrink-0">
              <span className="text-xs text-gray-600 flex-shrink-0">Price:</span>
              <Input
                type="number"
                value={minPrice || ""}
                min={0}
                max={maxPrice}
                onChange={(e) => {
                  const value = e.target.value === "" ? 0 : Number(e.target.value);
                  setMinPrice(value);
                }}
                className="h-7 text-xs flex-1"
                placeholder="Min"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">to</span>
              <Input
                type="number"
                value={maxPrice || ""}
                min={minPrice}
                max={highestPrice}
                onChange={(e) => {
                  const value = e.target.value === "" ? highestPrice : Number(e.target.value);
                  setMaxPrice(value);
                }}
                className="h-7 text-xs flex-1"
                placeholder="Max"
              />
            </div>
            
            {/* Reset Button */}
            <div className="w-full md:w-[12%] flex-shrink-0">
              <Button 
                onClick={resetFilters}
                className="w-full bg-velo-red hover:bg-velo-maroon h-7 text-xs font-medium"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 py-1.5 px-4 rounded text-xs">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{indexOfFirstCar + 1}-{Math.min(indexOfLastCar, filteredCars.length)}</span> of <span className="font-semibold">{filteredCars.length}</span> cars
        </p>
        {filteredCars.length > 0 && (
          <p className="text-gray-600">
            <span className="font-semibold">{brandFilter !== 'all' ? brandFilter : 'All brands'}</span> • 
            <span className="font-semibold ml-1">{categoryFilter !== 'all' ? categoryFilter : 'All categories'}</span>
          </p>
        )}
      </div>
      
      {/* Car Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
