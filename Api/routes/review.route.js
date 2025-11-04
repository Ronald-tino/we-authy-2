import express from "express";
import { verifyToken } from "../middleware/firebaseAuth.js";
import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:sellerId", getReviews);
router.delete("/:id", deleteReview);

export default router;
