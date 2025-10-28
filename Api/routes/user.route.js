import express from "express";
import {
  deleteUser,
  getUser,
  becomeSeller,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.put("/become-seller", verifyToken, becomeSeller);
export default router;
