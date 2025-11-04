import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add index for faster lookups
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add index for faster lookups
    },
    firebaseUid: {
      type: String,
      required: true, // Changed from false - now required for Firebase-first auth
      unique: true,
      index: true, // Add index for faster lookups
    },
    password: {
      type: String,
      required: false, // Optional - Firebase handles authentication
    },
    img: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    tripsCompleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
