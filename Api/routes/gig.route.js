import express from "express";
import {
  createGig,
  updateGig,
  deleteGig,
  getGig,
  getGigs,
  completeGig,
  toggleInterest,
  getInterestedUsers,
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.put("/:id", verifyToken, updateGig);
router.delete("/:id", verifyToken, deleteGig);
router.post("/:id/complete", verifyToken, completeGig);
router.post("/:id/interest", verifyToken, toggleInterest);
router.get("/:id/interested", verifyToken, getInterestedUsers);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
