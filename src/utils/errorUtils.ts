
import { toast } from "../components/ui/use-toast";

export const handleApiError = (error: any, fallbackMessage: string = "An error occurred"): void => {
  console.error(error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
    duration: 5000,
  });
};

export const displaySuccessToast = (message: string, title: string = "Success"): void => {
  toast({
    title,
    description: message,
    duration: 3000,
  });
};
