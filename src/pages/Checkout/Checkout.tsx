import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CarImage from "@/assets/dummy/car-image.png";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product data from state
  const { product } = location.state || {};
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  
  // Order state
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle quantity changes with stock validation
  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > product.stockCount) {
      alert(`Sorry, only ${product.stockCount} units available`);
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      alert('Product not found');
      return;
    }

    // Validate stock again
    if (quantity > product.stockCount) {
      alert(`Sorry, only ${product.stockCount} units available`);
      return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Process order
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Order placed successfully!');
      navigate('/');
    }, 1500);
  };

  // If no product data, show error
  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Product Selected</h1>
        <p className="mb-6">Please go back and select a product to checkout.</p>
        <Button onClick={() => navigate('/product')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="flex items-start gap-4 mb-6">
              <img 
                src={CarImage} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: product.selectedColor }}
                  ></div>
                  <span className="text-sm text-gray-600">Selected Color</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                <span className={product.stock ? "text-green-600" : "text-red-600"}>●</span>
                {product.stock ? `${product.stockCount} in stock` : 'Out of stock'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Price:</span>
                <span>${product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Tax (5%):</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Shipping:</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6">Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              
              <div className="space-y-3">
                <div 
                  className={`flex items-center border rounded-md p-3 cursor-pointer ${
                    paymentMethod === 'credit' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('credit')}
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 mr-3">
                    {paymentMethod === 'credit' && (
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Credit Card</span>
                  </div>
                </div>
                
                <div 
                  className={`flex items-center border rounded-md p-3 cursor-pointer ${
                    paymentMethod === 'paypal' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('paypal')}
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 mr-3">
                    {paymentMethod === 'paypal' && (
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">PayPal</span>
                  </div>
                </div>
                
                <div 
                  className={`flex items-center border rounded-md p-3 cursor-pointer ${
                    paymentMethod === 'cash' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                  }`}
                  onClick={() => handlePaymentMethodChange('cash')}
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 mr-3">
                    {paymentMethod === 'cash' && (
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full !bg-purple-600 hover:!bg-purple-700 text-white h-12 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 