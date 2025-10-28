import express from "express";
import {
  deleteUser,
  getUser,
  getPublicUser,
  becomeSeller,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// Public routes (no auth required) - MUST come first
router.get("/public/:id", getPublicUser);

// Protected routes (auth required)
// Specific routes MUST come before parameterized routes (/:id)
router.put("/become-seller", verifyToken, becomeSeller);

// Parameterized routes (/:id) - MUST come last
router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);

export default router;
