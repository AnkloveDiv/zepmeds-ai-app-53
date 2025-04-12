
import React from "react";
import { useNavigate } from "react-router-dom";

const TrendingHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-white">Trending Products</h2>
      <button 
        className="text-sm text-zepmeds-purple"
        onClick={() => navigate("/medicine-delivery")}
      >
        View All
      </button>
    </div>
  );
};

export default TrendingHeader;
