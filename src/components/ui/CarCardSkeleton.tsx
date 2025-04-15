const CarCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border p-4 shadow-sm space-y-4">
      <div className="h-40 w-full bg-gray-300 rounded-lg" />
      <div className="h-4 w-3/4 bg-gray-300 rounded" />
      <div className="h-4 w-1/2 bg-gray-300 rounded" />
      <div className="h-4 w-1/3 bg-gray-300 rounded" />
    </div>
  );
};

export default CarCardSkeleton;
