
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const useBackNavigation = (homeRoute: string = "/dashboard") => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  useEffect(() => {
    // Only add the back button handler if we're not already on the home route
    if (location.pathname !== homeRoute) {
      // Handle back button
      const handleBackButton = (e: PopStateEvent) => {
        e.preventDefault();
        
        // Navigate to home page regardless of current location
        navigate(homeRoute);
        
        // Show toast notification
        toast({
          title: "Back to Home",
          description: "Press back again to exit the app",
          duration: 3000,
        });
        
        // Push state to reset history
        window.history.pushState(null, "", homeRoute);
      };
      
      // Push initial state to ensure we can intercept back
      window.history.pushState(null, "", location.pathname);
      window.addEventListener("popstate", handleBackButton);
      
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    } else {
      // We're on the home route, show exit confirmation when back is pressed
      const handleExitApp = (e: PopStateEvent) => {
        e.preventDefault();
        setShowExitDialog(true);
        
        // Push state to prevent immediate exit
        window.history.pushState(null, "", homeRoute);
      };
      
      window.history.pushState(null, "", homeRoute);
      window.addEventListener("popstate", handleExitApp);
      
      return () => {
        window.removeEventListener("popstate", handleExitApp);
      };
    }
  }, [navigate, homeRoute, toast, location.pathname]);

  // The dialog component that will be shown when user is on home page and presses back
  const ExitConfirmDialog = () => {
    if (!showExitDialog) return null;
    
    const handleExit = () => {
      setShowExitDialog(false);
      // In a real mobile app this would use a native exit API
      // For web this is a placeholder, as browsers control window closing
      toast({
        title: "Exit",
        description: "App would exit now if this was a native app",
        duration: 3000,
      });
    };
    
    const handleCancel = () => {
      setShowExitDialog(false);
    };
    
    return (
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-background text-foreground border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the app?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExit} className="bg-red-500 hover:bg-red-600">
              Yes, Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return { ExitConfirmDialog };
};

export default useBackNavigation;
