
import { useState, useEffect } from "react";
import { TrendingProduct } from "@/types/productTypes";
import { generateMedicineImage } from "@/utils/generateMedicineImage";
import { vitaminCImg, thermometerImg, painReliefImg, multivitaminImg } from "@/data/medicineData";

/**
 * Custom hook to generate images for products if needed
 */
export const useProductImages = (products: TrendingProduct[]) => {
  const [updatedProducts, setUpdatedProducts] = useState<TrendingProduct[]>(products);
  const [imagesGenerated, setImagesGenerated] = useState(false);

  useEffect(() => {
    if (!imagesGenerated) {
      const generateImages = async () => {
        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            if (
              product.image === vitaminCImg || 
              product.image === thermometerImg || 
              product.image === painReliefImg || 
              product.image === multivitaminImg
            ) {
              try {
                const generatedImage = await generateMedicineImage(
                  product.name, 
                  product.description
                );
                return { ...product, image: generatedImage };
              } catch (error) {
                console.error(`Failed to generate image for ${product.name}:`, error);
                return product;
              }
            }
            return product;
          })
        );
        
        setUpdatedProducts(productsWithImages);
        setImagesGenerated(true);
      };
      
      generateImages();
    }
  }, [imagesGenerated, products]);

  return { products: updatedProducts, imagesGenerated };
};
