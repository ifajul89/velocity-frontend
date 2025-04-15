import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAllOrdersQuery } from "@/redux/features/order/order";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";

// Define types for our product data
interface ProductData {
  name: string;
  value: number;
}

// Using the correct API structure for Order
interface OrderProduct {
  product: {
    name: string;
    _id: string;
    // Other product fields
  };
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  // Other order fields as needed
}

// Type for chart label
interface LabelProps {
  cx: number | string;
  cy: number | string;
  midAngle: number;
  innerRadius: number | string;
  outerRadius: number | string;
  percent: number;
}

// Type for tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ProductData;
  }>;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const ProductChart = () => {
  // The auth token is automatically included via the baseApi prepareHeaders method
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const user = useSelector(currentUser); // Include user auth state
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return; // Only proceed if user is admin
    }
    
    try {
      // Calculate product distribution
      const productCounts: Record<string, number> = {};
      let totalCount = 0;

      // Type assertion to avoid errors since we know the structure
      (orders as Order[]).forEach((order) => {
        // Make sure products array exists
        if (order.products && Array.isArray(order.products)) {
          order.products.forEach((item) => {
            // Make sure we have access to the product name
            const productName = item.product?.name || 'Unknown Product';
            const quantity = item.quantity || 1;
            
            totalCount += quantity;
            
            if (productCounts[productName]) {
              productCounts[productName] += quantity;
            } else {
              productCounts[productName] = quantity;
            }
          });
        }
      });

      setTotalProducts(totalCount);

      // Convert product counts to array for chart
      const productDataArray = Object.entries(productCounts)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => b.value - a.value); // Sort by count (descending)

      setProductData(productDataArray);
    } catch (error) {
      console.error('Failed to process product data:', error);
      // Set default data if processing fails
      setProductData([
        { name: 'Product A', value: 2 },
        { name: 'Product B', value: 1 },
        { name: 'Product C', value: 1 },
        { name: 'Product D', value: 1 }
      ]);
      setTotalProducts(5);
    }
  }, [orders, user]);

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: LabelProps) => {
    if (!cx || !cy || !innerRadius || !outerRadius || !percent || !midAngle) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > Number(cx) ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(Number(percent) * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const totalValue = productData.reduce((sum, item) => sum + item.value, 0);
      const percent = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
      
      return (
        <div className="bg-white p-3 shadow-sm rounded-lg border border-gray-100">
          <p className="font-medium text-gray-700">{item.name}</p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">{item.value}</span> units
          </p>
          <p className="text-xs text-gray-500 mt-1">{percent.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-1.5 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Total Items Sold: <span className="text-purple-700 font-semibold">{totalProducts}</span></p>
        </div>
        <div className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-full">By Product</div>
      </div>
      <div className="flex-1 min-h-[200px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="75%"
                innerRadius="35%"
                paddingAngle={2}
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ 
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}; 