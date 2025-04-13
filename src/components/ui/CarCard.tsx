import { Link } from "react-router-dom";

import React from "react";

interface CarCardProps {
  carName: string;
  image: string;
  price: number;
  category: string;
  brand: string;
}

const CarCard: React.FC<CarCardProps> = ({
  carName,
  image,
  price,
  category,
  brand,
}) => {
  return (
    <Link
      to="/"
      className="category-card-custom-hover hover:border-velo-red relative flex cursor-pointer flex-col items-center gap-1 overflow-hidden rounded-2xl border-[1.5px] bg-white p-3 duration-400 md:p-4"
    >
      <div className="absolute top-6 right-6 mb-5 w-full">
        <div className="bg-opacity-10 bg-velo-red border-velo-red text-velo-white ml-auto w-fit rounded-full px-3 py-[1px] text-xs uppercase md:text-base">
          {category}
        </div>
      </div>
      <img
        src={image}
        className="h-[230px] w-full rounded-xl object-cover"
        alt=""
      />
      <p className="custom-hover-category-name mt-3 text-velo-black line-clamp-1 text-center font-semibold duration-300 md:text-lg">
        {brand} {carName}
      </p>
      <p className="flex items-center gap-1 text-sm text-gray-500 md:text-base">
        USD {price}
      </p>
    </Link>
  );
};

export default CarCard;
