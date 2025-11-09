import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["appetizer", "main_course", "dessert", "beverage", "snack"],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      required: true,
      min: 0,
    },
    dietaryInfo: {
      isVegetarian: {
        type: Boolean,
        default: false,
      },
      isVegan: {
        type: Boolean,
        default: false,
      },
      isGlutenFree: {
        type: Boolean,
        default: false,
      },
      containsAllergens: [String],
    },
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    customizations: [
      {
        name: String,
        options: [{
          name: String,
          price: Number,
        }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for searching by name and category
foodSchema.index({ name: "text", category: 1 });

// Index for filtering by restaurant and availability
foodSchema.index({ restaurant: 1, isAvailable: 1 });

const Food = mongoose.model("Food", foodSchema);
export default Food;
