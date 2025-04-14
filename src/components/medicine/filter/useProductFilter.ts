
import { useState } from "react";
import { TrendingProduct } from "@/types/productTypes";

interface UseProductFilterProps {
  products: TrendingProduct[];
  searchQuery?: string;
}

export const useProductFilter = ({ products, searchQuery = "" }: UseProductFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popular");

  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const filterProducts = () => {
    let filteredProducts = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (activeFilter) {
      filteredProducts = filteredProducts.filter(
        product => product.category === activeFilter
      );
    }
    
    // Apply sorting
    if (sortBy === "price-low") {
      filteredProducts.sort((a, b) => {
        const aPrice = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const bPrice = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return aPrice - bPrice;
      });
    } else if (sortBy === "price-high") {
      filteredProducts.sort((a, b) => {
        const aPrice = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const bPrice = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return bPrice - aPrice;
      });
    } else if (sortBy === "discount") {
      filteredProducts.sort((a, b) => {
        const aDiscount = a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0;
        const bDiscount = b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0;
        return bDiscount - aDiscount;
      });
    } else if (sortBy === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    
    return filteredProducts;
  };

  return {
    activeFilter,
    sortBy,
    handleFilterClick,
    handleSortChange,
    filterProducts
  };
};
