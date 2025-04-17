
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useAuthGuard = (redirectPath = '/login') => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      navigate(redirectPath);
    }
  }, [isLoggedIn, isLoading, navigate, redirectPath, toast]);

  return {
    isAuthenticated: isLoggedIn,
    isAuthLoading: isLoading
  };
};
