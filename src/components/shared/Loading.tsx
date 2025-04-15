import React from "react";

const Loading = () => {
  return (
    <div className="container my-10 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-velo-red border-t-transparent rounded-full"></div>
    </div>
  );
};

export default Loading; 