
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAuthGuard = (redirectPath = '/login') => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if already on the login page to prevent infinite redirect loops
    if (location.pathname === '/login' || location.pathname === '/verify') {
      setAuthChecked(true);
      return;
    }

    const checkAuth = async () => {
      // Get the current session directly from Supabase
      const { data } = await supabase.auth.getSession();
      
      if (!data.session && !isLoggedIn) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        
        // Save the current path to redirect back after login
        navigate(redirectPath, { 
          state: { redirectAfterLogin: location.pathname }
        });
      }
      
      setAuthChecked(true);
    };
    
    if (!isLoading) {
      checkAuth();
    }
  }, [isLoggedIn, isLoading, navigate, redirectPath, toast, location.pathname]);

  return {
    isAuthenticated: isLoggedIn,
    isAuthLoading: isLoading || !authChecked
  };
};
