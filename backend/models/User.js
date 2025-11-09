import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentDetails: {
      cardNumber: String,
      expiryDate: String,
      cvv: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery_partner"],
      default: "user",
    },
    // Delivery Partner specific fields
    deliveryPartner: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      currentLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
      bankDetails: {
        accountNumber: String,
        bankName: String,
        ifscCode: String,
        accountHolderName: String,
      },
      activeStatus: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
