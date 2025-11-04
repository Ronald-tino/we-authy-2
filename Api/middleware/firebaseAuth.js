import admin from "firebase-admin";
import createError from "../utils/createError.js";

/**
 * Lazy initialization of Firebase Admin
 * Called on first use to ensure environment variables are loaded
 */
const initializeFirebaseAdmin = () => {
  if (admin.apps.length) {
    return; // Already initialized
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized from environment variable");
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Use default credentials if available (for local dev with gcloud)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log("✅ Firebase Admin initialized with project ID");
    } else {
      console.warn(
        "⚠️ Firebase Admin not fully initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID"
      );
    }
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin:", error);
    throw error;
  }
};

/**
 * Middleware to verify Firebase ID token
 * Extracts token from Authorization header or cookies
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Initialize Firebase Admin on first use (lazy initialization)
    initializeFirebaseAdmin();

    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const cookieToken = req.cookies?.firebaseToken;
    const token = headerToken || cookieToken;

    if (!token) {
      return next(createError(401, "Unauthorized: No authentication token provided"));
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach Firebase user info to request
    req.firebaseUid = decodedToken.uid;
    req.firebaseUser = decodedToken;
    req.userId = null; // Will be set after MongoDB lookup
    
    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);
    if (error.code === "auth/id-token-expired") {
      return next(createError(401, "Token expired. Please sign in again."));
    }
    if (error.code === "auth/argument-error") {
      return next(createError(401, "Invalid token format."));
    }
    return next(createError(401, "Invalid or expired Firebase token"));
  }
};

/**
 * Middleware that verifies Firebase token and looks up MongoDB user
 * This is the main middleware to use for protected routes
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Initialize Firebase Admin on first use (lazy initialization)
    initializeFirebaseAdmin();

    // Get token from Authorization header or cookie
    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const cookieToken = req.cookies?.firebaseToken;
    const token = headerToken || cookieToken;

    if (!token) {
      return next(createError(401, "Unauthorized: No authentication token provided"));
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach Firebase user info to request
    req.firebaseUid = decodedToken.uid;
    req.firebaseUser = decodedToken;

    // Now look up MongoDB user by firebaseUid
    if (!req.firebaseUid) {
      return next(createError(401, "Firebase UID not found"));
    }

    // Import User model
    const User = (await import("../models/user.model.js")).default;
    const user = await User.findOne({ firebaseUid: req.firebaseUid });

    if (!user) {
      return next(
        createError(404, "User not found. Please complete your profile.")
      );
    }

    // Attach MongoDB user info to request
    req.userId = user._id.toString();
    req.isSeller = user.isSeller;

    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);
    if (error.code === "auth/id-token-expired") {
      return next(createError(401, "Token expired. Please sign in again."));
    }
    if (error.code === "auth/argument-error") {
      return next(createError(401, "Invalid token format."));
    }
    return next(createError(401, "Invalid or expired Firebase token"));
  }
};

