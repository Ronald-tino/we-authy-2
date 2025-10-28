import express from "express";
import {
  createContainer,
  updateContainer,
  deleteContainer,
  getContainer,
  getContainers,
  completeContainer,
  toggleInterest,
  getInterestedUsers,
} from "../controllers/container.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createContainer);
router.put("/:id", verifyToken, updateContainer);
router.delete("/:id", verifyToken, deleteContainer);
router.post("/:id/complete", verifyToken, completeContainer);
router.post("/:id/interest", verifyToken, toggleInterest);
router.get("/:id/interested", verifyToken, getInterestedUsers);
router.get("/single/:id", getContainer);
router.get("/", getContainers);

export default router;
