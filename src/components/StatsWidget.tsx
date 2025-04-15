import { CategoryPercentageDisplay } from "./Charts/CategoryPercentageDisplay";

export const StatsWidget = () => {
  return (
    <div className="w-full p-5 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
          <CategoryPercentageDisplay />
        </div>
      </div>
    </div>
  );
}; 