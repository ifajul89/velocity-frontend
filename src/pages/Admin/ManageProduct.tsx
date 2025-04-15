import React, { useState } from "react";
import { Pencil, Trash2, X, Menu, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetCarsQuery, useUpdateCarMutation, useDeleteCarMutation } from "@/redux/features/carPost/carApi";
import { toast } from "sonner";

// Define Car type
interface Car {
  _id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  quantity: number;
  image: string;
}

const ManageProduct = () => {
  // Fetch cars data using the API
  const { data: carsData, isLoading, isError } = useGetCarsQuery([]);
  
  // RTK Query mutations
  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Add state for image preview and file
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add state for mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this car?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes",
        onClick: async () => {
          toast.promise(
            async () => {
              await deleteCar(id).unwrap();
              return true;
            },
            {
              loading: 'Deleting car...',
              success: 'Car deleted successfully',
              error: 'Failed to delete car. Please try again.',
            }
          );
        }
      },
      cancel: {
        label: "No",
        onClick: () => {
          // Do nothing when No is clicked
        }
      },
      duration: 5000, // Show for 5 seconds
    });
  };

  const handleEdit = (car: Car) => {
    setEditingCar({ ...car });
    setImagePreview(car.image); // Set initial image preview from car data
    setImageFile(null); // Reset file input when opening edit modal
    setIsEditModalOpen(true);
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);

    // Also update the car's image property to indicate it has been changed
    if (editingCar) {
      setEditingCar({
        ...editingCar,
        image: 'new-image-to-be-uploaded'
      });
    }
  };

  const handleSave = async () => {
    if (editingCar) {
      try {
        // Create a FormData object to handle the file upload
        const formData = new FormData();

        // Create car data object 
        const carData = {
          name: editingCar.name,
          brand: editingCar.brand,
          price: editingCar.price,
          category: editingCar.category,
          quantity: editingCar.quantity,
          image: editingCar.image
        };

        // Add the car data as JSON
        formData.append("data", JSON.stringify(carData));

        // If there's a new image file, add it to the form data
        if (imageFile) {
          formData.append("file", imageFile);
        }

        // Make the API call to update the car
        await updateCar({
          id: editingCar._id,
          data: formData
        }).unwrap();
        
        toast.success("Car updated successfully");

        setIsEditModalOpen(false);
        setEditingCar(null);
        setImagePreview(null);
        setImageFile(null);
      } catch (error) {
        console.error("Error updating car:", error);
        toast.error("Failed to update car. Please try again.");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!editingCar) return;

    const { name, value } = e.target;

    const updatedValue =
      name === "price" || name === "quantity" ? Number(value) : value;

    setEditingCar({
      ...editingCar,
      [name]: updatedValue,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter cars based on search query
  const filteredCars = carsData?.data
    ? (carsData.data as Car[]).filter(
        (car) =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];
    
  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen w-full overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileSidebar}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <p className="text-gray-500">
              View, edit, and delete cars in your inventory
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="bg-opacity-50 fixed inset-0 bg-black"
            onClick={toggleMobileSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-lg">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-blue-600 p-1 text-white">
                  <span className="text-xl font-bold">V</span>
                </div>
                <h1 className="text-xl font-bold">Velocity</h1>
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/products"
                    className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-blue-600"
                  >
                    <span>Manage Products</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Orders Management</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Profile Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            className="w-full rounded-lg border border-gray-300 p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
          <svg
            className="absolute top-3.5 left-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="rounded bg-yellow-400 p-1">🚗</span>
            Manage Cars
          </h2>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="text-center">
                <p>Loading cars...</p>
                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              Error loading cars. Please try again later.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 font-semibold text-gray-600">
                  <tr>
                    <th className="hidden px-4 py-3 sm:table-cell">#</th>
                    <th className="px-4 py-3">Car Name</th>
                    <th className="hidden px-4 py-3 md:table-cell">Brand</th>
                    <th className="px-4 py-3">Price ($)</th>
                    <th className="hidden px-4 py-3 lg:table-cell">Category</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                    <th className="hidden px-4 py-3 md:table-cell">Quantity</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((car, idx) => (
                      <tr key={car._id} className="border-t hover:bg-gray-50">
                        <td className="hidden px-4 py-3 sm:table-cell">
                          {indexOfFirstItem + idx + 1}
                        </td>
                        <td className="px-4 py-3">{car.name}</td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          {car.brand}
                        </td>
                        <td className="px-4 py-3">${car.price}</td>
                        <td className="hidden px-4 py-3 lg:table-cell">
                          {car.category}
                        </td>
                        <td
                          className={`hidden px-4 py-3 sm:table-cell ${
                            car.quantity > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {car.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          {car.quantity}
                        </td>
                        <td className="flex justify-center gap-2 px-4 py-3 text-center">
                          <button
                            disabled={isUpdating}
                            onClick={() => handleEdit(car)}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            disabled={isDeleting}
                            onClick={() => handleDelete(car._id)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No cars found.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t bg-gray-50">
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-sm text-gray-500">
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCars.length)} of {filteredCars.length} cars
                    </td>
                  </tr>
                  {totalPages > 1 && (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex items-center justify-center py-4">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                            >
                              Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`rounded-md px-3 py-1 text-sm ${
                                  currentPage === page
                                    ? "bg-red-600 text-white"
                                    : "border border-gray-300"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && editingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl transition-all animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">Edit Car Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-6">
                {/* Image upload section - improved design */}
                <div className="mb-3">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Car Image
                  </label>
                  
                  {/* Image preview */}
                  {imagePreview ? (
                    <div className="relative mb-4 rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-sm">
                      <div className="relative h-56 w-full overflow-hidden rounded-md">
                        <img
                          src={imagePreview}
                          alt="Car preview"
                          className="h-full w-full object-cover transition-all hover:scale-105 duration-300"
                        />
                        <button
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 rounded-full bg-gray-800 bg-opacity-70 p-1.5 text-white hover:bg-opacity-90 transition-all"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors h-56 ${
                        isDragging 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="mb-3 h-10 w-10 text-gray-400" />
                      <p className="mb-2 text-sm font-medium text-gray-700">Drag & drop an image here, or</p>
                      <label className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm">
                        Browse Files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-3 text-xs text-gray-500">PNG, JPG, or JPEG (max. 5MB)</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Car Name
                    </label>
                    <input
                      name="name"
                      value={editingCar.name}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                      placeholder="Enter car name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Brand
                    </label>
                    <input
                      name="brand"
                      value={editingCar.brand}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                      placeholder="Enter brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        name="price"
                        type="number"
                        value={editingCar.price}
                        onChange={handleInputChange}
                        className="rounded-md border border-gray-300 pl-8 pr-3 py-2.5 text-sm w-full focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      name="quantity"
                      type="number"
                      value={editingCar.quantity}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editingCar.category}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm appearance-none bg-white"
                  >
                    <option value="">Select category</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
