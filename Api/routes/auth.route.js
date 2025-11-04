import express from "express";
import multer from "multer";
import { 
  logout, 
  login, 
  register, 
  syncFirebaseUser, 
  checkUsernameAvailability,
  checkUserExists,
  uploadProfileImage
} from "../controllers/auth.controller.js";
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

// Configure multer for in-memory storage (files will be in req.file.buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Legacy MongoDB auth endpoints (deprecated - kept for backward compatibility)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Username availability check - should be called BEFORE creating Firebase account
router.post("/check-username", checkUsernameAvailability);

// Check if user exists in MongoDB - used during sign-in flow
router.post("/check-user", checkUserExists);

// Firebase auth endpoint - sync/create MongoDB user after Firebase authentication
router.post("/firebase-user", verifyFirebaseToken, syncFirebaseUser);

// Server-side image upload endpoint (fallback for client-side upload failures)
router.post("/upload-profile-image", verifyFirebaseToken, upload.single('file'), uploadProfileImage);

export default router;
