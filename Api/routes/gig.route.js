import express from "express";
import { fn } from "../controllers/gig.controller.js";

const router = express.Router();

// Fix: Add a handler function
router.get("/test", fn); // Now it has the handler function

export default router;
