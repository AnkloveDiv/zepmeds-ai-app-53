
import { motion } from "framer-motion";

interface SortButtonsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SortButtons = ({ sortBy, onSortChange }: SortButtonsProps) => {
  return (
    <div className="flex overflow-x-auto gap-2 scrollbar-hide py-2">
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          sortBy === "popular"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => onSortChange("popular")}
      >
        Popular
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          sortBy === "price-low"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => onSortChange("price-low")}
      >
        Price: Low to High
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          sortBy === "price-high"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => onSortChange("price-high")}
      >
        Price: High to Low
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          sortBy === "discount"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => onSortChange("discount")}
      >
        Highest Discount
      </button>
      <button
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
          sortBy === "rating"
            ? "bg-zepmeds-purple text-white"
            : "bg-gray-800 text-gray-400"
        }`}
        onClick={() => onSortChange("rating")}
      >
        Top Rated
      </button>
    </div>
  );
};

export default SortButtons;
