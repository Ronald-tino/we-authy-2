import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ModeContext = createContext();

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};

export const ModeProvider = ({ children }) => {
  // Get currentUser from AuthContext
  // ModeProvider must be nested inside AuthProvider (see App.jsx)
  const { currentUser } = useAuth();
  const [currentMode, setCurrentMode] = useState(() => {
    // Initialize from localStorage if available
    const savedMode = localStorage.getItem("userMode");
    return savedMode || "user";
  });

  const user = currentUser?.info || currentUser;
  const isSeller = user?.isSeller || false;

  // Debug logging
  useEffect(() => {
    console.log("ModeContext state:", {
      currentUser,
      user,
      isSeller,
      currentMode,
      isInSellerMode: isSeller && currentMode === "seller",
    });
  }, [user, isSeller, currentMode]);

  // Persist mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userMode", currentMode);
  }, [currentMode]);

  // Reset to user mode if user logs out (currentUser becomes null)
  useEffect(() => {
    if (!user) {
      setCurrentMode("user");
      localStorage.removeItem("userMode");
    }
  }, [user]);

  const toggleMode = () => {
    if (!isSeller) {
      console.warn("Only sellers can toggle mode");
      return;
    }
    setCurrentMode((prev) => (prev === "seller" ? "user" : "seller"));
  };

  const switchToSellerMode = () => {
    if (isSeller) {
      setCurrentMode("seller");
    }
  };

  const switchToUserMode = () => {
    setCurrentMode("user");
  };

  // Determine if seller features should be shown
  const isInSellerMode = isSeller && currentMode === "seller";

  const value = {
    currentUser,
    user,
    currentMode,
    isInSellerMode,
    isSeller,
    toggleMode,
    switchToSellerMode,
    switchToUserMode,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};
