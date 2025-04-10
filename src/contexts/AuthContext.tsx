
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  phoneNumber: string;
  name?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (phoneNumber: string) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (storedUser && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (phoneNumber: string) => {
    const newUser = { phoneNumber };
    setUser(newUser);
    setIsLoggedIn(true);
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

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
  };

  const value = {
    user,
    isLoggedIn,
    login,
    completeProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
