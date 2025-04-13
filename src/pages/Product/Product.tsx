import { RiInformation2Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { useLoaderData, useNavigate, Navigate } from "react-router-dom";
import Navbar from "@/components/ui/shared/Navbar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";

interface CarFeature {
  feature: string;
  description: string;
}

interface DescriptionSection {
  title: string;
  description: string;
}

interface CarData {
  name: string;
  image: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  category?: string;
  description: string | {
    brief?: string;
    extensive?: DescriptionSection[];
  };
  quantity?: number;
  inStock: boolean;
  brandNew?: boolean;
  carFeatures?: CarFeature[];
  colors?: string[];
  _id?: string;
  id?: string;
}

interface LoaderData {
  data?: CarData;
  redirect?: string;
  message?: string;
  error?: boolean;
}

const Product = () => {
  const loadedData = useLoaderData() as LoaderData;
  const [cars, setCars] = useState(loadedData);
  const navigate = useNavigate();
  const user = useSelector(currentUser);

  useEffect(() => {
    if (loadedData) {
      setCars(loadedData);
      
      // If there's a message, show a toast notification
      if (loadedData.message) {
        if (loadedData.error) {
          toast.error(loadedData.message);
        } else {
          toast.info(loadedData.message);
        }
      }
    }
  }, [loadedData]);

  // Handle redirect from loader
  if (loadedData.redirect) {
    return <Navigate to={loadedData.redirect} />;
  }

  // Handle error from loader
  if (loadedData.error) {
    return (
      <div>
        <Navbar />
        <div className="container my-6 mt-15 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading product</p>
            <Button onClick={() => navigate("/")} className="!bg-velo-red hover:!bg-velo-black">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const carData = cars?.data;

  if (!carData) {
    return (
      <div>
        <Navbar />
        <div className="container my-6 mt-15 flex items-center justify-center min-h-[50vh]">
          <p>Loading product information...</p>
        </div>
      </div>
    );
  }

  const {
    name,
    image,
    inStock,
    model,
    price,
    brand,
    quantity,
    year,
    description,
    brandNew,
    carFeatures,
    colors,
    category
  } = carData;

  const handleBuyNow = () => {
    // Check if we have the car data with _id
    if (!carData || !carData._id) {
      toast.error("Product information is incomplete. Please try again.");
      return;
    }

    console.log("Car data being sent to checkout:", carData);

    navigate("/checkout", {
      state: {
        product: {
          _id: carData._id, // Make sure to pass the MongoDB ID
          id: carData._id,  // Fallback ID
          name: name,
          price: price || 0,
          selectedColor: colors?.[0] || "#000000",
          stock: inStock,
          stockCount: quantity || 1,
          image: image,
          brand: brand,
          model: model,
          year: year,
          category: category,
          description: typeof description === 'string' ? description : description?.brief || ''
        },
        user: user
      }
    });
  };

  return (
    <div>
      <Navbar />
      <section className="container my-6 mt-15">
        <div className="flex flex-col items-center gap-5 md:flex-row lg:gap-10">
          <div className="min-w-[300px] lg:min-w-[500px] xl:min-w-[600px]">
            <img
              className="aspect-square w-full rounded-2xl object-cover"
              src={image}
              alt="car-image"
            />
          </div>

          <div className="flex w-full flex-col gap-6 py-5 xl:gap-10">
            <h3 className="text-xl font-semibold lg:text-3xl xl:text-4xl">
              {name}
            </h3>

            <div className="grid grid-cols-2 gap-5 text-sm md:text-md xl:grid-cols-3">
              <div
                className={`flex items-center gap-1 ${
                  inStock ? "text-green-600" : "text-red-700"
                }`}
              >
                <div
                  className={`size-3 rounded-full ${
                    inStock ? "bg-green-600" : "bg-red-700"
                  }`}
                />
                <p className="font-medium">
                  {inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>

              <p className="flex items-center gap-1 text-gray-500">
                <RiInformation2Line />
                {brandNew !== undefined
                  ? brandNew
                    ? "Brand New"
                    : "Pre-Owned"
                  : ""}
              </p>
            </div>

            <div className="space-y-2 text-sm lg:space-y-4 lg:text-base">
              {brand && (
                <div>
                  <div className="inline-block w-40">
                    <p className="font-semibold">Brand</p>
                  </div>
                  <span className="text-gray-500">{brand}</span>
                </div>
              )}
              
              {model && (
                <div>
                  <div className="inline-block w-40">
                    <p className="font-semibold">Model</p>
                  </div>
                  <span className="text-gray-500">{model}</span>
                </div>
              )}
              
              {category && (
                <div>
                  <div className="inline-block w-40">
                    <p className="font-semibold">Category</p>
                  </div>
                  <span className="text-gray-500">{category}</span>
                </div>
              )}
              
              {year && (
                <div>
                  <div className="inline-block w-40">
                    <p className="font-semibold">Year</p>
                  </div>
                  <span className="text-gray-500">{year}</span>
                </div>
              )}
              
              {price !== undefined && (
                <div>
                  <div className="inline-block w-40">
                    <p className="font-semibold">Price</p>
                  </div>
                  <span className="text-gray-500">${price?.toLocaleString()}</span>
                </div>
              )}
              
              {quantity !== undefined && (
                <div>
                  <div className="inline-block w-40">
                    <p className="font-semibold">Available Units</p>
                  </div>
                  <span className="text-gray-500">{quantity}</span>
                </div>
              )}
            </div>

            {carFeatures && carFeatures.length > 0 && (
              <div className="space-y-2 text-sm lg:space-y-4 lg:text-base xl:my-7">
                {carFeatures.map((carFeature: CarFeature, index: number) => (
                  <div key={index}>
                    <div className="inline-block w-40">
                      <p className="font-semibold">{carFeature.feature}</p>
                    </div>
                    <span className="text-gray-500">
                      {carFeature.description}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {colors && colors.length > 0 && (
              <div className="flex items-center gap-3">
                <h5 className="text-velo-black text-xl font-semibold">
                  Pick a Color <span className="text-red-700">*</span>
                </h5>
                <div className="flex w-fit rounded-[12px] border-2 p-0.5">
                  {colors.map((color: string, index: number) => (
                    <div
                      key={index}
                      className={`hover:border-velo-black cursor-pointer rounded-lg border-2 border-transparent p-0.5 duration-300`}
                    >
                      <div
                        style={{ backgroundColor: color }}
                        className={`h-5 w-10 rounded-[6px]`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleBuyNow}
              className="!bg-velo-red hover:!bg-velo-black h-12 w-full cursor-pointer text-lg"
            >
              Buy Now
            </Button>
          </div>
        </div>

        <div className="mt-7 mb-10">
          <h4 className="border-velo-maroon w-fit border-b-4 pb-2 text-3xl">
            Description
          </h4>

          <div className="text-velo-black mt-5">
            {typeof description === "string" ? (
              <p>{description}</p>
            ) : (
              <>
                {description.brief && <p>{description.brief}</p>}
                {description.extensive?.map((desc, index) => (
                  <div key={index} className="mt-4 space-y-1.5">
                    <h5 className="text-xl font-semibold">{desc.title}</h5>
                    <p className="text-gray-500">{desc.description}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;