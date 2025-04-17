
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthGuard = (redirectPath = '/login') => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if already on the login page to prevent infinite redirect loops
    if (location.pathname === '/login' || location.pathname === '/verify') {
      setAuthChecked(true);
      return;
    }

    const checkAuth = async () => {
      console.log("Checking auth in useAuthGuard");
      // Get the current session directly from Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking auth session:", error);
        toast.error("Authentication error. Please try logging in again.");
      }
      
      if (!data.session && !isLoggedIn) {
        console.log("No auth session found, redirecting to login");
        uiToast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        
        // Save the current path to redirect back after login
        navigate(redirectPath, { 
          state: { redirectAfterLogin: location.pathname }
        });
      } else {
        console.log("Auth session found:", data.session?.user?.id);
      }
      
      setAuthChecked(true);
    };
    
    if (!isLoading) {
      checkAuth();
    }
  }, [isLoggedIn, isLoading, navigate, redirectPath, uiToast, location.pathname]);

  return {
    isAuthenticated: isLoggedIn,
    isAuthLoading: isLoading || !authChecked
  };
};

export default useAuthGuard;
