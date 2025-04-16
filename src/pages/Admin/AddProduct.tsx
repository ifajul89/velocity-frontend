import { Button } from "@/components/ui/button";
import { usePostCarMutation } from "@/redux/features/carPost/carApi";
import { TCar } from "@/redux/features/carPost/carSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddProduct() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TCar & { imageFile?: FileList }>();

  const [postCar] = usePostCarMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setValue("imageFile", e.target.files as FileList);
    }
  };

  const onSubmit = async (data: TCar & { imageFile?: FileList }) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Create data object with all car fields
      const carData = {
        name: data.name,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        category: data.category,
        description: data.description,
        quantity: data.quantity,
        inStock: data.inStock,
        image: data.image || "",
      };

      // Add the car data as a JSON string
      formData.append("data", JSON.stringify(carData));

      // Append image file if exists - using "file" as the field name to match backend
      if (data.imageFile && data.imageFile[0]) {
        formData.append("file", data.imageFile[0]);
      }

      const response = await postCar(formData).unwrap();
      if (response.statusCode === 200) {
        toast.success(response.message);
        reset();
      }

      setShowSuccess(true);
      setImagePreview(null);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to upload car. Please check your image and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-8 max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
      <div className="bg-velo-red px-8 py-6">
        <h2 className="flex items-center text-3xl font-bold text-white">
          Add New Car
        </h2>
      </div>

      {showSuccess && (
        <div className="mx-8 mt-6 mb-6 rounded border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
          <p className="font-medium">Success! Car added successfully.</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Car Name
              </label>
              <input
                {...register("name", { required: "Car name is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Brand
              </label>
              <select
                {...register("brand", { required: "Brand is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              >
                <option value="">Select a brand</option>
                <option value="Toyota">Toyota</option>
                <option value="Ford">Ford</option>
                <option value="Honda">Honda</option>
                <option value="Tesla">Tesla</option>
                <option value="Mazda">Mazda</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Nissan">Nissan</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Subaru">Subaru</option>
                <option value="Lexus">Lexus</option>
              </select>
              {errors.brand && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Model
              </label>
              <input
                {...register("model", { required: "Model is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.model.message}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                {...register("year", {
                  required: "Year is required",
                  min: { value: 1900, message: "Year must be after 1900" },
                  max: {
                    value: new Date().getFullYear(),
                    message: `Year cannot be in the future (max ${new Date().getFullYear()})`,
                  },
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Image */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.image.message}
                </p>
              )}

              {imagePreview && (
                <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Car preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 0, message: "Quantity cannot be negative" },
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="mt-6">
          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* In Stock */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="inStock"
              {...register("inStock")}
              className="bg-velo-red h-5 w-5 rounded"
            />
            <label htmlFor="inStock" className="ml-2 font-medium text-gray-700">
              Available in Stock
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-velo-red hover:bg-velo-maroon h-12 w-full md:text-lg"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Add Car"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
