import mongoose from "mongoose";
const { Schema } = mongoose;

const ContainerSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    // Container specifications
    containerType: {
      type: String,
      enum: ["20ft", "40ft", "40ft-HC"],
      required: true,
    },
    cargoType: {
      type: String,
      required: true, // Types of cargo accepted
    },
    taxClearance: {
      type: String,
      enum: ["handled_by_courier", "paid_separately"],
      required: true,
    },
    // Location fields
    locationCountry: {
      type: String,
      required: true,
    },
    locationCity: {
      type: String,
      required: true,
    },
    // Capacity and pricing
    availableSpaceCBM: {
      type: Number,
      required: true, // in cubic meters
    },
    priceRMB: {
      type: Number,
      required: true, // per CBM in ¥
    },
    // Timeline
    departureDate: {
      type: Date,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    expirationDays: {
      type: Number,
      required: true, // e.g., 30 days
    },
    // Rating and sales
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // Users who have expressed interest in this container
    interestedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: undefined,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Container", ContainerSchema);
