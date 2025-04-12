
import { useEffect, useState } from "react";
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
import { Capacitor } from "@capacitor/core";

export const useBackNavigation = (homeRoute: string = "/dashboard") => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [doubleBackToExitPressedOnce, setDoubleBackToExitPressedOnce] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  
  // Profile section routes
  const profileSectionRoutes = [
    "/patient-details", 
    "/addresses", 
    "/orders", 
    "/reports", 
    "/emergency", 
    "/wallet", 
    "/coupons", 
    "/offers",
    "/schedule-medicines",
    "/about-developers",
    "/past-medicines"
  ];
  
  // Checkout flow routes - for step-by-step navigation
  const checkoutFlowRoutes = [
    "/medicine-delivery",
    "/cart",
    "/checkout",
    "/track-order"
  ];
  
  const isProfileSection = profileSectionRoutes.includes(location.pathname);
  const isCheckoutFlow = checkoutFlowRoutes.some(route => location.pathname.includes(route));
  
  // Get the previous page in checkout flow
  const getPreviousCheckoutPage = () => {
    const currentPathBase = location.pathname.split('/')[1]; // Get base path without ID
    const currentIndex = checkoutFlowRoutes.findIndex(route => route.includes(`/${currentPathBase}`));
    
    if (currentIndex > 0) {
      return checkoutFlowRoutes[currentIndex - 1];
    }
    return homeRoute;
  };
  
  // Update navigation history when location changes
  useEffect(() => {
    setNavigationHistory(prev => {
      // Don't add duplicate consecutive entries
      if (prev.length > 0 && prev[prev.length - 1] === location.pathname) {
        return prev;
      }
      
      // Add current location to history
      return [...prev, location.pathname];
    });
  }, [location.pathname]);
  
  useEffect(() => {
    // Check if running on a mobile device
    const isNative = Capacitor.isNativePlatform();
    
    // Handle standard back navigation
    const handleBackNavigation = (e: PopStateEvent) => {
      e.preventDefault();
      
      // Special handling for checkout flow
      if (isCheckoutFlow) {
        const previousPage = getPreviousCheckoutPage();
        navigate(previousPage);
        return;
      }
      
      // Get previous page from history
      const updatedHistory = [...navigationHistory];
      if (updatedHistory.length > 1) {
        // Remove current page
        updatedHistory.pop();
        // Get previous page
        const previousPage = updatedHistory[updatedHistory.length - 1];
        
        // Update history and navigate
        setNavigationHistory(updatedHistory);
        navigate(previousPage);
      } else {
        // If no history, show exit dialog or go to home
        if (location.pathname === homeRoute) {
          setShowExitDialog(true);
        } else {
          navigate(homeRoute);
          toast({
            title: "Navigated to Home",
            description: "Press back again to exit the app",
            duration: 3000,
          });
        }
      }
      
      // Push state to reset history
      window.history.pushState(null, "", location.pathname);
    };
    
    // Android hardware back button handling with step-by-step navigation
    const setupHardwareBackPress = () => {
      if (isNative && (window as any).Capacitor?.Plugins?.App) {
        (window as any).Capacitor.Plugins.App.addListener('backButton', () => {
          // Special handling for checkout flow
          if (isCheckoutFlow) {
            const previousPage = getPreviousCheckoutPage();
            navigate(previousPage);
            return;
          }
          
          const updatedHistory = [...navigationHistory];
          
          if (updatedHistory.length > 1) {
            // Remove current page
            updatedHistory.pop();
            // Get previous page
            const previousPage = updatedHistory[updatedHistory.length - 1];
            
            // Update history and navigate
            setNavigationHistory(updatedHistory);
            navigate(previousPage);
          } else {
            // Show exit dialog when at home or no history
            if (location.pathname === homeRoute) {
              if (doubleBackToExitPressedOnce) {
                setShowExitDialog(true);
              } else {
                setDoubleBackToExitPressedOnce(true);
                toast({
                  title: "Press back again to exit",
                  description: "Tap back button again to exit the application",
                  duration: 2000,
                });
                
                // Reset after 2 seconds
                setTimeout(() => {
                  setDoubleBackToExitPressedOnce(false);
                }, 2000);
              }
            } else {
              navigate(homeRoute);
            }
          }
        });
      }
    };
    
    // Push initial state to ensure we can intercept back
    window.history.pushState(null, "", location.pathname);
    window.addEventListener("popstate", handleBackNavigation);
    setupHardwareBackPress();
    
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
      if (isNative && (window as any).Capacitor?.Plugins?.App) {
        (window as any).Capacitor.Plugins.App.removeAllListeners();
      }
    };
  }, [navigate, homeRoute, toast, location.pathname, navigationHistory, doubleBackToExitPressedOnce, isCheckoutFlow]);

  // The dialog component that will be shown when user is on home page and presses back
  const ExitConfirmDialog = () => {
    if (!showExitDialog) return null;
    
    const handleExit = () => {
      setShowExitDialog(false);
      // In a real mobile app this would use a native exit API
      if (Capacitor.isNativePlatform() && (window as any).Capacitor?.Plugins?.App) {
        (window as any).Capacitor.Plugins.App.exitApp();
      } else {
        // For web this is a placeholder, as browsers control window closing
        toast({
          title: "Exit",
          description: "App would exit now if this was a native app",
          duration: 3000,
        });
      }
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
