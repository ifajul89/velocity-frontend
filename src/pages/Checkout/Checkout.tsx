import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, selectCheckoutUrl, selectOrderError, selectOrderLoading } from "@/redux/features/order/orderSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/redux/store";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // Get product and user data from state
  const { product, user } = location.state || {};

  // Redux state
  const isLoading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const checkoutUrl = useSelector(selectCheckoutUrl);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // Auto-fill user data when component mounts
  useEffect(() => {
    if (user) {
      // Split name into first and last name (assuming format is "First Last")
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
      }));
    }
  }, [user]);

  // Handle checkout URL redirect
  useEffect(() => {
    if (checkoutUrl) {
      toast.success("Order created successfully! Redirecting to payment...");
      console.log("Redirecting to payment URL:", checkoutUrl);
      
      // Force redirect to payment URL
      try {
        // Add small delay before redirecting to ensure toast is seen
        setTimeout(() => {
          console.log("Executing redirect to:", checkoutUrl);
          // Use window.open as a fallback if location.href doesn't work
          const result = window.location.replace(checkoutUrl);
          console.log("Redirect result:", result);
          
          // Fallback to window.open if replace doesn't work
          setTimeout(() => {
            if (window.location.href === checkoutUrl) {
              console.log("Redirect successful");
            } else {
              console.log("Redirect failed, trying window.open");
              window.open(checkoutUrl, '_self');
            }
          }, 500);
        }, 1000);
      } catch (err) {
        console.error("Error during redirect:", err);
        toast.error("Failed to redirect to payment page. Please try again.");
      }
    }
  }, [checkoutUrl]);

  // Display errors
  useEffect(() => {
    if (error) {
      console.error("Order creation error:", error);
      toast.error(`Order creation failed: ${error}`);
    }
  }, [error]);

  // Order state
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");

  // Handle quantity changes with stock validation
  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.stockCount) {
      toast.error(`Sorry, only ${product.stockCount} units available`);
      setQuantity(product.stockCount);
    } else {
      setQuantity(newQuantity);
    }
  };

  // Calculate totals
  const subtotal = product ? product.price * quantity : 0;
  const tax = subtotal * 0.05; // 5% tax
  const shipping = 250; // Fixed shipping cost
  const total = subtotal + tax + shipping;

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Validate stock again
    if (quantity > product.stockCount) {
      toast.error(`Sorry, only ${product.stockCount} units available`);
      return;
    }

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData],
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Get product ID from product object
    const productId = product._id || product.id;
    
    console.log("Product details:", product);
    console.log("Product ID being used:", productId);
    console.log("Total price calculated:", total);

    if (!productId) {
      toast.error("Invalid product ID. Please select a product again.");
      return;
    }

    // Prepare order data
    const orderData = {
      customerFirstName: formData.firstName,
      customerLastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      totalPrice: total,
      products: [
        {
          product: productId,
          quantity: quantity
        }
      ]
    };

    console.log("Sending order data:", orderData);

    // Dispatch order creation action
    dispatch(createOrder(orderData));
  };

  // If no product data, show error
  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Navbar />
        <h1 className="mb-4 text-2xl font-bold">No Product Selected</h1>
        <p className="mb-6">Please go back and select a product to checkout.</p>
        <Button onClick={() => navigate("/product")}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            <div className="mb-6 flex items-start gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                {product.selectedColor && (
                  <div className="mt-1 flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: product.selectedColor }}
                    ></div>
                    <span className="text-sm text-gray-600">Selected Color</span>
                  </div>
                )}
              </div>
            </div>

            {/* Car details */}
            <div className="mb-4 space-y-2 border-b border-gray-200 pb-4 text-sm">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span>{product.brand}</span>
                </div>
              )}
              {product.model && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span>{product.model}</span>
                </div>
              )}
              {product.year && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span>{product.year}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span>{product.category}</span>
                </div>
              )}
            </div>

            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <span
                  className={product.stock ? "text-green-600" : "text-red-600"}
                >
                  ●
                </span>
                {product.stock
                  ? `${product.stockCount} in stock`
                  : "Out of stock"}
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span>${product.price.toLocaleString()}</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Tax (5%):</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <h2 className="mb-6 text-xl font-bold">Your Information</h2>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium"
                >
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium"
                >
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium"
                >
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium"
              >
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                rows={3}
                required
              />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium"
                >
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="mb-1 block text-sm font-medium"
                >
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-3 text-lg font-semibold">Payment Method</h3>

              <div className="space-y-3">
                <div
                  className={`flex cursor-pointer items-center rounded-md border p-3 ${
                    paymentMethod === "sslcommerz"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("sslcommerz")}
                >
                  <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full border border-gray-400">
                    {paymentMethod === "sslcommerz" && (
                      <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">SSLCommerz</span>
                    <p className="text-sm text-gray-600">
                      Secure online payment gateway
                    </p>
                  </div>
                </div>

                <div
                  className={`flex cursor-pointer items-center rounded-md border p-3 ${
                    paymentMethod === "cash"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("cash")}
                >
                  <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full border border-gray-400">
                    {paymentMethod === "cash" && (
                      <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-600">
                      Pay when you receive
                    </p>
                  </div>
                </div>
              </div>

              {paymentMethod === "sslcommerz" && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm">
                    You will be redirected to SSLCommerz to complete your
                    payment securely.
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full !bg-purple-600 text-lg font-semibold text-white hover:!bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
