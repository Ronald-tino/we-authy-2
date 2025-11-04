import express from "express";
import { logout, login, register, syncFirebaseUser } from "../controllers/auth.controller.js";
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

// Legacy MongoDB auth endpoints (deprecated - kept for backward compatibility)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Firebase auth endpoint - sync/create MongoDB user after Firebase authentication
router.post("/firebase-user", verifyFirebaseToken, syncFirebaseUser);

export default router;
