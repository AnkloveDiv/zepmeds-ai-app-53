
import { useState, useEffect } from "react";

interface UseTypingAnimationProps {
  placeholders: string[];
  enabled: boolean;
}

export const useTypingAnimation = ({ placeholders, enabled }: UseTypingAnimationProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const targetPlaceholder = placeholders[placeholderIndex];
      if (currentPlaceholder.length < targetPlaceholder.length) {
        setCurrentPlaceholder(targetPlaceholder.substring(0, currentPlaceholder.length + 1));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const reverseInterval = setInterval(() => {
            if (currentPlaceholder.length > 0) {
              setCurrentPlaceholder(currentPlaceholder.substring(0, currentPlaceholder.length - 1));
            } else {
              clearInterval(reverseInterval);
              setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
            }
          }, 50);
        }, 2000);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [currentPlaceholder, placeholderIndex, enabled, placeholders]);

  return { currentPlaceholder };
};
