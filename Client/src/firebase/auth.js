import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { auth } from "./config";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user's ID token
 */
export const getCurrentUserToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    const token = await getIdToken(user, true); // Force refresh if needed
    return token;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
};

/**
 * Set up auth state listener
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current Firebase user
 */
export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};

/**
 * Link email/password credential to current user
 * This allows Google users to also sign in with email/password
 */
export const linkEmailPassword = async (email, password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }

    // Create email/password credential
    const credential = EmailAuthProvider.credential(email, password);

    // Link credential to current user
    const result = await linkWithCredential(user, credential);

    return result;
  } catch (error) {
    console.error("Error linking email/password:", error);
    throw error;
  }
};
