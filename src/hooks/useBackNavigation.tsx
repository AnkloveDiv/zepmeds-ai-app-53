
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useBackNavigation = (homeRoute: string = "/dashboard") => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Handle back button
    const handleBackButton = (e: PopStateEvent) => {
      // If we're already on the home page, show exit confirmation
      if (window.location.pathname === homeRoute) {
        e.preventDefault();
        if (window.confirm("Do you wish to exit the app?")) {
          // Exit app logic would go here for a mobile app
          // For web, we'd typically do nothing and let the browser handle it
        } else {
          // Stay in app - push a new entry to cancel the back
          window.history.pushState(null, "", window.location.pathname);
        }
      } else {
        // Navigate to home first and show toast
        e.preventDefault();
        navigate(homeRoute);
        window.history.pushState(null, "", homeRoute);
        
        toast({
          title: "Navigated to Home",
          description: "Press back again to exit the app",
          duration: 3000,
        });
      }
    };
    
    // Push an initial state
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);
    
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, homeRoute, toast]);
};

export default useBackNavigation;
