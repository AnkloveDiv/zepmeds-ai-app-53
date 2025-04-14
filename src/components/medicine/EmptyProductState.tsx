
import { Search } from "lucide-react";

const EmptyProductState = () => {
  return (
    <div className="bg-gray-800/30 rounded-lg p-8 text-center">
      <Search className="mx-auto h-10 w-10 text-gray-500 mb-3" />
      <h3 className="text-white font-semibold text-lg">No products found</h3>
      <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
    </div>
  );
};

export default EmptyProductState;
