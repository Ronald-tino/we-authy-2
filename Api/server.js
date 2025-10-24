import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import gigRoute from "./routes/gig.route.js";
import reviewRoute from "./routes/review.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
//////////////////////////////
const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

/////////////// Add middleware
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//////////////
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      dbName: "Lug-db", // <-- Add this line
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

// Fix: Add missing / in all routes
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/auth", authRoute);

// Error middleware should be LAST
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong :( ";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});

export default app;
