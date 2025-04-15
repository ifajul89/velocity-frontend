import { Link } from "react-router-dom";
import React from "react";

interface CarCardProps {
  carName: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  _id: string;
}

const CarCard: React.FC<CarCardProps> = ({
  carName,
  image,
  price,
  category,
  brand,
  _id,
}) => {
  return (
    <Link
      to={`/carDetails/${_id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-velo-red/30"
    >
      {/* Category Badge */}
      <div className="absolute right-3 top-3 z-10">
        <div className="bg-velo-red text-velo-white rounded-full px-4 py-1 text-xs font-semibold uppercase shadow-sm">
          {category}
        </div>
      </div>
      
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={`${brand} ${carName}`}
        />
      </div>
      
      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <div className="text-gray-500 text-sm font-medium mb-1">
          {brand}
        </div>
        
        {/* Model Name */}
        <h3 className="text-velo-black font-bold text-lg line-clamp-1 mb-2 group-hover:text-velo-red transition-colors">
          {carName}
        </h3>
        
        {/* Divider */}
        <div className="border-t border-gray-100 my-2"></div>
        
        {/* Price */}
        <div className="mt-auto">
          <p className="text-velo-red font-bold text-xl">
            USD {price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
