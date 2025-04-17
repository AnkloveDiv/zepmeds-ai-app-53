
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useAuthGuard = (redirectPath = '/login') => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not already on the login page to prevent infinite redirect loops
    if (!isLoading && !isLoggedIn && location.pathname !== '/login' && location.pathname !== '/verify') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      navigate(redirectPath);
    }
  }, [isLoggedIn, isLoading, navigate, redirectPath, toast, location.pathname]);

  return {
    isAuthenticated: isLoggedIn,
    isAuthLoading: isLoading
  };
};
