
import { TrendingProduct } from "@/types/productTypes";

/**
 * Adds a product to the cart or updates its quantity if it already exists
 */
export const addToCart = (
  product: TrendingProduct, 
  quantity: number = 1, 
  strips: number = 1
): number => {
  const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    existingCart[existingItemIndex].quantity += quantity;
    existingCart[existingItemIndex].stripQuantity = strips;
  } else {
    existingCart.push({
      ...product,
      quantity: quantity,
      stripQuantity: strips
    });
  }
  
  localStorage.setItem("cart", JSON.stringify(existingCart));
  
  return existingCart.length;
};

/**
 * Gets the current cart count from localStorage
 */
export const getCartCount = (): number => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.length;
};
