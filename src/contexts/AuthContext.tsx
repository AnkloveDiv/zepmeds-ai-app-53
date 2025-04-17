
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface UserData {
  phoneNumber?: string;
  name?: string;
  address?: string;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event);
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Only perform synchronous state updates here
          setIsLoggedIn(true);
          
          // Then get user data (async) from localStorage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    );

    // Then check for an existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Auth session check:", data.session ? "Found session" : "No session");
        
        setSession(data.session);
        setSupabaseUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          setIsLoggedIn(true);
          
          // Load user data from localStorage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
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
    
    if (supabaseUser) {
      setSupabaseUser(supabaseUser);
    }
    
    if (session) {
      setSession(session);
    }
    
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
  };

  const completeProfile = (name: string, address: string) => {
    if (user) {
      const updatedUser = { ...user, name, address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.setItem("isLoggedIn", "false");
    } catch (error) {
      console.error("Error during logout:", error);
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
