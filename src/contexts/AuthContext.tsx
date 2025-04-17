
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event);
        updateAuthState(newSession);
      }
    );

    // Initial session check
    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      updateAuthState(data.session);
      setIsLoading(false);
    };

    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateAuthState = (newSession: Session | null) => {
    setSession(newSession);
    setSupabaseUser(newSession?.user ?? null);
    setIsLoggedIn(!!newSession?.user);

    if (newSession?.user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      setUser(null);
    }
  };

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
