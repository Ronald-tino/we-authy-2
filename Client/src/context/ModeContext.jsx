import React, { createContext, useContext, useState, useEffect } from "react";
import getCurrentUser from "../utils/getCurrentUser";

const ModeContext = createContext();

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};

export const ModeProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(() => {
    // Initialize from localStorage if available
    const savedMode = localStorage.getItem("userMode");
    return savedMode || "user";
  });

  // Check if user is actually a seller
  const currentUser = getCurrentUser();
  const user = currentUser?.info || currentUser;
  const isSeller = user?.isSeller || false;

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
    currentMode,
    isInSellerMode,
    isSeller,
    toggleMode,
    switchToSellerMode,
    switchToUserMode,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};
