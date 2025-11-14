import mongoose from "mongoose";
const { Schema } = mongoose;

const GigSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false, // Made optional for backwards compatibility
    },
    about: {
      type: String,
      required: true, // New field for detailed gig description
    },
    // New location fields
    departureCountry: {
      type: String,
      required: true,
    },
    departureCity: {
      type: String,
      required: true,
    },
    destinationCountry: {
      type: String,
      required: true,
    },
    destinationCity: {
      type: String,
      required: true,
    },
    // New capacity and pricing fields
    availableSpace: {
      type: Number,
      required: true, // in kg
    },
    originalSpace: {
      type: Number,
      default: null, // stores initial space value for tracking changes
    },
    priceRMB: {
      type: Number,
      required: true, // per kg in ¥
    },
    originalPriceRMB: {
      type: Number,
      default: null, // stores initial price value for tracking changes
    },
    expirationDays: {
      type: Number,
      required: true, // e.g., 22 days
    },
    // Existing fields
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    cat: {
      type: String,
      required: false, // Made optional for backwards compatibility
    },
    price: {
      type: Number,
      required: false, // Made optional, priceRMB is the new field
    },
    cover: {
      type: String,
      required: false, // Made optional
    },
    images: {
      type: [String],
      required: false,
    },
    shortTitle: {
      type: String,
      required: false, // Made optional
    },
    shortDesc: {
      type: String,
      required: false, // Made optional
    },
    deliveryTime: {
      type: Number,
      required: false, // Made optional
    },
    revisionNumber: {
      type: Number,
      required: false, // Made optional
    },
    features: {
      type: [String],
      required: false,
    },
    sales: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // Users who have expressed interest in this gig
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

export default mongoose.model("Gig", GigSchema);
