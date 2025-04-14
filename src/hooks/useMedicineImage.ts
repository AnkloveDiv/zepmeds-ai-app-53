
import { useState, useEffect } from "react";
import { generateMedicineImage } from "@/utils/generateMedicineImage";

export function useMedicineImage(medicineName: string, description?: string) {
  const [image, setImage] = useState<string>("/placeholder.svg");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const generatedImage = await generateMedicineImage(medicineName, description);
        setImage(generatedImage);
        
      } catch (err) {
        console.error("Error loading medicine image:", err);
        setError("Failed to load medicine image");
        setImage("/placeholder.svg");
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [medicineName, description]);

  return { image, isLoading, error };
}
