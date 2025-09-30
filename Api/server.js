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
const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

/////////////// Add middleware
app.use(express.json());
app.use(cookieParser());

//////////////
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO,{
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
app.listen(8800, () => {
  connect();
  console.log("Server is running on port 8800");
});

export default app;
