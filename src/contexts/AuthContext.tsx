
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface UserData {
  phoneNumber?: string;
  name?: string;
  address?: string;
  email?: string;
}

interface AuthContextType {
  user: UserData | null;
  supabaseUser: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, supabaseUser?: User, session?: Session | null) => void;
  completeProfile: (name: string, address: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First, set up the auth state listener
    console.log("Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event, newSession?.user?.id);
        
        // Never call other Supabase functions directly here to avoid deadlocks
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);
        setIsLoggedIn(!!newSession?.user);
        
        if (newSession?.user) {
          // Only perform synchronous state updates here
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error("Error parsing stored user data", e);
            }
          } else {
            // If we have a session but no stored user info, create basic user info
            const basicUserInfo: UserData = {
              email: newSession.user.email,
              phoneNumber: newSession.user.phone || user?.phoneNumber
            };
            setUser(basicUserInfo);
            localStorage.setItem("user", JSON.stringify(basicUserInfo));
          }
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    );

    // Then check for an existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        console.log("Auth session check:", data.session ? `Found session for user ${data.session.user.id}` : "No session");
        
        setSession(data.session);
        setSupabaseUser(data.session?.user ?? null);
        setIsLoggedIn(!!data.session?.user);
        
        if (data.session?.user) {
          // Load user data from localStorage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error("Error parsing stored user data", e);
              // Create a basic user info if parsing fails
              const basicUserInfo: UserData = {
                email: data.session.user.email,
                phoneNumber: data.session.user.phone
              };
              setUser(basicUserInfo);
              localStorage.setItem("user", JSON.stringify(basicUserInfo));
            }
          } else {
            // If we have a session but no stored user info, create basic user info
            const basicUserInfo: UserData = {
              email: data.session.user.email,
              phoneNumber: data.session.user.phone
            };
            setUser(basicUserInfo);
            localStorage.setItem("user", JSON.stringify(basicUserInfo));
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []);

  const login = (phoneNumber: string, supabaseUser?: User, session?: Session | null) => {
    console.log("Login called with:", { phoneNumber, supabaseUser });
    
    const newUser = { 
      phoneNumber,
      email: supabaseUser?.email
    };
    
    setUser(newUser);
    setIsLoggedIn(true);
    
    if (supabaseUser) setSupabaseUser(supabaseUser);
    if (session) setSession(session);
    
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
    
    toast.success("Login successful!");
  };

  const completeProfile = (name: string, address: string) => {
    if (user) {
      const updatedUser = { ...user, name, address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.setItem("isLoggedIn", "false");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out");
    }
  };

  const value = {
    user,
    supabaseUser,
    session,
    isLoggedIn,
    isLoading,
    login,
    completeProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
