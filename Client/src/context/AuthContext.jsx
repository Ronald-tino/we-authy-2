import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthChange,
  getCurrentFirebaseUser,
  getCurrentUserToken,
} from "../firebase/auth";
import newRequest from "../utils/newRequest";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync MongoDB user data when Firebase user changes
  const syncMongoUser = async (firebaseUid, firebaseEmail, displayName, photoURL) => {
    try {
      if (!firebaseUid) {
        setMongoUser(null);
        return;
      }

      // Get Firebase token for API call
      const token = await getCurrentUserToken();
      if (!token) {
        setMongoUser(null);
        return;
      }

      // Try to fetch/create MongoDB user data
      // This endpoint auto-creates minimal records if user doesn't exist
      try {
        const response = await newRequest.post("/auth/firebase-user", {
          firebaseUid,
          email: firebaseEmail,
          img: photoURL, // Pass Firebase photo for auto-creation
        });

        if (response.data?.user) {
          setMongoUser(response.data.user);
        } else {
          setMongoUser(null);
        }
      } catch (error) {
        // If there's an error, user might not exist yet or token is invalid
        if (error.response?.status === 404 || error.response?.status === 401) {
          setMongoUser(null);
        } else {
          console.error("Error syncing MongoDB user:", error);
          setMongoUser(null);
        }
      }
    } catch (error) {
      console.error("Error in syncMongoUser:", error);
      setMongoUser(null);
    }
  };

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);

      if (user) {
        // User is signed in - sync MongoDB data (passes displayName and photoURL)
        await syncMongoUser(user.uid, user.email, user.displayName, user.photoURL);
      } else {
        // User is signed out
        setMongoUser(null);
      }

      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Get combined user object (Firebase + MongoDB data)
  // Firebase UID is the primary identifier, with MongoDB _id as secondary
  const currentUser = firebaseUser
    ? {
        // Start with MongoDB data if available, otherwise empty object
        ...(mongoUser || {}),
        // Always override with Firebase data where relevant
        email: firebaseUser.email || mongoUser?.email,
        uid: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        // Use MongoDB _id if available, otherwise fallback to firebaseUid
        _id: mongoUser?._id || firebaseUser.uid,
        // Display name - prefer username from MongoDB, fallback to Firebase displayName or email
        username: mongoUser?.username || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        // Profile image - prefer MongoDB img, fallback to Firebase photoURL
        img: mongoUser?.img || firebaseUser.photoURL || "/img/noavatar.png",
        // Ensure we have the nested structure that some components expect
        info: mongoUser ? { ...mongoUser, email: firebaseUser.email, firebaseUid: firebaseUser.uid } : { 
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          img: firebaseUser.photoURL || "/img/noavatar.png",
          firebaseUid: firebaseUser.uid,
          _id: firebaseUser.uid // Use firebaseUid as fallback _id
        },
      }
    : null;

  // Refresh MongoDB user data (useful after profile updates)
  const refreshUser = async () => {
    if (firebaseUser) {
      await syncMongoUser(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, firebaseUser.photoURL);
    }
  };

  // Check if user profile is complete
  const isProfileComplete = () => {
    if (!mongoUser) return false;
    
    // Required fields: username and country
    const hasUsername = mongoUser.username && mongoUser.username.length > 0;
    const hasCountry = mongoUser.country && mongoUser.country !== "Not specified";
    
    return hasUsername && hasCountry;
  };

  // Sync currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const value = {
    firebaseUser,
    mongoUser,
    currentUser,
    loading,
    refreshUser,
    isAuthenticated: !!firebaseUser,
    profileIncomplete: firebaseUser && !isProfileComplete(),
    isProfileComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

