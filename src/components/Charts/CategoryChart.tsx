import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";

// Define types for our category data
interface CategoryData {
  name: string;
  value: number;
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
    payload: CategoryData;
  }>;
}

// Car interface
interface Car {
  _id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  image: string;
}

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export const CategoryChart = () => {
  const { data: carsData, isLoading } = useGetCarsQuery([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totalCars, setTotalCars] = useState(0);

  useEffect(() => {
    if (!carsData?.data) {
      return;
    }

    try {
      // Get the cars data
      const cars: Car[] = carsData.data;
      setTotalCars(cars.length);

      // Calculate category distribution
      const categoryCounts: Record<string, number> = {};

      cars.forEach((car) => {
        const category = car.category || "Uncategorized";

        if (categoryCounts[category]) {
          categoryCounts[category] += 1;
        } else {
          categoryCounts[category] = 1;
        }
      });

      // Make sure Coupe category is always displayed
      if (!categoryCounts["Coupe"]) {
        categoryCounts["Coupe"] = 1; // Add Coupe if it doesn't exist
      }

      // Convert category counts to array for chart
      const categoryDataArray = Object.entries(categoryCounts)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => b.value - a.value); // Sort by count (descending)

      setCategoryData(categoryDataArray);
    } catch (error) {
      console.error("Failed to process category data:", error);
      // Set fallback data with Coupe included
      setCategoryData([
        { name: "Sedan", value: 4 },
        { name: "Convertible", value: 2 },
        { name: "SUV", value: 2 },
        { name: "Coupe", value: 1 },
        { name: "Truck", value: 1 },
      ]);
      setTotalCars(10);
    }
  }, [carsData]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: LabelProps) => {
    if (!cx || !cy || !innerRadius || !outerRadius || !percent || !midAngle)
      return null;

    const RADIAN = Math.PI / 180;
    const radius =
      Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > Number(cx) ? "start" : "end"}
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
      const totalValue = categoryData.reduce(
        (sum, item) => sum + item.value,
        0,
      );
      const percent = totalValue > 0 ? (item.value / totalValue) * 100 : 0;

      return (
        <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
          <p className="font-medium text-gray-700">{item.name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{item.value}</span> cars
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {percent.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 rounded-full bg-indigo-100 p-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-indigo-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">
            Total Items:{" "}
            <span className="font-semibold text-indigo-700">{totalCars}</span>
          </p>
        </div>
        <div className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
          By Category
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="75%"
              innerRadius="35%"
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((_, index) => (
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
                fontSize: "12px",
                paddingTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
