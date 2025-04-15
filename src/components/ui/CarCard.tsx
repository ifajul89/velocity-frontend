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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-velo-red/30">
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
        
        {/* Price and Button in single row */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mt-4">
            <p className="text-velo-red font-bold text-xl">
              BDT {price.toLocaleString()}
            </p>
            
            <Link 
              to={`/carDetails/${_id}`}
              className="bg-velo-red hover:bg-velo-red/90 text-white font-semibold py-2 px-3 rounded-lg w-auto text-center transition-all duration-300 flex items-center justify-center gap-1 shadow-sm hover:shadow transform hover:-translate-y-0.5"
            >
              View details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
