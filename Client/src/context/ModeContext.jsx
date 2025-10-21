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

  // Use state to track current user for proper reactivity
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Listen for changes to localStorage
  useEffect(() => {
    const handleUserUpdate = () => {
      setCurrentUser(getCurrentUser());
    };

    // Listen for custom user update event
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

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
  }, [currentUser, user, isSeller, currentMode]);

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
