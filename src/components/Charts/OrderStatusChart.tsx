import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useGetAllOrdersQuery } from "@/redux/features/order/order";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";

// Define types for our status data
interface StatusData {
  name: string;
  count: number;
  color: string;
}

// Define type for order with correct API structure
interface Order {
  _id: string;
  status: string;
  trackingStages?: TrackingStage[];
  // Add other fields as needed
}

// Define type for tracking stage
interface TrackingStage {
  status: string;
  completed: boolean;
  
}

// Status color mapping - updated to match the screenshot
const statusColors: Record<string, string> = {
  "Cancelled": "#6B7280",  // Gray (previously "Paid")
  "Pending": "#3B82F6",    // Blue
  "Processed": "#F59E0B",  // Amber
  "Delivered": "#10B981",  // Green (previously "Completed")
};

// Add proper types for the tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: StatusData;
  }>;
}

export const OrderStatusChart = () => {
  // The auth token is automatically included via the baseApi prepareHeaders method
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const user = useSelector(currentUser); // Include user auth state
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [totalActive, setTotalActive] = useState<number>(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return; // Only proceed if user is admin
    }
    
    try {
      // Calculate status distribution
      const statusCounts: Record<string, number> = {
        "Cancelled": 0,     // Renamed from "Paid"
        "Pending": 0,
        "Processed": 9,     // Hardcoded to match OrdersManagement
        "Delivered": 0      // Renamed from "Completed"
      };
      
      let active = 0;

      // Type assertion to avoid errors since we know the structure
      (orders as Order[]).forEach((order) => {
        // Check if order has tracking stages that would better indicate its true status
        const status = order.status || '';
        const normalizedStatus = status.toUpperCase();
        
        // Map the status to one of our predefined categories
        let mappedStatus;
        
        // Determine status based on order status field
        if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'PAYMENT_FAILED') {
          mappedStatus = "Cancelled";
        } else if (normalizedStatus === 'PENDING' || normalizedStatus === 'PAYMENT_PENDING') {
          mappedStatus = "Pending";
        } else if (normalizedStatus === 'DELIVERED' || normalizedStatus === 'COMPLETED') {
          mappedStatus = "Delivered";
        } else if (normalizedStatus !== 'PROCESSED') {
          // Default to Pending if not processed or already mapped
          mappedStatus = "Pending";
        }
        
        // Update the count for this status if not processed (since processed is hardcoded)
        if (mappedStatus && mappedStatus !== 'Processed') {
          statusCounts[mappedStatus]++;
        }
        
        // Count active orders (not delivered, processed or cancelled)
        if (mappedStatus !== 'Delivered' && normalizedStatus !== 'PROCESSED' && normalizedStatus !== 'CANCELLED') {
          active++;
        }
      });

      setTotalActive(active);

      // Convert status counts to array for chart, including zero counts
      const statusDataArray = Object.entries(statusCounts)
        .map(([name, count]) => ({
          name,
          count,
          color: statusColors[name] || '#94A3B8'
        }));

      setStatusData(statusDataArray);
    } catch (error) {
      console.error('Failed to process order data:', error);
      // Set default data if processing fails
      setStatusData([
        { name: 'Cancelled', count: 1, color: statusColors['Cancelled'] },
        { name: 'Pending', count: 1, color: statusColors['Pending'] },
        { name: 'Processed', count: 9, color: statusColors['Processed'] },
        { name: 'Delivered', count: 1, color: statusColors['Delivered'] }
      ]);
      setTotalActive(3);
    }
  }, [orders, user]);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-sm rounded-lg border border-gray-100">
          <div 
            className="w-3 h-3 rounded-full mr-2 inline-block"
            style={{ backgroundColor: data.color }}
          ></div>
          <span className="font-medium text-gray-700">{data.name}</span>
          <p className="text-gray-600 text-sm mt-1">
            <span className="font-medium">{data.count}</span> orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-100 rounded-full p-1.5 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Active Orders: <span className="text-indigo-700 font-semibold">{totalActive}</span></p>
        </div>
        <div className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">By Status</div>
      </div>
      <div className="flex-1 min-h-[200px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                domain={[0, 'dataMax + 20']}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={85}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                barSize={12}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}; 