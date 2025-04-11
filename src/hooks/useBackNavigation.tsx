
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
import { Capacitor } from "@capacitor/core";

export const useBackNavigation = (homeRoute: string = "/dashboard") => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [doubleBackToExitPressedOnce, setDoubleBackToExitPressedOnce] = useState(false);
  
  // Profile section routes
  const profileSectionRoutes = [
    "/patient-details", 
    "/addresses", 
    "/orders", 
    "/reports", 
    "/emergency", 
    "/wallet", 
    "/coupons", 
    "/offers"
  ];
  
  const isProfileSection = profileSectionRoutes.includes(location.pathname);
  
  useEffect(() => {
    // Check if running on a mobile device
    const isNative = Capacitor.isNativePlatform();
    
    // Handle profile section pages differently - go back to profile instead of home
    if (isProfileSection) {
      const handleProfileSectionBack = (e: PopStateEvent) => {
        e.preventDefault();
        navigate("/profile");
        
        toast({
          title: "Navigated to Profile",
          description: "Returned to your profile page",
          duration: 2000,
        });
        
        window.history.pushState(null, "", "/profile");
      };
      
      window.history.pushState(null, "", location.pathname);
      window.addEventListener("popstate", handleProfileSectionBack);
      
      // Android hardware back button for profile section
      const setupProfileHardwareBackPress = () => {
        if (isNative && (window as any).Capacitor?.Plugins?.App) {
          (window as any).Capacitor.Plugins.App.addListener('backButton', () => {
            navigate("/profile");
            toast({
              title: "Navigated to Profile",
              description: "Returned to your profile page",
              duration: 2000,
            });
          });
        }
      };
      
      setupProfileHardwareBackPress();
      
      return () => {
        window.removeEventListener("popstate", handleProfileSectionBack);
        if (isNative && (window as any).Capacitor?.Plugins?.App) {
          (window as any).Capacitor.Plugins.App.removeAllListeners();
        }
      };
    }
    // Only add the back button handler if we're not already on the home route
    else if (location.pathname !== homeRoute) {
      // Handle back button
      const handleBackButton = (e: PopStateEvent) => {
        e.preventDefault();
        
        // Navigate to home page regardless of current location
        navigate(homeRoute);
        
        // Show toast notification
        toast({
          title: "Navigated to Home",
          description: "Press back again to exit the app",
          duration: 3000,
        });
        
        // Push state to reset history
        window.history.pushState(null, "", homeRoute);
      };
      
      // Push initial state to ensure we can intercept back
      window.history.pushState(null, "", location.pathname);
      window.addEventListener("popstate", handleBackButton);
      
      // Android hardware back button handling
      const setupHardwareBackPress = () => {
        if (isNative && (window as any).Capacitor?.Plugins?.App) {
          (window as any).Capacitor.Plugins.App.addListener('backButton', () => {
            navigate(homeRoute);
            toast({
              title: "Navigated to Home",
              description: "Press back again to exit the app",
              duration: 3000,
            });
          });
        }
      };
      
      setupHardwareBackPress();
      
      return () => {
        window.removeEventListener("popstate", handleBackButton);
        if (isNative && (window as any).Capacitor?.Plugins?.App) {
          (window as any).Capacitor.Plugins.App.removeAllListeners();
        }
      };
    } else {
      // We're on the home route, show exit confirmation when back is pressed
      const handleExitApp = (e: PopStateEvent) => {
        e.preventDefault();
        setShowExitDialog(true);
        
        // Push state to prevent immediate exit
        window.history.pushState(null, "", homeRoute);
      };
      
      // Set up double back to exit on Android
      const setupDoubleBackToExit = () => {
        if (isNative && (window as any).Capacitor?.Plugins?.App) {
          (window as any).Capacitor.Plugins.App.addListener('backButton', () => {
            if (doubleBackToExitPressedOnce) {
              // User pressed back twice, show exit dialog
              setShowExitDialog(true);
            } else {
              // First back press
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
          });
        }
      };
      
      window.history.pushState(null, "", homeRoute);
      window.addEventListener("popstate", handleExitApp);
      setupDoubleBackToExit();
      
      return () => {
        window.removeEventListener("popstate", handleExitApp);
        if (isNative && (window as any).Capacitor?.Plugins?.App) {
          (window as any).Capacitor.Plugins.App.removeAllListeners();
        }
      };
    }
  }, [navigate, homeRoute, toast, location.pathname, doubleBackToExitPressedOnce, isProfileSection]);

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
