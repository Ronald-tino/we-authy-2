import express from "express";
import { verifyToken } from "../middleware/firebaseAuth.js";
import {
  getOrders,
  createOrder,
  confirm,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/:id", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.put("/:id", verifyToken, confirm);

export default router;
