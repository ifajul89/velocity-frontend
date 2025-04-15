import { CategoryPercentageDisplay } from "./Charts/CategoryPercentageDisplay";

export const StatsWidget = () => {
  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:w-1/2">
          <CategoryPercentageDisplay />
        </div>
      </div>
    </div>
  );
};
